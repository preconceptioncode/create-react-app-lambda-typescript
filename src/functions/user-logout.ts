import TrueVaultClient from "truevault";

export async function handler(event: any) {
  const data = JSON.parse(event.body);
  const { accessToken } = data;
  try {
    const auth = await new TrueVaultClient({ accessToken: accessToken });
    await auth.logout();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "succeeded",
        connected: true,
        authenticated: true
      })
    };
  } catch (error) {
    console.log("LogOut Failed: Transaction ID", error.transaction_id);
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
