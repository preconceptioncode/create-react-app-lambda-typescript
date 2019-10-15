import faunadb from "faunadb";
import React, { useState } from "react";
import {
  BlobProvider,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Canvas,
  Image
} from "@react-pdf/renderer";

const { URL } = process.env;

const secret = "fnADUxQpj2ACCWEnC8dV96ftOC1SEYZ5k8xLI4nA";
/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: secret
});

export async function handler(event: any) {
  const data = JSON.parse(event.body);

  try {
    const response = await client.query(
      q.Create(q.Collection("Users"), { data: data.blob })
    );
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
}
