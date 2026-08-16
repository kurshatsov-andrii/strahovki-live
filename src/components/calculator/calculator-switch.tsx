import { useState } from "react";
import { InsuranceCalculator } from "@/components/calculator/insurance-calculator";
import type { ProductKey } from "@/lib/insurance";

export function CalculatorWithProductSwitch() {
  const [product, setProduct] = useState<ProductKey>("auto");

  return <InsuranceCalculator product={product} onProductChange={setProduct} />;
}
