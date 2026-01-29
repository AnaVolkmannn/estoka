import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// 🔧 MOCK DOS PRODUTOS (depois vem do backend)
const produtosMock = [
  { id: 1, nome: "Arroz 5kg", unidade: "kg" },
  { id: 2, nome: "Feijão", unidade: "kg" },
  { id: 3, nome: "Óleo de soja", unidade: "un" },
  { id: 4, nome: "Açúcar", unidade: "kg" },
  { id: 5, nome: "Açúcar", unidade: "kg" },
  { id: 6, nome: "Açúcar", unidade: "kg" },
  { id: 7, nome: "Açúcar", unidade: "kg" },
  { id: 8, nome: "Açúcar", unidade: "kg" },
]

export default function InventarioPage() {
  // 📅 Mês atual automático (YYYY-MM)
  const mesAtual = new Date().toISOString().slice(0, 7)

  const [periodo, setPeriodo] = useState(mesAtual)

  const [quantidades, setQuantidades] = useState<Record<number, number>>({})

  function atualizarQuantidade(id: number, valor: number) {
    setQuantidades((prev) => ({
      ...prev,
      [id]: valor,
    }))
  }

  function salvarInventario() {
    const payload = produtosMock.map((produto) => ({
      produtoId: produto.id,
      periodo,
      quantidade: quantidades[produto.id] || 0,
    }))

    console.log("Inventário enviado:", payload)
  }

  return (
  <div className="p-4 flex justify-center">
    <div className="w-full max-w-md space-y-4">

      {/* 🧾 Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Lançar Inventário</h1>
        <p className="text-sm text-muted-foreground">
          Informe as quantidades de cada produto no período selecionado
        </p>
      </div>

      {/* 📋 Card */}
      <Card>
        <CardHeader>
          <CardTitle>Período de lançamento</CardTitle>

          <Input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="max-w-40"
          />
        </CardHeader>

        <CardContent className="space-y-3">

          {produtosMock.map((produto) => (
            <div
              key={produto.id}
              className="grid grid-cols-3 items-center gap-2 border-b pb-2 last:border-none"
            >
              <div className="col-span-2">
                <p className="font-medium">{produto.nome}</p>
                <p className="text-xs text-muted-foreground">
                  Unidade: {produto.unidade}
                </p>
              </div>

              <Input
                type="number"
                min={0}
                placeholder="0"
                className="text-right"
                value={quantidades[produto.id] ?? ""}
                onChange={(e) =>
                  atualizarQuantidade(produto.id, Number(e.target.value))
                }
              />
            </div>
          ))}

        </CardContent>
      </Card>

      <Button className="w-full" onClick={salvarInventario}>
        Salvar inventário
      </Button>

    </div>
  </div>
)
}