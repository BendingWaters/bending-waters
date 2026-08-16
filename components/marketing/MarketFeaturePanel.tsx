import Button from "@/components/Button";
import type { MarketFeature, MarketTheme } from "@/constants/market-pages";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  features: MarketFeature[];
  ctaText: string;
  theme: MarketTheme;
};

const themeClasses: Record<MarketTheme, string> = {
  warm: "from-orange-50 to-pink-50",
  bold: "from-violet-50 to-blue-50",
  premium: "from-slate-100 to-zinc-50",
};

const iconThemeClasses: Record<MarketTheme, string> = {
  warm: "bg-orange-100 text-orange-600",
  bold: "bg-blue-100 text-blue-600",
  premium: "bg-slate-200 text-slate-800",
};

export default function MarketFeaturePanel({
  eyebrow,
  title,
  description,
  features,
  theme = "warm" as MarketTheme,
  ctaText,
}: Props) {
  return (
    <section className="bg-white px-4 py-6 md:px-8">
      <div
        className={`container mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br ${themeClasses[theme]} p-6 md:rounded-[3rem] md:p-10`}
      >
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              {eyebrow}
            </p>

            <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-slate-950 md:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              {description}
            </p>

            <div className="mt-8">
              <Button className="px-8">{ctaText}</Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur"
                >
                  <div
                    className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${iconThemeClasses[theme]}`}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
