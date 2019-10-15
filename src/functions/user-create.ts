import { APIGatewayEvent } from "aws-lambda";
import { TUserAttributes } from "../store/types";
import TrueVaultClient from "truevault";

type TUserCreationInitalResponse = {
  access_key: null;
  access_token: string;
  account_id: string;
  api_key: string;
  id: string;
  status: string;
  user_id: string;
  username: string;
};

type TUserCreateFunctionRejection = {
  error: any;
  connected: boolean;
  authenticated: any;
  status: "disconnected";
};

type TTrueVaultUserResponse = {
  access_key: null | string;
  access_token: string;
  account_id: string;
  api_key: string;
  id: string;
  status: string;
  user_id: string;
  username: string;
  external_key_hash: any;
  group_ids: string[];
  attributes: TUserAttributes;
};

export type TUserCreateFunctionResponse = {
  user: TTrueVaultUserResponse;
  status: "succeeded" | "failed";
  connected: boolean;
  authenticated: boolean;
  access_token: string;
};

interface createUserTvClient {
  createUser(
    email: string,
    password: string,
    attributes: TUserAttributes,
    groupdIDs: string[]
  ): TUserCreateFunctionResponse | TUserCreateFunctionRejection;
}

const { APP_VERSION } = process.env;

const createUserTvClient: createUserTvClient = new TrueVaultClient({
  apiKey: "8ae03bf3-6596-4bce-aa9b-2d0c4dfbc2c2"
});

export async function handler(event: APIGatewayEvent) {
  //@ts-ignore
  const data = JSON.parse(event.body);
  let { email, password, attributes } = data;

  const updatedAttributes = Object.assign(attributes, {
    app_version: APP_VERSION,
    user_progress_level: "registered"
  });

  try {
    const tvUser: Partial<
      TUserCreationInitalResponse
    > = await createUserTvClient.createUser(
      email,
      password,
      updatedAttributes,
      ["ba95d9d7-fae7-4823-a0ca-c822268ac92b"]
    );

    const auth = await new TrueVaultClient({
      accessToken: tvUser.access_token
    });
    // The new Client endpoint doesn't return user attributes. We need those to get the user's name and role, so
    // we load the full user object.
    const fullUser: TTrueVaultUserResponse = await auth.readCurrentUser();

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
        access_token: tvUser.access_token,
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
      })
    };
  }
}
