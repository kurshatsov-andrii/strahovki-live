import { useState } from "react";
import { InsuranceCalculator } from "@/components/calculator/insurance-calculator";
import { PRODUCTS, productLabels, type ProductKey } from "@/lib/insurance";

export function CalculatorWithProductSwitch() {
  const [product, setProduct] = useState<ProductKey>("auto");

  return (
    <div>
      <div className="container-page pt-16">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
          {PRODUCTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setProduct(item)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                product === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary"
              }`}
            >
              {productLabels[item]}
            </button>
          ))}
        </div>
      </div>
      <InsuranceCalculator product={product} />
    </div>
  );
}
