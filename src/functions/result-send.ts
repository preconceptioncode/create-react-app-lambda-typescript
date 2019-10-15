import axios from "axios";
import TrueVaultClient from "truevault";
const CryptoJS = require("crypto-js");
const InterFAX = require("interfax");
const fs = require("fs");
const toArray = require("stream-to-array");
const util = require("util");

const key = process.env.PWN_API_KEY;
const secret = process.env.PWN_API_SECRET;
const apiKey = process.env.TRUEVAULT_PWN_KEY;

const updateUserTvClient = new TrueVaultClient({
  apiKey
});

const readUserTvClient = new TrueVaultClient({
  apiKey
});

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
  var now = Math.floor(Date.now() / 1000 - 1000);
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

const interfax = new InterFAX({
  username: process.env.INTERFAX_USERNAME,
  password: process.env.INTERFAX_PASSWORD
}); // passing true enables debugging mode

export async function handler(event: any) {
  // const data = JSON.parse(event.body);
  // const { pwn_order_id } = data;

  try {
    await new TrueVaultClient({
      accessToken:
        "v2.b90f9cdc8c6d46f1b0638795213b4ba3.3bdd11d0d50c79ff9e52f9736c93c72b79eb4cd9579dde8bd0d81d19b47efbb6"
    });

    let data = await retrieveResultsPDFFromPWN(1110508, signedToken);

    // var data = fs.readFileSync("results.pdf");
    // interfax.files
    //   .create(data, { mimeType: "application/pdf" })
    //   .then(function(file) {
    //     interfax.outbound.deliver({
    //       faxNumber: "+999-9999-0",
    //       file: file
    //     });
    //   });

    return {
      statusCode: 200,
      body: JSON.stringify(data)
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

// async function downloadImage(pwn_order_id: number, signedToken: string) {
//   const Path = path.resolve(__dirname);
//   const writer = fs.createWriteStream(Path);

//   const response = await axios.get(
//     `https://api-staging.pwnhealth.com/v2/labs/orders/${pwn_order_id}/pdfs/results`,
//     {
//       headers: {
//         Authorization: `Bearer ${signedToken}`,
//         accept: "application/pdf"
//       },
//       responseType: "stream"
//     }
//   );

//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on("finish", resolve);
//     writer.on("error", reject);
//   });

// const response = await axios.get(
//   `https://api-staging.pwnhealth.com/v2/labs/orders/${pwn_order_id}/pdfs/results`,
//   {
//     headers: {
//       Authorization: `Bearer ${signedToken}`,
//       accept: "application/pdf"
//     },
//     responseType: "stream"
//   }
// );

// return response.data;
// }

async function retrieveResultsPDFFromPWN(
  pwn_order_id: number,
  signedToken: string
) {
  try {
    const response = await axios({
      method: "get",
      url: `https://api-staging.pwnhealth.com/v2/labs/orders/${pwn_order_id}/pdfs/results`,
      headers: { Authorization: `Bearer ${signedToken}` },
      responseType: "stream"
    })
      .then(function(response) {
        let buffer = toArray(response.data).then(function(parts: any) {
          const buffers = parts.map((part: any) =>
            util.isBuffer(part) ? part : Buffer.from(part)
          );
          return Buffer.concat(buffers);
        });
        return buffer;
      })
      .then(buffer => {
        interfax.files
          .create(buffer, {
            mimeType: "application/pdf"
          })
          .then((file: any) =>
            interfax.outbound.deliver({
              faxNumber: "+999-9999-0",
              file: file
            })
          );
      });

    return response;
  } catch (error) {
    console.log("ERROR", error);
  }
}

async function sendPDF(file: any) {
  const fax = await interfax.outbound.deliver({
    faxNumber: "+999-9999-0",
    file: file
  });

  console.log(fax);
}
async function setUserAttributesToPurchased(user_id: string, order: Order) {
  const currentUser = await readUserTvClient.readUser(user_id);

  const { attributes: currentAttributes } = currentUser;

  const { results } = currentAttributes;

  // results.unshift(orderWithStripeID);

  const desiredAttributes = {
    results,
    user_progress_level: "purchased"
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
    // const response = await createErrorEvent(
    //   `There was an error updating ${user_id}'s 'progress' and 'purchase' attribute`,
    //   error
    // );
    return;
  }
}

function transformAnalyteToUserResults(analyte: Analyte) {}

function combineUserResultsWithOrderInformtion(
  order: Order,
  results: TTestResult[]
) {}

// Generated by https://quicktype.io

export interface TOrderResponseApprovalPending {
  order: Order;
}

// Generated by https://quicktype.io

export interface TOrderResponseComplete {
  order: Order;
}

export interface Order {
  id: number;
  status: "approved" | "cancelled" | "rejected" | "approval_pending";
  confirmation_code: string;
  account_number: string;
  draw_location: string;
  take_tests_same_day: boolean;
  customer: Customer;
  tests: any[];
  test_groups: number[];
  clinical_note: string;
  reference: string;
  test_disclaimer_ids: any[];
  prior_genetic_testing: null;
  medication_list: null;
  custom_attributes: null;
  created_at: string;
  updated_at: string;
  expires_at: string;
  recollection_id: null;
  grouping: string;
  subscription_id: null;
  lab_acknowledged_on: null;
  links: Links;
  physician_review: PhysicianReview;
  results: Results;
}

export interface Customer {
  external_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  phone: string;
  sms_opted_in: boolean;
  email: string;
  address: Address;
}

export interface Address {
  line: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

export interface Links {
  ui_customer: string;
}

export interface PhysicianReview {
  name: string;
  upin: string;
  npi: string;
  reviewed_at: string | null;
}

export interface Results {
  format: string;
  summary: Summary;
  final_results: FinalResult[];
  analytes: Analyte[];
}

export interface Analyte {
  order_lab_code: string;
  order_lab_name: string;
  result_lab_code: string;
  result_lab_name: string;
  lab_abnormal_flag: string;
  client_abnormal_flag: null;
  abnormal_flag: string;
  released: boolean;
  priority: number | null;
  order_friendly_name: null;
  result_friendly_name: null | string;
  analyte_grouping: null | string;
  title: null | string;
  status: string;
  range_type: null | string;
  basic_information: any[] | null;
  parents: any[];
  reference_ranges: any[];
  result_explanations: any[];
  additional_information: any[];
  released_at: string;
  result_status: string;
  value: string;
  value_unit: null | string;
  observed_at: string;
  notes: null;
  lab_reference_range: string;
  value_type: string;
}

export interface FinalResult {
  result_lab_code: string;
  order_lab_code: string;
}

export interface Summary {
  outreach_required: boolean;
  outreach_performed_by_client: boolean;
  complete: boolean;
  status: string;
  abnormal_flag: boolean;
  sample_collected_at: string;
  released_at: string;
}

export type TTestResult = {
  resultValueType: "number" | "string";
  status: "Normal" | "Abnormal" | "Caution";
  title: string;
  subtitle: string;
  result_unit: string;
  result_value: number;
  result_bottom_value?: number;
  result_middle_value?: number;
  result_top_value?: number;
  range_labels: string[];
  result_description: string;
};
