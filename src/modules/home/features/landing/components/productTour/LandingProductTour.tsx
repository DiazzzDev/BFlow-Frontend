import { lazy, Suspense } from "react";

const ProductTourContent = lazy(() => import("./ProductTourContent"));

export const LandingProductTour = () => {
    return (
        <Suspense fallback={<div className="min-h-[42rem] w-full" aria-busy="true" />}>
            <ProductTourContent />
        </Suspense>
    );
};
