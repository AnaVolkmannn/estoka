const steps = [
  {
    step: "1",
    title: "Crie sua conta",
    description: "Cadastre-se em poucos segundos e acesse a plataforma.",
  },
  {
    step: "2",
    title: "Cadastre seus produtos",
    description: "Adicione itens, categorias e quantidades iniciais.",
  },
  {
    step: "3",
    title: "Acompanhe o estoque",
    description:
      "Gere relatórios, visualize movimentações e evite faltas ou excessos.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-semibold">
          Como funciona
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {item.step}
              </div>

              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
