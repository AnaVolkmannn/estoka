import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Entrar no estoka</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Senha" type="password" />

        <Button className="w-full">Entrar</Button>
      </CardContent>
    </Card>
  );
}
