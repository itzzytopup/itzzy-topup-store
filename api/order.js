import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { service_id, service_code, quantity = 1, fields } = req.body;

    if ((!service_id && !service_code) || !fields) {
      return res.status(400).json({
        success: false,
        error: "service_id/service_code and fields are required"
      });
    }

    const apiId = process.env.FT_API_ID;
    const apiKey = process.env.FT_API_KEY;

    const body = JSON.stringify({
      reference_id: `itzzy-${Date.now()}`,
      ...(service_id ? { service_id } : { service_code }),
      quantity,
      fields
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID();

    const path = "/api/reseller/v2/order";

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
      "https://api.flashtopup.com/api/reseller/v2/order",
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
