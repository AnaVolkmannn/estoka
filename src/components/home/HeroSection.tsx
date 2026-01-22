import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-4xl font-bold">
        Controle seu estoque sem complicação
      </h1>

      <p className="mt-4 text-muted-foreground">
        O Estoka ajuda pequenos negócios a organizar produtos, entradas, saídas
        e gerar estatísticas.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link to="/register">
          <Button size="lg" variant="destructive">
            Quero conhecer
          </Button>
        </Link>
      </div>
    </section>
  );
}
