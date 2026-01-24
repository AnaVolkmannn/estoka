import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do sistema
        </p>
      </div>

      {/* Cards pequenos (KPIs) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">
              Placeholder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Notas fiscais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">
              Placeholder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">
              Placeholder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Última atualização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">
              Placeholder
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards grandes */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumo geral</CardTitle>
          </CardHeader>
          <CardContent className="h-50 flex items-center justify-center text-muted-foreground">
            Conteúdo futuro (gráfico, tabela, etc.)
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades recentes</CardTitle>
          </CardHeader>
          <CardContent className="h-50 flex items-center justify-center text-muted-foreground">
            Placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}