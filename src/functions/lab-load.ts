const CryptoJS = require("crypto-js");
import TrueVaultClient from "truevault";

const key = process.env.PWN_API_KEY;
const secret = process.env.PWN_API_SECRET;
const test = process.env.TRUEVAULT_RESULT_KEY;

// This doesn't need to be modified.
function base64url(source: any) {
  // Encode in classical base64
  let encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, "");

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");

  return encodedSource;
}

function payload() {
  var now = Math.floor(Date.now() / 1000);
  let content: any = { iss: null, iat: null, exp: null, ver: null };
  content.iss = key;
  content.iat = now;
  content.exp = now + 24 * 60 * 60; // 1 day
  content.ver = 1;
  return content;
}

var header = {
  typ: "JWT",
  alg: "HS256"
};

// encode header
var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
var encodedHeader = base64url(stringifiedHeader);

// encode data
var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload()));
var encodedData = base64url(stringifiedData);

// build token
var token = encodedHeader + "." + encodedData;

// sign token
var signature = CryptoJS.HmacSHA256(token, secret);
signature = base64url(signature);
var signedToken = token + "." + signature;

export async function handler(event: any) {
  const data = JSON.parse(event.body);
  const { accessToken } = data;

  try {
    console.log("should say zeet in Production logs", test);
    await new TrueVaultClient({ accessToken: accessToken });
    return {
      statusCode: 200,
      body: JSON.stringify({
        signedToken,
        status: "succeeded",
        connected: true,
        authenticated: true
      })
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error,
        connected: true,
        authenticated: false,
        status: "failed"
      })
    };
  }
}
