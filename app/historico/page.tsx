'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ExpandMore,
  Print,
  Download,
  Lock,
  LockOpen,
} from '@mui/icons-material';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Fornecedor {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  unidadeMedida: string;
  fornecedor: Fornecedor;
  temIpi: boolean;
  temFrete: boolean;
}

interface ItemInventario {
  produtoId: number;
  quantidade: number | null;
  valor: number | null;
  ipi: number | null;
  frete: number | null;
}

interface InventarioResponse {
  fechado: boolean;
  itens: ItemInventario[];
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
const BASE_URL_PRODUTOS = `${API_URL}/produtos`;
const BASE_URL_INVENTARIOS = `${API_URL}/inventarios`;

// ─── API Fetcher ──────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) {
    throw new Error(`Erro ${res.status}: Não foi possível carregar os dados.`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Cálculo centralizado do total do item ────────────────────────────────────
// Regra de negócio: o frete é por unidade e deve ser multiplicado pela
// quantidade do produto no inventário (quando o produto possui frete).
function calcularTotalItem(p: Produto, item?: ItemInventario) {
  const qtd = item?.quantidade ?? 0;
  const val = item?.valor ?? 0;
  const ipiPercent = p.temIpi ? (item?.ipi ?? 0) : 0;
  const freteUnitario = p.temFrete ? (item?.frete ?? 0) : 0;

  const subtotal = qtd * val;
  const valorIpi = subtotal * (ipiPercent / 100);
  const freteTotal = freteUnitario * qtd;
  const total = subtotal + valorIpi + freteTotal;

  return { qtd, val, ipiPercent, freteUnitario, freteTotal, total };
}

export default function HistoricoInventario() {
  const hoje = useMemo(() => new Date(), []);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  const [inventarios, setInventarios] = useState<Record<number, InventarioResponse>>({});
  const [loadingMeses, setLoadingMeses] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<number | false>(false);
  const [toast, setToast] = useState<string | null>(null);

  const anos = useMemo(() => {
    const atual = hoje.getFullYear();
    return [atual - 2, atual - 1, atual, atual + 1];
  }, [hoje]);

  useEffect(() => {
    apiFetch<Produto[]>(BASE_URL_PRODUTOS)
      .then(setProdutos)
      .catch((err) => setToast(err instanceof Error ? err.message : 'Erro ao carregar produtos'))
      .finally(() => setLoadingProdutos(false));
  }, []);

  useEffect(() => {
    setInventarios({});
    setExpanded(false);

    const carregarMesesSequencialmente = async () => {
      for (let index = 0; index < MESES.length; index++) {
        const mesIndex = index + 1;
        setLoadingMeses((prev) => ({ ...prev, [mesIndex]: true }));

        try {
          const data = await apiFetch<InventarioResponse>(`${BASE_URL_INVENTARIOS}?mes=${mesIndex}&ano=${ano}`);
          setInventarios((prev) => ({ ...prev, [mesIndex]: data }));
        } catch (error) {
          // Silencioso se não houver dados
        } finally {
          setLoadingMeses((prev) => ({ ...prev, [mesIndex]: false }));
        }
      }
    };

    carregarMesesSequencialmente();
  }, [ano]);

  const handleAccordionChange = (mesIndex: number) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? mesIndex : false);
  };

