import { useState } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"

import "@/ag-grid-estoka.css"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

ModuleRegistry.registerModules([AllCommunityModule])

type Produto = {
  id: number
  nome: string
  fornecedor: string
  medida: string
  valor: number
  ipi: number
  frete: number
}

const mockProdutos: Produto[] = [
  { id: 1, nome: "Parafuso MAQ", fornecedor: "Fornecedor A", medida: "un", valor: 25, ipi: 2, frete: 1 },
  { id: 2, nome: "Calça B", fornecedor: "Fornecedor B", medida: "un", valor: 70, ipi: 5, frete: 2 },
  { id: 3, nome: "Jaqueta C", fornecedor: "Fornecedor C", medida: "un", valor: 120, ipi: 10, frete: 5 },
]

const produtoVazio: Produto = {
  id: 0,
  nome: "",
  fornecedor: "",
  medida: "",
  valor: 0,
  ipi: 0,
  frete: 0,
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)

  function abrirNovoProduto() {
    setProdutoEditando({ ...produtoVazio })
  }

  function salvarProduto() {
    if (!produtoEditando) return

    if (produtoEditando.id === 0) {
      const novoProduto: Produto = {
        ...produtoEditando,
        id: Date.now(),
      }
      setProdutos((prev) => [...prev, novoProduto])
    } else {
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === produtoEditando.id ? produtoEditando : p
        )
      )
    }

    setProdutoEditando(null)
  }

const colunas: ColDef<Produto>[] = [
  { field: "nome", headerName: "Produto", flex: 2 },

  { field: "fornecedor", headerName: "Fornecedor", flex: 2 },

  { field: "medida", headerName: "Medida", flex: 1 },

  {
    field: "valor",
    headerName: "Valor Unitário",
    flex: 1,
    valueFormatter: (p) =>
      `R$ ${p.value.toFixed(2).replace(".", ",")}`,
  },

  {
    field: "ipi",
    headerName: "IPI",
    flex: 1,
    valueFormatter: (p) =>
      `${p.value.toFixed(2).replace(".", ",")}%`,
  },

  {
    field: "frete",
    headerName: "Frete",
    flex: 1,
    valueFormatter: (p) =>
      `R$ ${p.value.toFixed(2).replace(".", ",")}`,
  },

  {
    headerName: "",
    width: 120,
    cellRenderer: (params: { data: Produto }) => (
      <div className="flex gap-2">
        <button onClick={() => setProdutoEditando(params.data)}>
          ✏️
        </button>

        <button
          className="text-red-600"
          onClick={() => {
            if (confirm("Deseja excluir este produto?")) {
              setProdutos((prev) =>
                prev.filter((p) => p.id !== params.data.id)
              )
            }
          }}
        >
          ❌
        </button>
      </div>
    ),
  },
]


  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Edite produtos existentes ou adicione novos
          </p>
        </div>
        <Button onClick={abrirNovoProduto}>
          Novo Produto
        </Button>
      </div>

      <div className="ag-theme-quartz h-screen w-full">
        <AgGridReact
          rowData={produtos}
          columnDefs={colunas}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      </div>

      <Dialog open={!!produtoEditando} onOpenChange={() => setProdutoEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {produtoEditando?.id === 0 ? "Novo produto" : "Editar produto"}
            </DialogTitle>
          </DialogHeader>

          {produtoEditando && (
            <div className="space-y-4">

              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={produtoEditando.nome}
                  onChange={(e) =>
                    setProdutoEditando({ ...produtoEditando, nome: e.target.value })
                  }
                />
              </div>
              
              
              <div className="space-y-2">
                <Label>Fornecedor</Label>
                <Input
                  value={produtoEditando.fornecedor}
                  onChange={(e) =>
                    setProdutoEditando({ ...produtoEditando, fornecedor: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Unidade de medida</Label>
                <Input
                  value={produtoEditando.medida}
                  onChange={(e) =>
                    setProdutoEditando({ ...produtoEditando, medida: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Valor unitário</Label>
                <Input
                  type="number"
                  value={produtoEditando.valor}
                  onChange={(e) =>
                    setProdutoEditando({ ...produtoEditando, valor: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>IPI</Label>
                <Input
                  type="number"
                  value={produtoEditando.ipi}
                  onChange={(e) =>
                    setProdutoEditando({ ...produtoEditando, ipi: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2 pb-6">
                <Label>Frete</Label>
                <Input
                  type="number"
                  value={produtoEditando.frete}
                  onChange={(e) =>
                    setProdutoEditando({ ...produtoEditando, frete: Number(e.target.value) })
                  }
                />
              </div>

              <Button onClick={salvarProduto} className="w-full">
                Salvar
              </Button>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
