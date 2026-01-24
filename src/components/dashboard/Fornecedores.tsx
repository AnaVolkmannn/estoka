import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Fornecedores() {
  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-semibold">Cadastrar fornecedor</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados do fornecedor
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do fornecedor</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            {/* Linha 1 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome / Razão social</Label>
                <Input id="nome" placeholder="Ex: Fornecedor XYZ Ltda" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" />
              </div>
            </div>

            {/* Linha 2 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="contato@fornecedor.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 00000-0000" />
              </div>
            </div>

            {/* Linha 3 */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" placeholder="00000-000" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Rua, número, bairro" />
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o fornecedor"
              />
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
              <Button type="submit">
                Salvar fornecedor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
