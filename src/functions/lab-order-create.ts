import { APIGatewayEvent } from "aws-lambda";
import axios from "axios";
import fetch from "node-fetch";

export async function handler(event: APIGatewayEvent) {
  //   const data = JSON.parse(event.body);
  const test_groups = "Plus";
  const customer = {
    external_id: 999,
    first_name: "Tyler",
    last_name: "LaPointe",
    birth_date: "1992-11-07",
    gender: "female",
    phone: "8606701461",
    email: "tylerlapointe@me.com",
    adrress: {
      line: "825 Westbourne Drive",
      line2: "Apt 4",
      city: "West Hollywood",
      state: "CA",
      zip: "90069"
    }
  };
  try {
    const response = await fetch(
      "https://api-staging.pwnhealth.com/v2/labs/orders?page=1&start_at=197001010000",
      {
        method: "GET",
        // prettier-ignore
        headers: {
          'Accept': "application/json",
          'Content': "application/json",
          'Authorization':
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI4MDQwMmM0NzBlMjk3ZGEzNDZiMTY0NDUwZWE1ZGM0MiIsImlhdCI6MTU2NjIyMzA3MH0.udWp5cRs2lvTN34tIXs0II9YwHrN5UyjOEK9NCP_6MU"
        }
      }
    );
    const data = await response.json();
    console.log(data);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
        status: "succeeded",
        connected: true,
        authenticated: true
      })
    };
  } catch (error) {
    console.log("error", error);
  }
}
