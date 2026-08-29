import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const apiId = process.env.FT_API_ID;
    const apiKey = process.env.FT_API_KEY;

    cconst body = JSON.stringify({
  product_id: 11,
  product_type: "topup"
});

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID();

    const path = "/api/reseller/v2/services";

    const bodyHash = crypto
      .createHash("sha256")
      .update(body)
      .digest("hex");

    const message =
      `POST\n${path}\n${timestamp}\n${nonce}\n${bodyHash}`;

    const signature = crypto
      .createHmac("sha256", apiKey)
      .update(message)
      .digest("hex");

    const response = await fetch(
      "https://api.flashtopup.com/api/reseller/v2/services",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-FT-API-ID": apiId,
          "X-FT-Timestamp": timestamp,
          "X-FT-Nonce": nonce,
          "X-FT-Signature": signature
        },
        body
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
