import { TUser, TUserAttributes } from "../stores/User/types";

import { TUpdateUserPayload } from "../api/TrueVaultAPI";
import TrueVaultClient from "truevault";

const { APP_VERSION } = process.env;

type TData = {
  accessToken: string;
  user_id: string;
  payload: TUpdateUserPayload;
};

function AssertNever(object: never) {
  throw new Error("Unexpected Object");
}
export async function handler(event: any) {
  const data: TData = JSON.parse(event.body);
  const { accessToken, user_id, payload } = data;

  console.log("Data", data);

  const updateUserTvClient = new TrueVaultClient({
    accessToken: accessToken
  });

  const readUserTvClient = new TrueVaultClient({
    accessToken: accessToken
  });

  const currentUser: TUser = await readUserTvClient.readUser(user_id);

  const { attributes: currentAttributes } = currentUser;

  let desiredAttributes: TUserAttributes;

  switch (payload.target) {
    case "consent_call":
      const updatedConsentCalls = currentAttributes.consent_calls.unshift(
        payload.data
      );
      desiredAttributes = Object.assign(currentAttributes, {
        consent_calls: updatedConsentCalls
      });
      break;
    case "contact":
      const updatedContacts = currentAttributes.contacts.unshift(payload.data);
      desiredAttributes = Object.assign(currentAttributes, {
        contacts: updatedContacts
      });
      break;
    case "hiv_consent":
      const updatedHIVConsents = currentAttributes.contacts.unshift(
        payload.data
      );
      desiredAttributes = Object.assign(currentAttributes, {
        hiv_consent_forms: updatedHIVConsents
      });
      break;
    case "profile":
      desiredAttributes = Object.assign(currentAttributes, {
        profile: payload.data
      });
      break;
    case "purchase":
      const updatedPurchases = currentAttributes.purchases.unshift(
        payload.data
      );
      desiredAttributes = Object.assign(currentAttributes, {
        purchases: updatedPurchases
      });
      break;
    case "signup_agreement":
      const updatedSignUpAgreements = currentAttributes.signup_agreements.unshift(
        payload.data
      );
      desiredAttributes = Object.assign(currentAttributes, {
        signup_agreements: updatedSignUpAgreements
      });
      break;
    case "standard_consent":
      const updatedStandardConsents = currentAttributes.standard_consent_forms.unshift(
        payload.data
      );
      desiredAttributes = Object.assign(currentAttributes, {
        standard_consent_forms: updatedStandardConsents
      });
      break;
    case "user_progress_level":
      desiredAttributes = Object.assign(currentAttributes, {
        user_progress_level: payload.data
      });
      break;
    case "username":
      //Handle Updating Username
      desiredAttributes;
      break;
    default:
      AssertNever(payload.target);
  }

  try {
    const updatedUser = await updateUserTvClient.updateUserAttributes(
      user_id,
      desiredAttributes
    );

    const fullUser = await updateUserTvClient.readCurrentUser();

    const {
      access_key,
      account_id,
      external_key_hash,
      id,
      status,
      group_ids,
      ...user
    } = fullUser;

    return {
      statusCode: 200,
      body: JSON.stringify({
        user,
        status: "succeeded",
        connected: true,
        authenticated: true
      })
    };
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 200,
      body: JSON.stringify({
        error,
        connected: true,
        authenticated: false,
        status: "failed"
      }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
