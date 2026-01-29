import { useState } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Pencil, Trash } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import "@/ag-grid-estoka.css"

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
  { id: 3, nome: "Jaqueta C", fornecedor: "Fornecedor C", medida: "kg", valor: 120, ipi: 10, frete: 5 },
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

const unidades = [
  { value: "un", label: "Unidade" },
  { value: "kg", label: "Quilo" },
  { value: "cx", label: "Caixa" },
  { value: "m", label: "Metro" },
  { value: "l", label: "Litro" },
  { value: "bl", label: "Balde" },
]

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)

  function abrirNovoProduto() {
    setProdutoEditando({ ...produtoVazio })
  }

  function salvarProduto() {
    if (!produtoEditando) return

    if (produtoEditando.id === 0) {
      setProdutos((prev) => [
        ...prev,
        { ...produtoEditando, id: Date.now() },
      ])
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
      headerName: "Ações",
      width: 120,
      cellRenderer: (params: { data: Produto }) => (
        <div className="flex gap-2 justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setProdutoEditando(params.data)}
                className="p-2 rounded-md hover:bg-muted transition"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Editar produto</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (confirm("Deseja excluir este produto?")) {
                    setProdutos((prev) =>
                      prev.filter((p) => p.id !== params.data.id)
                    )
                  }
                }}
                className="p-2 rounded-md hover:bg-muted transition"
              >
                <Trash className="h-4 w-4 text-red-500 hover:text-red-600 transition" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Excluir produto</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <TooltipProvider>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Produtos</h1>
            <p className="text-sm text-muted-foreground">
              Adicione, edite ou exclua produtos do seu estoque.
            </p>
          </div>

          <Button onClick={abrirNovoProduto}>
            + Novo Produto
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
                      setProdutoEditando({
                        ...produtoEditando,
                        nome: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Input
                    value={produtoEditando.fornecedor}
                    onChange={(e) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        fornecedor: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unidade de medida</Label>

                  <Select
                    value={produtoEditando.medida}
                    onValueChange={(value) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        medida: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>

                    <SelectContent>
                      {unidades.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label} ({u.value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Valor unitário</Label>
                  <Input
                    type="number"
                    value={produtoEditando.valor}
                    onChange={(e) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        valor: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>IPI</Label>
                  <Input
                    type="number"
                    value={produtoEditando.ipi}
                    onChange={(e) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        ipi: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2 pb-6">
                  <Label>Frete</Label>
                  <Input
                    type="number"
                    value={produtoEditando.frete}
                    onChange={(e) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        frete: Number(e.target.value),
                      })
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
    </TooltipProvider>
  )
}