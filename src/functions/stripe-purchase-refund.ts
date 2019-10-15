import produce from "immer";
import Stripe from "stripe";
import TrueVaultClient from "truevault";
import { TPurchase, TRefund, TUserAttributes } from "../store/types";

const STRIPE_KEY = process.env.STRIPE_KEY;

export async function handler(event: any) {
  const data = JSON.parse(event.body);
  const { payment_intent, accessToken, user_id } = data;
  try {
    const currentAttributes = await checkAuthenticationWithTrueVault(
      accessToken
    );

    try {
      const refund = await refundWithStripe(payment_intent);

      const user = await updateUserPurchaseInTrueVault(
        currentAttributes,
        user_id,
        accessToken,
        payment_intent,
        refund
      );

      const { attributes } = user;

      return {
        statusCode: 200,
        body: JSON.stringify({
          attributes,
          connected: true,
          status: "succeeded",
          authenticated: true
        })
      };
    } catch (error) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error,
          connected: true,
          status: "incomplete",
          authenticated: true
        })
      };
    }
  } catch (error) {
    console.log(`TrueVault Authentication Error: ${error}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        error,
        connected: true,
        status: "failed",
        authenticated: false
      })
    };
  }
}

async function refundWithStripe(payment_intent: string) {
  console.log(STRIPE_KEY);
  const stripe = Stripe(STRIPE_KEY);

  const intent = await stripe.paymentIntents.retrieve(payment_intent);

  try {
    const refund = await stripe.refunds.create({
      charge: intent.charges.data[0].id
    });
    console.log("REFUND SUCCESSFUL", refund);
    return refund;
  } catch (error) {
    console.log("REFUND ERROR", error);
    return error;
  }
}

async function checkAuthenticationWithTrueVault(
  accessToken: string
): Promise<TUserAttributes> {
  try {
    const auth = await new TrueVaultClient({
      accessToken: accessToken
    });
    const fullUser = await auth.readCurrentUser();

    const { attributes } = fullUser;

    return attributes;
  } catch (error) {
    console.log("Authentication Failed", error);
    return error;
  }
}

async function updateUserPurchaseInTrueVault(
  currentAttributes: TUserAttributes,
  user_id: string,
  accessToken: string,
  payment_intent: string,
  refund: TRefund
) {
  const { purchases: currentPurchases, results } = currentAttributes;

  try {
    const updatedPurchases = currentPurchases.map(purchase =>
      purchase.payment_intent == payment_intent
        ? updatePurchaseStatus(purchase, refund)
        : purchase
    );

    // Updating attributes with refunded purchase, depending on whether the user has results to see or not -
    // resetting the user_progress_level to what it was before this refunded purchase
    const updatedAttributes = Object.assign(
      {},
      currentAttributes,
      {
        purchases: updatedPurchases
      },
      { user_progress_level: results.length > 0 ? "processed" : "registered" }
    );
    const auth = await new TrueVaultClient({
      accessToken: accessToken
    });

    await auth.updateUserAttributes(user_id, updatedAttributes);

    const fullUser = await auth.readCurrentUser();

    return fullUser;
  } catch (error) {
    console.log("Error Updating Purchase Attributes in TrueVault", error);
  }
}

function updatePurchaseStatus(purchase: TPurchase, refund: TRefund) {
  const updatedPurchase = produce(purchase, draft => {
    draft.purchase_status = "refunded";
    draft.refund_data = refund;
  });
  return updatedPurchase;
}
