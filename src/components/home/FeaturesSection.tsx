import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Controle de estoque",
    description: "Acompanhe entradas, saídas e quantidades em tempo real.",
  },
  {
    title: "Organização simples",
    description: "Visualize seus produtos de forma clara e sem complicação.",
  },
  {
    title: "Histórico completo",
    description: "Tenha registro de todas as movimentações do seu estoque.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-semibold">
          Tudo o que você precisa para organizar seu estoque
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
