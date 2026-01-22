import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="py-24 text-center">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-3xl font-semibold">
          Comece a organizar seu estoque hoje
        </h2>

        <p className="mt-4 text-muted-foreground">
          Crie sua conta gratuitamente e tenha controle total dos seus produtos.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Criar conta</Button>
          </Link>

          <Link to="/login">
            <Button size="lg" variant="outline">
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
