import TrueVaultClient from "truevault";

const scopedAccessToken = process.env.TRUEVAULT_PASSWORD_RESET_TOKEN;

const passwordResetFlowId = process.env.TRUEVAULT_PASSWORD_RESET_FLOW_ID;

export async function handler(event: any) {
  console.log(passwordResetFlowId, scopedAccessToken);
  const data = JSON.parse(event.body);
  const { username } = data;
  console.log(username);
  const basedToken = Buffer.from(scopedAccessToken).toString("base64");
  const aphendedScopedAccessToken = basedToken + ":";
  const tvClient = new TrueVaultClient({
    httpBasic: aphendedScopedAccessToken
  });

  try {
    const response = await tvClient.sendPasswordResetEmail(
      passwordResetFlowId,
      username
    );

    console.log(response);

    return {
      statusCode: 200,
      body: JSON.stringify({
        response,
        status: "succeeded",
        connected: true,
        authenticated: true
      })
    };
  } catch (error) {
    console.log("Password Reset Failed: Transaction ID", error.transaction_id);
    console.log("ERROR", error); // output to netlify function log
    return {
      statusCode: 200,
      body: JSON.stringify({
        connected: true,
        authenticated: false,
        status: "failed"
      })
    };
  }
}
