import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Car, Globe2, PlaneTakeoff, Activity, Check, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productLabels, type ProductKey } from "@/lib/insurance";
import { home } from "@/content/site";

type Goal = "ukraine" | "abroad_car" | "travel" | "sport";

type Answer = {
  goal?: Goal;
  travelByCar?: boolean;
  needMedical?: boolean;
};

type Option = {
  value: Goal | boolean;
  label: string;
  icon: React.ElementType;
  description?: string;
};

type Step = {
  key: keyof Answer;
  question: string;
  subtitle: string;
  options: Option[];
};

const productRoutes: Record<ProductKey, string> = {
  auto: "/autostrahuvannya",
  green_card: "/zelena-karta",
  travel: "/turystychne-strahuvannya",
  sport: "/sportyvne-strahuvannya",
};

const productCards = Object.fromEntries(
  home.serviceCards.map((card) => [card.to.replace("/", "") || card.to, card]),
);

const steps: Step[] = [
  {
    key: "goal",
    question: "Що плануєте?",
    subtitle: "Оберіть основну мету — навігатор підбере потрібний поліс.",
    options: [
      { value: "ukraine", label: "Їздити Україною", icon: Car, description: "Обов'язкова автоцивілка ОСЦПВ" },
      { value: "abroad_car", label: "Виїхати за кордон на авто", icon: Globe2, description: "Зелена карта + туристичне" },
      { value: "travel", label: "Подорожувати", icon: PlaneTakeoff, description: "Медичне страхування за кордон" },
      { value: "sport", label: "Спортивний захід", icon: Activity, description: "Страхування від травм" },
    ],
  },
  {
    key: "travelByCar",
    question: "Як ви подорожуватимете?",
    subtitle: "Це впливає на необхідність зеленої карти.",
    options: [
      { value: true, label: "На власному авто", icon: Car, description: "Потрібна зелена карта" },
      { value: false, label: "Літаком, потягом, автобусом", icon: PlaneTakeoff, description: "Достатньо туристичного" },
    ],
  },
  {
    key: "needMedical",
    question: "Потрібне медичне страхування для поїздки?",
    subtitle: "Рекомендуємо мати поліс на випадок хвороби чи травми за кордоном.",
    options: [
      { value: true, label: "Так, додайте туристичне", icon: Check, description: "Комплексний захист" },
      { value: false, label: "Ні, тільки авто", icon: Car, description: "Лише зелена карта" },
    ],
  },
];

function getRecommendations(answer: Answer): ProductKey[] {
  const { goal, travelByCar, needMedical } = answer;

  if (goal === "ukraine") return ["auto"];
  if (goal === "sport") return ["sport"];

  if (goal === "abroad_car") {
    if (needMedical === undefined) return ["green_card"];
    return needMedical ? ["green_card", "travel"] : ["green_card"];
  }

  if (goal === "travel") {
    if (travelByCar === undefined) return ["travel"];
    return travelByCar
      ? needMedical === false
        ? ["green_card"]
        : ["green_card", "travel"]
      : ["travel"];
  }

  return [];
}

function getResultTitle(answer: Answer, products: ProductKey[]): string {
  if (products.length === 1) {
    return "Вам підходить";
  }
  if (answer.goal === "travel" || answer.goal === "abroad_car") {
    return "Для вашої поїздки потрібно";
  }
  return "Вам підходить";
}

function getResultDescription(answer: Answer, products: ProductKey[]): string {
  if (products.length === 1) {
    const map: Record<ProductKey, string> = {
      auto: "Обов'язкове страхування для поїздок Україною.",
      green_card: "Міжнародна автоцивілка для виїзду за кордон.",
      travel: "Медичне страхування для подорожей та візи.",
      sport: "Захист від травм на змаганнях і тренуваннях.",
    };
    return map[products[0]!];
  }
  return "Комбінація полісів покриє і авто, і медичні витрати за кордоном.";
}

export function InsuranceNavigator() {
  const [answers, setAnswers] = useState<Answer>({});
  const [finished, setFinished] = useState(false);

  const currentStepIndex = (() => {
    if (answers.goal === undefined) return 0;
    if (answers.goal === "ukraine" || answers.goal === "sport") return -1; // finish
    if (answers.goal === "abroad_car") {
      if (answers.needMedical === undefined) return 2;
      return -1;
    }
    if (answers.goal === "travel") {
      if (answers.travelByCar === undefined) return 1;
      if (answers.travelByCar && answers.needMedical === undefined) return 2;
      return -1;
    }
    return -1;
  })();

  const step = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  function select(value: Goal | boolean) {
    if (!step) return;
    const key = step.key;
    const next = { ...answers, [key]: value };
    setAnswers(next);

    const isFinal =
      key === "goal" && (value === "ukraine" || value === "sport");
    const isTravelCarDone = key === "travelByCar" && value === false;
    const isMedicalDone = key === "needMedical";

    if (isFinal || isTravelCarDone || isMedicalDone) {
      setFinished(true);
    }
  }

  function reset() {
    setAnswers({});
    setFinished(false);
  }

  const recommendations = finished ? getRecommendations(answers) : [];

  return (
    <section className="bg-secondary/40 py-20">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Страховий навігатор
          </span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Підберемо страховку за 2–3 питання
          </h2>
          <p className="mt-3 text-muted-foreground">
            Відповідайте на прості запитання — ми одразу скажемо, який поліс вам потрібен.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
          {!finished && step && (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">{step.question}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.subtitle}</p>
                </div>
                <div className="hidden text-sm font-medium text-muted-foreground sm:block">
                  Крок {currentStepIndex + 1} з 3
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {step.options.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => select(option.value)}
                      className="group flex flex-col items-start rounded-2xl border border-border bg-background p-5 text-left transition hover:border-primary hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="bg-brand-gradient flex size-12 items-center justify-center rounded-xl text-primary-foreground shadow-sm">
                        <Icon className="size-6" />
                      </span>
                      <span className="mt-4 text-base font-bold">{option.label}</span>
                      {option.description && (
                        <span className="mt-1 text-sm text-muted-foreground">{option.description}</span>
                      )}
                      <ArrowRight className="mt-4 size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {finished && recommendations.length > 0 && (
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/15">
                <ShieldCheck className="size-8 text-accent" />
              </div>
              <h3 className="mt-6 text-2xl font-extrabold sm:text-3xl">
                {getResultTitle(answers, recommendations)}
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                {getResultDescription(answers, recommendations)}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {recommendations.map((product) => (
                  <div
                    key={product}
                    className="flex flex-col rounded-2xl border border-border bg-background p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-gradient flex size-10 items-center justify-center rounded-lg text-primary-foreground">
                        <Check className="size-5" />
                      </span>
                      <span className="text-lg font-bold">{productLabels[product]}</span>
                    </div>
                    <p className="mt-3 flex-1 text-sm text-muted-foreground">
                      {home.serviceCards.find((c) => c.to === productRoutes[product])?.description}
                    </p>
                    <Button asChild className="mt-5 w-full" size="lg">
                      <Link to={productRoutes[product]}>
                        Оформити {productLabels[product]}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={reset}
                className="mt-8"
              >
                <RotateCcw className="size-4" />
                Підібрати ще раз
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
