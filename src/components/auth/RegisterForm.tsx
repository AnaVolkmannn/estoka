import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import entrarImage from "@/assets/entrar.png";
import { Input } from "../ui/input";

export function RegisterForm() {
  return (
    <Card className="flex flex-col md:flex-row w-full max-w-4xl">
      {/* Lado esquerdo - Form */}
      <div className="w-full md:w-1/2">
        <CardHeader className="text-center py-10">
          <CardTitle className="text-2xl">Criar nova conta</CardTitle>
          <CardTitle className="text-sm">Digite seu email abaixo pra criar sua conta</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Button className="w-full">Criar conta com Email</Button>
          <CardDescription className="text-sm text-center">
            ou
          </CardDescription>
          <Button className="w-full" variant={"outline"}>
            Entrar com Google
          </Button>
          
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
