import TrueVaultClient from "truevault";

const accountID = "d3eec872-7b80-499d-b67d-b2ab2ebdaf0c";

export async function handler(event: any) {
  const data = JSON.parse(event.body);
  const { email: emailusername, password } = data;
  try {
    // password auth client
    //emailusername chosen due to naming conflicts
    const auth = await TrueVaultClient.login(
      accountID,
      emailusername,
      password
    );
    const { _accessToken: access_token } = auth;
    // The login endpoint doesn't return user attributes. We need those to get the user's name and role, so
    // we load the full user object.
    const fullUser = await auth.readCurrentUser();

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
        access_token,
        user,
        status: "succeeded",
        connected: true,
        authenticated: true
      })
    };
  } catch (error) {
    console.log("LogIn Failed: Transaction ID", error.transaction_id);
    console.log("ERROR", error); // output to netlify function log
    return {
      statusCode: 200,
      body: JSON.stringify({
        connected: true,
        authenticated: false,
        status: "failed"
      }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
