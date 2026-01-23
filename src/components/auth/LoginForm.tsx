import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import loginImage from "@/assets/login.png";

export function LoginForm() {
  return (
    <Card className="flex flex-col md:flex-row w-full max-w-4xl">
      {/* Lado esquerdo - Form */}
      <div className="w-full md:w-1/2">
        <CardHeader className="text-center py-8">
          <CardTitle>Entrar em conta existente</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Senha" type="password" />

          <Button className="w-full">Entrar</Button>

          <Button className="w-full" variant="outline">
            Login com Google
          </Button>

          <Button className="px-0 text-left" variant="link">
            Esqueceu sua senha?
          </Button>
        </CardContent>
      </div>

      {/* Lado direito - Imagem */}
      <div className="relative hidden md:block md:w-1/2">
        <img
          src={loginImage}
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </Card>
  );
}
