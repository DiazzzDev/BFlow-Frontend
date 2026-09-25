import assert from "node:assert/strict";
import test from "node:test";

import {
    buildWompiCheckoutRequest,
    executeWompiCheckout,
    getWompiCheckoutUrl,
    validateWompiPlan,
} from "../src/modules/app/features/wompi/wompi.checkout";

const monthlyPlan = {
    checkoutPlanKey: "pro-monthly" as const,
    planId: "cc555789-a008-42b0-bd2b-4675e408bd2b",
    price: "$9.99",
};

test("accepts the configured monthly plan", () => {
    assert.equal(validateWompiPlan(monthlyPlan), "ready");
});

test("rejects a plan that does not exist in the selection", () => {
    assert.equal(validateWompiPlan(undefined), "missing-plan");
});

test("rejects a plan without a configured checkout identifier", () => {
    assert.equal(
        validateWompiPlan({ ...monthlyPlan, planId: "" }),
        "missing-plan-id",
    );
});

test("rejects incomplete or malformed plan identifiers", () => {
    assert.equal(
        validateWompiPlan({ ...monthlyPlan, planId: "not-a-uuid" }),
        "invalid-plan-id",
    );
});

test("rejects a plan whose displayed price does not match its purchase key", () => {
    assert.equal(
        validateWompiPlan({ ...monthlyPlan, price: "$99.99" }),
        "invalid-price",
    );
});

test("builds the checkout request expected by the backend without a client price", () => {
    assert.deepEqual(buildWompiCheckoutRequest(monthlyPlan.planId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: monthlyPlan.planId }),
    });
});

test("redirects when the checkout API returns a Wompi URL", async () => {
    let requestedPlanId: string | undefined;
    let redirectedTo: string | undefined;

    const result = await executeWompiCheckout(monthlyPlan, {
        createCheckout: async (planId) => {
            requestedPlanId = planId;
            return { success: true, data: { checkoutUrl: "https://wompi.example/checkout" } };
        },
        openCheckout: (checkoutUrl) => {
            redirectedTo = checkoutUrl;
        },
    });

    assert.equal(result, "redirected");
    assert.equal(requestedPlanId, monthlyPlan.planId);
    assert.equal(redirectedTo, "https://wompi.example/checkout");
});

test("does not call the API or redirect for an unavailable plan", async () => {
    let requestCount = 0;
    let redirectCount = 0;

    const result = await executeWompiCheckout(
        { ...monthlyPlan, planId: "" },
        {
            createCheckout: async () => {
                requestCount += 1;
                return { success: true, data: { checkoutUrl: "https://wompi.example/checkout" } };
            },
            openCheckout: () => {
                redirectCount += 1;
            },
        },
    );

    assert.equal(result, "missing-plan-id");
    assert.equal(requestCount, 0);
    assert.equal(redirectCount, 0);
});

test("propagates an API error and does not redirect", async () => {
    let redirected = false;

    await assert.rejects(
        executeWompiCheckout(monthlyPlan, {
            createCheckout: async () => {
                throw new Error("Error al generar el pago. Código: 500");
            },
            openCheckout: () => {
                redirected = true;
            },
        }),
        /Código: 500/,
    );

    assert.equal(redirected, false);
});

test("propagates a Wompi communication error and does not redirect", async () => {
    let redirected = false;

    await assert.rejects(
        executeWompiCheckout(monthlyPlan, {
            createCheckout: async () => {
                throw new Error("No fue posible comunicarse con el proveedor de pagos.");
            },
            openCheckout: () => {
                redirected = true;
            },
        }),
        /proveedor de pagos/,
    );

    assert.equal(redirected, false);
});

test("fails safely when the API success response lacks the checkout URL", () => {
    assert.throws(
        () => getWompiCheckoutUrl({ success: true, data: { checkoutUrl: "" } }),
        /Checkout URL missing/,
    );
});