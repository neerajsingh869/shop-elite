/*
  The Razorpay checkout script was a synchronous <script> in index.html, so
  every page paid for it - four extra origins resolved, connected and
  downloaded before the app could settle, on routes that can never open
  checkout.

  It is only needed when someone actually pays, so load it then. The promise
  is cached so a second checkout does not inject a second copy, and a failed
  load clears the cache so the next attempt can retry rather than being stuck
  with a permanently rejected promise.
*/
const SRC = "https://checkout.razorpay.com/v1/checkout.js";

let pending: Promise<void> | null = null;

export function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (pending) return pending;

  pending = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`,
    );
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      pending = null;
      reject(new Error("Could not load the payment script"));
    });

    if (!existing) {
      script.src = SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return pending;
}
