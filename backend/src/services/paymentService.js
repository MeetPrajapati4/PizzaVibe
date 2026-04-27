import { env } from "../config/env.js";

export function isRazorpayConfigured() {
  return Boolean(env.razorpay.keyId && env.razorpay.keySecret);
}

export async function createPaymentOrder(amount) {
  const amountInPaise = Math.round(Number(amount) * 100);

  if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
    throw new Error("A positive amount is required to create a payment order.");
  }

  if (!isRazorpayConfigured()) {
    return {
      provider: "mock",
      keyId: "",
      order: {
        id: `mock_order_${Date.now()}`,
        amount: amountInPaise,
        currency: env.razorpay.currency,
        status: "created"
      }
    };
  }

  const auth = Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: env.razorpay.currency,
      receipt: `pizza_${Date.now()}`
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay order failed: ${errorText}`);
  }

  const order = await response.json();
  return {
    provider: "razorpay",
    keyId: env.razorpay.keyId,
    order
  };
}
