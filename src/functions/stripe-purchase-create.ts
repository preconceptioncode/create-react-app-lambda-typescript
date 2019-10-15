import faunadb from "faunadb";
import Stripe from "stripe";
import TrueVaultClient from "truevault";
import { TPurchase } from "../store/types";

const { APP_VERSION } = process.env;

const secret = "fnADUuNzofACCUiGNhuVb_PLiQslhvtOCB2VWyzF";
/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: secret
});

const updateUserTvClient = new TrueVaultClient({
  apiKey: "9dae59b0-c29e-4bac-9158-1fbc4c9a5a5d"
});

const readUserTvClient = new TrueVaultClient({
  apiKey: "9dae59b0-c29e-4bac-9158-1fbc4c9a5a5d"
});

export async function handler(event: any) {
  const sig = event.headers["stripe-signature"];

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  //@ts-ignore
  const stripe = Stripe("sk_test_GWwxZLwqxLs7m0NtujzXGXLb00NvSYJPIx");
  // Find your endpoint's secret in your Dashboard's webhook settings
  const endpointSecret = "whsec_nU0sqB3AMefSrSugqvwHJHk0oUKoNFvE";

  try {
    const stripeData = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
    if (stripeData.type === "checkout.session.completed") {
      const session = stripeData.data.object;
      const {
        client_reference_id,
        display_items,
        created,
        id: purchase_id,
        payment_intent
      } = session;

      console.log("Stripe Data: ", stripeData);
      try {
        const response = await Promise.all([
          setUserAttributesToPurchased(
            client_reference_id,
            display_items[0],
            purchase_id,
            payment_intent
          ),
          createPurchaseInFaunaDB(
            client_reference_id,
            display_items[0],
            purchase_id,
            created
          ),
          createPurchaseFulfillmentTaskInFaunaDB(client_reference_id)
        ]);
        const [user, purchase] = response;
        return {
          user,
          purchase
        };
      } catch (error) {
        console.log("Purchase Fulfillment Error", error);
        const response = await client.query(
          q.Create(q.Collection("Events"), {
            data: {
              type: "error",
              error,
              description: `Error when fulfilling purchase at ${new Date().toLocaleString()}`
            }
          })
        );
        return response;
      }
    }
    console.log("Stripe Purchase Verified", stripeData);
    const response = createSuccessfulPurchaseEvent(
      "Stripe Purchase Verified",
      stripeData
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        received: true,
        response
      })
    };
  } catch (error) {
    console.log(`Webhook Error: ${error.message}`);
    const response = await createErrorEvent(
      `Webhook Error: ${error.message}`,
      error
    );
    return response;
  }
}

async function setUserAttributesToPurchased(
  user_id: string,
  order: TPurchase,
  stripe_id: string,
  payment_intent: string
) {
  const currentUser = await readUserTvClient.readUser(user_id);

  const { attributes: currentAttributes } = currentUser;

  const { purchases } = currentAttributes;

  const orderWithStripeID = Object.assign(
    order,
    { stripe_id: stripe_id },
    {payment_intent: payment_intent},
    { purchase_status: "unfulfilled" },
    { purchase_timestamp: new Date().getTime() / 1000 }
  );

  purchases.unshift(orderWithStripeID);

  const desiredAttributes = {
    purchases,
    user_progress_level: "purchased",
    app_version: APP_VERSION
  };

  const updatedAttributes = Object.assign(currentAttributes, desiredAttributes);

  try {
    const data = await updateUserTvClient.updateUserAttributes(
      user_id,
      updatedAttributes
    );
    return {
      data,
      status: "succeeded",
      connected: true,
      authenticated: true
    };
  } catch (error) {
    console.log(
      `There was an error updating ${user_id}'s 'progress' and 'purchase' attributes`,
      error
    );
    const response = await createErrorEvent(
      `There was an error updating ${user_id}'s 'progress' and 'purchase' attribute`,
      error
    );
    return response;
  }
}

async function createPurchaseInFaunaDB(
  id: string,
  order: TPurchase,
  stripe_id: string,
  created_at: string
) {
  try {
    const data = await client.query(
      q.Create(q.Collection("Purchases"), {
        data: { id, order, stripe_id, created_at }
      })
    );
    return {
      data,
      status: "succeeded",
      connected: true,
      authenticated: true
    };
  } catch (error) {
    console.log(`Error creating purchase in FaunaDB for user: ${id}`, error);
    const response = await createErrorEvent(
      `Error creating purchase in FaunaDB for user: ${id}`,
      error
    );
    return response;
  }
}

async function createPurchaseFulfillmentTaskInFaunaDB(id: string) {
  const currentTime = Math.round(new Date().getTime() / 1000);

  const taskData = {
    id,
    key: id,
    resolved: false,
    assignee: undefined,
    assigned: false,
    type: "purchase",
    status: "incomplete",
    created: currentTime
  };
  try {
    const data = await client.query(
      q.Create(q.Collection("Tasks"), { data: taskData })
    );
    return {
      data,
      status: "succeeded"
    };
  } catch (error) {
    console.log(
      `Error creating purchase fulfillment task in FaunaDB for user: ${id}`,
      error
    );
    createErrorEvent(
      `Error creating purchase fulfillment task in FaunaDB for user: ${id}`,
      error
    );
  }
}

async function createErrorEvent(description: string, error: any) {
  const response = await client.query(
    q.Create(q.Collection("Events"), {
      data: {
        type: "error",
        error,
        description
      }
    })
  );
  return response;
}

function createSuccessfulPurchaseEvent(description: string, data: any) {
  const response = client.query(
    q.Create(q.Collection("Events"), {
      data: {
        type: "purchase",
        data,
        description
      }
    })
  );
  return response;
}


const test = {
  "id": "evt_1FJqKIHIlhQVdFRxtTjx85UK",
  "object": "event",
  "api_version": "2019-05-16",
  "created": 1568763798,
  "data": {
    "object": {
      "id": "cs_test_BWZjnc3Ey0C1RqWLv9HTJ8B7CiIYwMUqy6geTWHyIG3fWHNIkb7erZja",
      "object": "checkout.session",
      "billing_address_collection": null,
      "cancel_url": "https://app.preconceptiontest.com/order",
      "client_reference_id": "2afb3dd0-b8bc-4c96-a215-6a6139e2c77a",
      "customer": "cus_FpVKyeMwqBRMek",
      "customer_email": null,
      "display_items": [
        {
          "amount": 28900,
          "currency": "usd",
          "quantity": 1,
          "sku": {
            "id": "sku_FENwHme7asLcpf",
            "object": "sku",
            "active": true,
            "attributes": {
              "name": "Essential"
            },
            "created": 1560202594,
            "currency": "usd",
            "image": "https://files.stripe.com/links/fl_test_eHBn6A9rCxxIde1mkUpdjBoq",
            "inventory": {
              "quantity": null,
              "type": "infinite",
              "value": null
            },
            "livemode": false,
            "metadata": {
            },
            "package_dimensions": null,
            "price": 28900,
            "product": "prod_FENwccF6PkFeVn",
            "updated": 1564610697
          },
          "type": "sku"
        }
      ],
      "livemode": false,
      "locale": null,
      "mode": "payment",
      "payment_intent": "pi_1FJqJsHIlhQVdFRxuOuRuRmR",
      "payment_method_types": [
        "card"
      ],
      "setup_intent": null,
      "submit_type": null,
      "subscription": null,
      "success_url": "https://app.preconceptiontest.com/results?session_id={CHECKOUT_SESSION_ID}"
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "checkout.session.completed"
}