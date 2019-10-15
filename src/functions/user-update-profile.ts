import TrueVaultClient from "truevault";

const { APP_VERSION } = process.env;

export async function handler(event: any) {
  const data = JSON.parse(event.body);
  console.log(data);
  const { accessToken, user_id, profile } = data;

  const updateUserTvClient = new TrueVaultClient({
    accessToken: accessToken
  });

  const readUserTvClient = new TrueVaultClient({
    accessToken: accessToken
  });

  const currentUser = await readUserTvClient.readUser(user_id);

  const { attributes } = currentUser;

  //@ts-ignore
  const updatedAttributes = Object.assign(attributes, { profile });

  try {
    await updateUserTvClient.updateUserAttributes(user_id, updatedAttributes);

    const user = await updateUserTvClient.readCurrentUser();

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