  const gerarCSV = (mesIndex: number) => {
    const inventario = inventarios[mesIndex];
    if (!inventario || inventario.itens.length === 0) return;

    const mapaItens = new Map(inventario.itens.map(i => [i.produtoId, i]));

    let csvContent = '\uFEFF';

    // Linha de cabeçalho com o mês/ano de referência do inventário
    csvContent += `Inventário de ${MESES[mesIndex - 1]} de ${ano}\n`;
    csvContent += `Situação;${inventario.fechado ? 'Fechado' : 'Em aberto'}\n\n`;

    csvContent += 'Produto;Fornecedor;Unidade;Quantidade;Valor Unitario;IPI (%);Frete (R$);Total\n';

    let somaGeral = 0;

    produtos.forEach((p) => {
      const item = mapaItens.get(p.id);
      const { qtd, val, ipiPercent, freteTotal, total } = calcularTotalItem(p, item);

      somaGeral += total;

      csvContent += `"${p.nome.replace(/"/g, '""')}";` +
                    `"${(p.fornecedor?.nome ?? '—').replace(/"/g, '""')}";` +
                    `"${p.unidadeMedida}";` +
                    `${qtd};${val};${ipiPercent};${freteTotal.toFixed(2)};${total.toFixed(2)}\n`;
    });

    // Linha de total geral (soma de todos os produtos do estoque)
    csvContent += ['', '', '', '', '', '', 'TOTAL GERAL', somaGeral.toFixed(2)].join(';') + '\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${MESES[mesIndex - 1].toLowerCase()}_${ano}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, '@media print': { px: 0, py: 0 } }}>
      
      {/* Filtros superiores */}
      <Box sx={{ '@media print': { display: 'none' } }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Histórico de Inventários</Typography>
            <Typography variant="caption" color="text.secondary">
              Consulte, exporte planilhas ou imprima fechamentos anteriores
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Ano</InputLabel>
            <Select label="Ano" value={ano} onChange={(e) => setAno(Number(e.target.value))}>
              {anos.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Impressão */}
      <Box sx={{ display: 'none', '@media print': { display: 'block', mb: 4 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          Relatório Consolidado de Inventário Mensal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Referência: {expanded !== false ? `${MESES[expanded - 1]} de ${ano}` : `${ano}`}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      {loadingProdutos ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={54} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      ) : (
        <>
          {/* 📱 VERSÃO MOBILE: Lista Dinâmica de Cards Simplificados */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
            {MESES.map((nomeMes, index) => {
              const mesIndex = index + 1;
              const dataInventario = inventarios[mesIndex];
              const isLoading = loadingMeses[mesIndex];
              const temDados = dataInventario && dataInventario.itens.length > 0;

              return (
                <Card key={mesIndex} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: '16px !important' }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: temDados ? 2 : 0 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '1.05rem' }}>{nomeMes}</Typography>
                        <Typography variant="caption" color="text.secondary">{ano}</Typography>
                      </Box>

                      {isLoading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : dataInventario ? (
                        <Chip
                          size="small"
                          icon={dataInventario.fechado ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                          label={dataInventario.fechado ? 'Fechado' : 'Em aberto'}
                          color={dataInventario.fechado ? 'default' : 'success'}
                          variant={dataInventario.fechado ? 'thin' : 'outlined' as any}
                          sx={{ fontWeight: 500 }}
                        />
                      ) : (
                        <Chip size="small" label="Sem dados" variant="outlined" disabled />
                      )}
                    </Stack>

                    {temDados && (
                      <Button
                        fullWidth
                        size="medium"
                        variant={dataInventario.fechado ? "contained" : "outlined"}
                        startIcon={<Download />}
                        onClick={() => gerarCSV(mesIndex)}
                        disabled={!dataInventario.fechado}
                      >
                        {dataInventario.fechado ? 'Exportar Planilha .CSV' : 'Fechamento Pendente'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* 💻 VERSÃO DESKTOP: Mantém a estrutura original com tabelas completas */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {MESES.map((nomeMes, index) => {
              const mesIndex = index + 1;
              const isCurrentExpanded = expanded === mesIndex;
              const dataInventario = inventarios[mesIndex];
              const isLoading = loadingMeses[mesIndex];
              
              const mapaItens = new Map((dataInventario?.itens ?? []).map(i => [i.produtoId, i]));

              // Soma geral do mês, usada na tabela (linha de rodapé) e mantida
              // consistente com o cálculo usado no CSV.
              let somaGeralMes = 0;

              return (
                <Accordion
                  key={mesIndex}
                  expanded={isCurrentExpanded}
                  onChange={handleAccordionChange(mesIndex)}
                  variant="outlined"
                  sx={{
                    borderRadius: '8px !important',
                    mb: 1,
                    overflow: 'hidden',
                    '@media print': {
                      display: isCurrentExpanded ? 'block' : 'none',
                      border: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ '@media print': { display: 'none' } }}>
                    <Stack direction="row" sx={{ width: '100%', alignItems: 'center', pr: 2, justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 600 }}>{nomeMes}</Typography>
                      {isLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : dataInventario ? (
                        <Chip
                          size="small"
                          icon={dataInventario.fechado ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                          label={dataInventario.fechado ? 'Fechado' : 'Em aberto'}
                          color={dataInventario.fechado ? 'default' : 'success'}
                          variant="outlined"
                        />
                      ) : (
                        <Chip size="small" label="Sem dados" variant="outlined" disabled />
                      )}
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    {!dataInventario || dataInventario.itens.length === 0 ? (
                      <Alert severity="info" variant="outlined" sx={{ borderStyle: 'dashed' }}>
                        Nenhum registro ou lançamento detectado para este período.
                      </Alert>
                    ) : (
                      <Stack spacing={2.5}>
                        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', '@media print': { display: 'none' } }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Print />}
                            onClick={handleImprimir}
                            disabled={!dataInventario.fechado}
                          >
                            Imprimir
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Download />}
                            onClick={() => gerarCSV(mesIndex)}
                            disabled={!dataInventario.fechado}
                          >
                            Exportar .CSV
                          </Button>
                        </Stack>

                        {!dataInventario.fechado && (
                          <Alert severity="warning" sx={{ '@media print': { display: 'none' } }}>
                            Este mês ainda não foi fechado e consolidado. Feche o mês na tela de lançamentos para liberar as exportações oficiais.
                          </Alert>
                        )}

                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Produto</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Fornecedor</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Unid.</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Qtd.</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Vlr. Unitário</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>IPI</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Frete</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {produtos.map((p) => {
                                const item = mapaItens.get(p.id);
                                const { qtd, val, ipiPercent, freteTotal, total } = calcularTotalItem(p, item);
                                somaGeralMes += total;

                                return (
                                  <TableRow key={p.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{p.nome}</TableCell>
                                    <TableCell color="text.secondary">{p.fornecedor?.nome ?? '—'}</TableCell>
                                    <TableCell><Chip label={p.unidadeMedida} size="small" sx={{ fontSize: 11, height: 20 }} /></TableCell>
                                    <TableCell align="right">{qtd || '—'}</TableCell>
                                    <TableCell align="right">{val ? `R$ ${val.toFixed(2)}` : '—'}</TableCell>
                                    <TableCell align="right">{p.temIpi ? `${ipiPercent}%` : <Typography variant="caption" color="text.disabled">—</Typography>}</TableCell>
                                    <TableCell align="right">{p.temFrete && freteTotal ? `R$ ${freteTotal.toFixed(2)}` : p.temFrete ? 'R$ 0,00' : <Typography variant="caption" color="text.disabled">—</Typography>}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                      {total > 0 ? `R$ ${total.toFixed(2)}` : '—'}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              <TableRow>
                                <TableCell colSpan={7} align="right" sx={{ fontWeight: 700 }}>
                                  TOTAL GERAL
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>
                                  {`R$ ${somaGeralMes.toFixed(2)}`}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Stack>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}