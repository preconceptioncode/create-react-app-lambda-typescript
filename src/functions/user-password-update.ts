import TrueVaultClient from "truevault";

const scopedAccessToken = process.env.TRUEVAULT_PASSWORD_RESET_TOKEN;

const passwordResetFlowId = process.env.TRUEVAULT_PASSWORD_RESET_FLOW_ID;

export async function handler(event: any) {
  const data = JSON.parse(event.body);
  console.log(data);
  const { password, httpAuth, user_id } = data;
  const tvClient = new TrueVaultClient({
    httpBasic: httpAuth
  });

  try {
    const response = await tvClient.updateUserPassword(user_id, password);

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
