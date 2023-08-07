import crypto from "crypto";
import { isNotNull, isNotUndefined, isRecord, isString } from "typed-assert";

// function to verify if input is a signature algorithm
const isSignatureAlgorithm = (input) => {
  isNotUndefined(input, "Algorithm cannot be undefined.");
  isNotNull(input, "Algorithm cannot be null.");

  if (typeof input === "string") return;

  isRecord(input, "Algorithm needs to be a string on a record.");
  isString(input.name, "Algorithm name needs to be a string.");
};

const signature = async (data, algorithm) => {
  // check algorithm is valid
  isSignatureAlgorithm(algorithm);

  // get jwk wallet
  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);

  // get cryptokey from subtle crypto
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    wallet,
    {
      name: "RSA-PSS",
      hash: {
        name: "SHA-256",
      },
    },
    false,
    ["sign"]
  );

  // data to sign
  const dataToSign = new Uint8Array(data);

  // get signature from subtle crypto
  const signature = await crypto.subtle.sign(algorithm, cryptoKey, dataToSign);

  return Array.from(new Uint8Array(signature));
};

export default signature;
