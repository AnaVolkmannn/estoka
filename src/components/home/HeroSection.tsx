import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero.png";

export function HeroSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto flex flex-col-reverse items-center gap-12 px-6 md:flex-row">
        {/* Texto */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight">
            Controle seu estoque <br />
            sem complicação
          </h1>

          <p className="mt-4 text-muted-foreground max-w-xl">
            O Estoka ajuda pequenos negócios a organizar produtos, entradas,
            saídas e gerar estatísticas detalhadas de forma simples e eficiente. Tudo na palma da sua mão.
          </p>

          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" variant="outline">
                Quero conhecer
              </Button>
            </Link>
          </div>
        </div>

        {/* Imagem */}
        <div className="flex-1">
          <img
            src={heroImage}
            alt="Estoka"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
