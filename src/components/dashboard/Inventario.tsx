import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Produto = {
  id: number
  nome: string
  medida: string
}

type LinhaInventario = Produto & {
  quantidade: string
}

const mockProdutos: Produto[] = [
  { id: 1, nome: "Parafuso MAQ", medida: "un" },
  { id: 2, nome: "Calça B", medida: "un" },
  { id: 3, nome: "Jaqueta C", medida: "kg" },
  { id: 4, nome: "Tecido Azul", medida: "m" },
  { id: 5, nome: "Óleo Lubrificante", medida: "l" },
]

export default function LancarInventario() {
  const [linhas, setLinhas] = useState<LinhaInventario[]>(
    mockProdutos.map(p => ({ ...p, quantidade: "" }))
  )

  function atualizarQuantidade(id: number, valor: string) {
    setLinhas(prev =>
      prev.map(l =>
        l.id === id ? { ...l, quantidade: valor } : l
      )
    )
  }

  return (
    <div className="min-h-screen p-4 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Lançar inventário</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="divide-y rounded-md border">

            {linhas.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Unidade: {item.medida}
                  </p>
                </div>

                <Input
                  type="number"
                  inputMode="numeric"
                  className="w-24 text-right"
                  placeholder="0"
                  value={item.quantidade}
                  onChange={(e) =>
                    atualizarQuantidade(item.id, e.target.value)
                  }
                />
              </div>
            ))}

          </div>

          <Button className="w-full">
            Salvar inventário
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
