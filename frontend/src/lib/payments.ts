export type ShippingDetails = {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
};

export type StubPaymentResult = {
  success: boolean;
  orderId: string;
};

/**
 * Stub for the Razorpay checkout flow. Replace with a real integration once
 * live keys are available:
 *   1. Create an order server-side via the Razorpay Orders API
 *      (needs RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET, kept server-only).
 *   2. Open Razorpay's checkout.js with NEXT_PUBLIC_RAZORPAY_KEY_ID and the
 *      order id returned above.
 *   3. Verify the payment signature server-side before marking the order
 *      as paid.
 */
export async function payWithRazorpayStub(
  shipping: ShippingDetails,
  amount: number
): Promise<StubPaymentResult> {
  console.log("[stub] Razorpay checkout requested", { shipping, amount });
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    success: true,
    orderId: `MEDI-${Date.now().toString(36).toUpperCase()}`,
  };
}
