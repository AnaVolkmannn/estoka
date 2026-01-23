import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import entrarImage from "@/assets/entrar.png";

export function RegisterForm() {
  return (
    <Card className="flex flex-col md:flex-row w-full max-w-4xl">
      {/* Lado esquerdo - Form */}
      <div className="w-full md:w-1/2">
        <CardHeader className="text-center py-10">
          <CardTitle className="text-2xl">Criar nova conta</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button className="w-full" variant={"outline"}>
            Continuar com Google
          </Button>
          <Button className="w-full">Continuar com Email</Button>

          <Link to="/login">
            <Button className="w-full" variant="link">
              Já tem uma conta?
            </Button>
          </Link>
        </CardContent>
      </div>
      {/* Lado direito - Imagem */}
      <div className="relative hidden md:block md:w-1/2">
        <img
          src={entrarImage}
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </Card>
  );
}
