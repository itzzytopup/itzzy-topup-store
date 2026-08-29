import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const apiId = process.env.FT_API_ID;
    const apiKey = process.env.FT_API_KEY;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID();

    const path = "/api/reseller/v2/products";
    const body = "";

    const bodyHash = crypto
      .createHash("sha256")
      .update(body)
      .digest("hex");

    const message =
      `GET\n${path}\n${timestamp}\n${nonce}\n${bodyHash}`;

    const signature = crypto
      .createHmac("sha256", apiKey)
      .update(message)
      .digest("hex");

    const response = await fetch(
      "https://api.flashtopup.com/api/reseller/v2/products",
      {
        method: "GET",
        headers: {
          "X-FT-API-ID": apiId,
          "X-FT-Timestamp": timestamp,
          "X-FT-Nonce": nonce,
          "X-FT-Signature": signature
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}
