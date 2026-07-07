'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
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
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Lock, LockOpen, History, Save } from '@mui/icons-material';

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
  valorAtualizadoEm: string | null;
  ipi: number | null;
  ipiAtualizadoEm: string | null;
  frete: number | null;
  freteAtualizadoEm: string | null;
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

type Aba = 'quantidades' | 'precos';

// ─── API ──────────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
const BASE_URL_PRODUTOS = `${API_URL}/produtos`;
const BASE_URL_INVENTARIOS = `${API_URL}/inventarios`;

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let mensagem = `Erro ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) mensagem = body.error;
    } catch {
      // mantém a mensagem genérica
    }
    throw new Error(mensagem);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

interface InventarioResponse {
  fechado: boolean;
  itens: ItemInventario[];
}

const api = {
  produtosAtivos: () => apiFetch<Produto[]>(BASE_URL_PRODUTOS),

  buscarInventario: (mes: number, ano: number) =>
    apiFetch<InventarioResponse>(`${BASE_URL_INVENTARIOS}?mes=${mes}&ano=${ano}`),

  salvarQuantidade: (mes: number, ano: number, produtoId: number, quantidade: number | null) =>
    apiFetch<void>(`${BASE_URL_INVENTARIOS}/item/quantidade`, {
      method: 'PUT',
      body: JSON.stringify({ mes, ano, produtoId, quantidade }),
    }),

  salvarValor: (mes: number, ano: number, produtoId: number, valor: number | null) =>
    apiFetch<void>(`${BASE_URL_INVENTARIOS}/item/valor`, {
      method: 'PUT',
      body: JSON.stringify({ mes, ano, produtoId, valor }),
    }),

  salvarIpi: (mes: number, ano: number, produtoId: number, ipi: number | null) =>
    apiFetch<void>(`${BASE_URL_INVENTARIOS}/item/ipi`, {
      method: 'PUT',
      body: JSON.stringify({ mes, ano, produtoId, ipi }),
    }),

  salvarFrete: (mes: number, ano: number, produtoId: number, frete: number | null) =>
    apiFetch<void>(`${BASE_URL_INVENTARIOS}/item/frete`, {
      method: 'PUT',
      body: JSON.stringify({ mes, ano, produtoId, frete }),
    }),

  fecharMes: (mes: number, ano: number) =>
    apiFetch<void>(`${BASE_URL_INVENTARIOS}/fechar`, {
      method: 'POST',
      body: JSON.stringify({ mes, ano }),
    }),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseNum = (v: string): number | null => {
  const trimmed = v.trim().replace(/\./g, '').replace(',', '.');
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isNaN(n) ? null : n;
};

const formatCurrencyInput = (v: string) => {
  const digits = v.replace(/\D/g, '');
  if (!digits) return '';
  const value = Number(digits) / 100;
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatPercentInput = (v: string) => {
  const digits = v.replace(/\D/g, '');
  if (!digits) return '';
  const value = Number(digits) / 100;
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatarValorInicial = (num: number | null): string => {
  if (num == null) return '';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatarData = (iso: string | null) => {
  if (!iso) return 'Nunca atualizado';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
};

const mensagemErro = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

// ─── Badges IPI/Frete ─────────────────────────────────────────────────────────

function ProdutoBadges({ produto }: { produto: Produto }) {
  if (!produto.temIpi && !produto.temFrete) return null;
  return (
    <Stack direction="row" spacing={0.5}>
      {produto.temIpi && <Chip label="IPI" size="small" color="warning" variant="outlined" />}
      {produto.temFrete && <Chip label="Frete" size="small" color="info" variant="outlined" />}
    </Stack>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function LancarInventario() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const hoje = useMemo(() => new Date(), []);

  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [aba, setAba] = useState<Aba>('quantidades');

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  const [quantidades, setQuantidades] = useState<Record<number, string>>({});
  const [valores, setValores] = useState<Record<number, string>>({});
  const [ipis, setIpis] = useState<Record<number, string>>({});
  const [fretes, setFretes] = useState<Record<number, string>>({});

  const [dbQuantidades, setDbQuantidades] = useState<Record<number, string>>({});
  const [dbValores, setDbValores] = useState<Record<number, string>>({});
  const [dbIpis, setDbIpis] = useState<Record<number, string>>({});
  const [dbFretes, setDbFretes] = useState<Record<number, string>>({});

  const [valoresAtualizadoEm, setValoresAtualizadoEm] = useState<Record<number, string | null>>({});
  const [ipisAtualizadoEm, setIpisAtualizadoEm] = useState<Record<number, string | null>>({});
  const [fretesAtualizadoEm, setFretesAtualizadoEm] = useState<Record<number, string | null>>({});

  const [fechado, setFechado] = useState(false);
  const [loadingInventario, setLoadingInventario] = useState(true);
  const [salvandoAba, setSalvandoAba] = useState(false);
  const [confirmFechar, setConfirmFechar] = useState(false);
  const [fechando, setFechando] = useState(false);
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const notify = (msg: string, severity: 'success' | 'error' = 'success') =>
    setToast({ msg, severity });

  useEffect(() => {
    api.produtosAtivos()
      .then(setProdutos)
      .catch((err) => notify(mensagemErro(err, 'Erro ao carregar produtos'), 'error'))
      .finally(() => setLoadingProdutos(false));
  }, []);

  useEffect(() => {
    setLoadingInventario(true);
    api.buscarInventario(mes, ano)
      .then((data) => {
        setFechado(data.fechado);
        const qtd: Record<number, string> = {};
        const val: Record<number, string> = {};
        const valDt: Record<number, string | null> = {};
        const ipi: Record<number, string> = {};
        const ipiDt: Record<number, string | null> = {};
        const frete: Record<number, string> = {};
        const freteDt: Record<number, string | null> = {};

        data.itens.forEach((item) => {
          qtd[item.produtoId] = item.quantidade != null ? String(item.quantidade) : '';
          val[item.produtoId] = formatarValorInicial(item.valor);
          ipi[item.produtoId] = formatarValorInicial(item.ipi);
          frete[item.produtoId] = formatarValorInicial(item.frete);

          valDt[item.produtoId] = item.valorAtualizadoEm;
          ipiDt[item.produtoId] = item.ipiAtualizadoEm;
          freteDt[item.produtoId] = item.freteAtualizadoEm;
        });

        setQuantidades(qtd);
        setDbQuantidades({ ...qtd });
        setValores(val);
        setDbValores({ ...val });
        setIpis(ipi);
        setDbIpis({ ...ipi });
        setFretes(frete);
        setDbFretes({ ...frete });

        setValoresAtualizadoEm(valDt);
        setIpisAtualizadoEm(ipiDt);
        setFretesAtualizadoEm(freteDt);
      })
      .catch((err) => notify(mensagemErro(err, 'Erro ao carregar inventário'), 'error'))
      .finally(() => setLoadingInventario(false));
  }, [mes, ano]);

  const handleSalvarQuantidades = async () => {
    setSalvandoAba(true);
    try {
      for (const p of produtos) {
        const atual = quantidades[p.id] ?? '';
        if (atual !== (dbQuantidades[p.id] ?? '')) {
          await api.salvarQuantidade(mes, ano, p.id, parseNum(atual));
        }
      }
      setDbQuantidades({ ...quantidades });
      notify('Quantidades salvas com sucesso!');
    } catch (err) {
      notify(mensagemErro(err, 'Erro ao salvar quantidades'), 'error');
    } finally {
      setSalvandoAba(false);
    }
  };

  const handleSalvarPrecos = async () => {
    setSalvandoAba(true);
    const agoraStr = new Date().toISOString();
    try {
      for (const p of produtos) {
        const valAtual = valores[p.id] ?? '';
        if (valAtual !== (dbValores[p.id] ?? '')) {
          await api.salvarValor(mes, ano, p.id, parseNum(valAtual));
          setValoresAtualizadoEm(prev => ({ ...prev, [p.id]: agoraStr }));
        }

        if (p.temIpi) {
          const ipiAtual = ipis[p.id] ?? '';
          if (ipiAtual !== (dbIpis[p.id] ?? '')) {
            await api.salvarIpi(mes, ano, p.id, parseNum(ipiAtual));
            setIpisAtualizadoEm(prev => ({ ...prev, [p.id]: agoraStr }));
          }
        }

        if (p.temFrete) {
          const freteAtual = fretes[p.id] ?? '';
          if (freteAtual !== (dbFretes[p.id] ?? '')) {
            await api.salvarFrete(mes, ano, p.id, parseNum(freteAtual));
            setFretesAtualizadoEm(prev => ({ ...prev, [p.id]: agoraStr }));
          }
        }
      }
      setDbValores({ ...valores });
      setDbIpis({ ...ipis });
      setDbFretes({ ...fretes });
      notify('Preços e taxas salvos com sucesso!');
    } catch (err) {
      notify(mensagemErro(err, 'Erro ao salvar preços'), 'error');
    } finally {
      setSalvandoAba(false);
    }
  };

  const anos = useMemo(() => {
    const atual = hoje.getFullYear();
    return [atual - 2, atual - 1, atual, atual + 1];
  }, [hoje]);

  const semQuantidade = produtos.filter((p) => (quantidades[p.id] ?? '').trim() === '').length;

  const temAlteracaoQuantidades = JSON.stringify(quantidades) !== JSON.stringify(dbQuantidades);
  const temAlteracaoPrecos = JSON.stringify(valores) !== JSON.stringify(dbValores) ||
    JSON.stringify(ipis) !== JSON.stringify(dbIpis) ||
    JSON.stringify(fretes) !== JSON.stringify(dbFretes);

  const podeFecharMes = useMemo(() => {
    if (produtos.length === 0) return false;

    const tudoSalvo = !temAlteracaoQuantidades && !temAlteracaoPrecos;
    if (!tudoSalvo) return false;

    const todosComQtd = produtos.every(p => (dbQuantidades[p.id] ?? '').trim() !== '');
    const todosComValor = produtos.every(p => (dbValores[p.id] ?? '').trim() !== '');

    return todosComQtd && todosComValor;
  }, [produtos, temAlteracaoQuantidades, temAlteracaoPrecos, dbQuantidades, dbValores]);

  const loading = loadingProdutos || loadingInventario;

  const handleFechar = async () => {
    setFechando(true);
    try {
      await api.fecharMes(mes, ano);
      setFechado(true);
      setConfirmFechar(false);
      notify('Mês fechado e consolidado com sucesso!');
    } catch (err) {
      notify(mensagemErro(err, 'Erro ao fechar o mês'), 'error');
    } finally {
      setFechando(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Header */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Lançar inventário</Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? '...' : `${MESES[mes - 1]} de ${ano} · ${produtos.length} produto${produtos.length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Mês</InputLabel>
            <Select label="Mês" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {MESES.map((nome, i) => (
                <MenuItem key={nome} value={i + 1}>{nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Ano</InputLabel>
            <Select label="Ano" value={ano} onChange={(e) => setAno(Number(e.target.value))}>
              {anos.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          size="small"
          icon={fechado ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
          label={fechado ? 'Fechado / Consolidado' : 'Em aberto'}
          color={fechado ? 'default' : 'success'}
          variant={fechado ? 'filled' : 'outlined'}
        />
        {!fechado && semQuantidade > 0 && (
          <Chip size="small" color="error" variant="outlined" label={`${semQuantidade} sem lançar`} />
        )}
        {!fechado && (temAlteracaoQuantidades || temAlteracaoPrecos) && (
          <Chip size="small" color="warning" variant="filled" label="Alterações não salvas" />
        )}

        <Box sx={{ flexGrow: 1 }} />

        <ToggleButtonGroup
          value={aba}
          exclusive
          onChange={(_, val) => val && setAba(val)}
          size="small"
        >
          <ToggleButton value="quantidades">Quantidades</ToggleButton>
          <ToggleButton value="precos">Preços</ToggleButton>
        </ToggleButtonGroup>

        <Tooltip title={!podeFecharMes && !fechado ? "Garanta que salvou as duas abas e que todos os campos estão preenchidos antes de fechar." : ""}>
          <span>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={fechado || loading || !podeFecharMes}
              onClick={() => setConfirmFechar(true)}
            >
              Fechar mês
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={isDesktop ? 52 : 100} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      ) : produtos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Nenhum produto ativo para lançar inventário.</Typography>
        </Box>
      ) : isDesktop ? (
        aba === 'quantidades' ? (
          // ─── DESKTOP · QUANTIDADES ───
          <Stack spacing={2}>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem' }}>Nome</Typography>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem' }}>Fornecedor</Typography>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem', width: 220 }}>Quantidade</Typography>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem' }}>Unidade</Typography>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produtos.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.nome}</TableCell>
                      <TableCell>{p.fornecedor?.nome ?? '—'}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <TextField
                          size="small"
                          type="number"
                          fullWidth
                          disabled={fechado}
                          value={quantidades[p.id] ?? ''}
                          onChange={(e) => setQuantidades((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell><Chip label={p.unidadeMedida} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!fechado && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={salvandoAba ? <CircularProgress size={18} color="inherit" /> : <Save />}
                  onClick={handleSalvarQuantidades}
                  disabled={salvandoAba}
                >
                  Salvar Quantidades
                </Button>
              </Box>
            )}
          </Stack>
        ) : (
          // ─── DESKTOP · PREÇOS ───
          <Stack spacing={2}>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem' }}>Produto</Typography>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem', width: 180 }}>Valor unitário (R$)</Typography>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem', width: 140 }}>IPI Unitário (%)</Typography>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem', width: 160 }}>Frete Unitário (%)</Typography>
                    <Typography component="th" sx={{ display: 'table-cell', p: 1.5, fontWeight: 700, fontSize: '0.875rem', width: 200 }}>Atualizado em</Typography>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produtos.map((p) => {
                    const datas = [valoresAtualizadoEm[p.id], ipisAtualizadoEm[p.id], fretesAtualizadoEm[p.id]]
                      .filter(Boolean) as string[];
                    const maisRecente = datas.sort().reverse()[0] ?? null;

                    return (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">{p.nome}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {p.fornecedor?.nome ?? '—'}
                            </Typography>
                            <ProdutoBadges produto={p} />
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ py: 1 }}>
                          <TextField
                            size="small"
                            type="text"
                            fullWidth
                            disabled={fechado}
                            value={valores[p.id] ?? ''}
                            onChange={(e) => {
                              const formatado = formatCurrencyInput(e.target.value);
                              setValores((prev) => ({ ...prev, [p.id]: formatado }));
                            }}
                            slotProps={{
                              input: {
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                              } as any,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ py: 1 }}>
                          {p.temIpi ? (
                            <TextField
                              size="small"
                              type="text"
                              fullWidth
                              disabled={fechado}
                              value={ipis[p.id] ?? ''}
                              onChange={(e) => {
                                const formatado = formatPercentInput(e.target.value);
                                setIpis((prev) => ({ ...prev, [p.id]: formatado }));
                              }}
                              slotProps={{
                                input: {
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                } as any,
                              }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ py: 1 }}>
                          {p.temFrete ? (
                            <TextField
                              size="small"
                              type="text"
                              fullWidth
                              disabled={fechado}
                              value={fretes[p.id] ?? ''}
                              onChange={(e) => {
                                const formatado = formatPercentInput(e.target.value);
                                setFretes((prev) => ({ ...prev, [p.id]: formatado }));
                              }}
                              slotProps={{
                                input: {
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                } as any,
                              }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Tooltip title="Data do último valor, IPI ou frete alterado">
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                              <History fontSize="small" />
                              <Typography variant="caption">{formatarData(maisRecente)}</Typography>
                            </Stack>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {!fechado && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={salvandoAba ? <CircularProgress size={18} color="inherit" /> : <Save />}
                  onClick={handleSalvarPrecos}
                  disabled={salvandoAba}
                >
                  Salvar Preços
                </Button>
              </Box>
            )}
          </Stack>
        )
      ) : (
        // ─── MOBILE · CARDS ───
        <Stack spacing={2}>
          {produtos.map((p) => {
            const datas = [valoresAtualizadoEm[p.id], ipisAtualizadoEm[p.id], fretesAtualizadoEm[p.id]]
              .filter(Boolean) as string[];
            const maisRecente = datas.sort().reverse()[0] ?? null;

            return (
              <Card key={p.id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ pb: 2 }}>
                  <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{p.nome}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.fornecedor?.nome ?? '—'} · {p.unidadeMedida}
                      </Typography>
                    </Box>
                  </Stack>

                  {aba === 'precos' && (
                    <Box sx={{ mt: 1 }}>
                      <ProdutoBadges produto={p} />
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  {aba === 'quantidades' ? (
                    <TextField
                      label="Quantidade"
                      size="small"
                      type="number"
                      fullWidth
                      disabled={fechado}
                      value={quantidades[p.id] ?? ''}
                      onChange={(e) => setQuantidades((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    />
                  ) : (
                    <Stack spacing={1.5}>
                      <TextField
                        label="Valor"
                        size="small"
                        type="text"
                        fullWidth
                        disabled={fechado}
                        value={valores[p.id] ?? ''}
                        onChange={(e) => {
                          const formatado = formatCurrencyInput(e.target.value);
                          setValores((prev) => ({ ...prev, [p.id]: formatado }));
                        }}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            } as any,
                        }}
                      />

                      {p.temIpi && (
                        <TextField
                          label="IPI"
                          size="small"
                          type="text"
                          fullWidth
                          disabled={fechado}
                          value={ipis[p.id] ?? ''}
                          onChange={(e) => {
                            const formatado = formatPercentInput(e.target.value);
                            setIpis((prev) => ({ ...prev, [p.id]: formatado }));
                          }}
                          slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            } as any,
                        }}
                        />
                      )}

                      {p.temFrete && (
                        <TextField
                          label="Frete"
                          size="small"
                          type="text"
                          fullWidth
                          disabled={fechado}
                          value={fretes[p.id] ?? ''}
                          onChange={(e) => {
                            const formatado = formatCurrencyInput(e.target.value);
                            setFretes((prev) => ({ ...prev, [p.id]: formatado }));
                          }}
                          slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            } as any,
                        }}
                        />
                      )}

                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                        <History fontSize="small" />
                        <Typography variant="caption">
                          Atualizado em: {formatarData(maisRecente)}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {!fechado && (
            <Box sx={{ mt: 1, mb: 4 }}>
              {aba === 'quantidades' ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={salvandoAba ? <CircularProgress size={18} color="inherit" /> : <Save />}
                  onClick={handleSalvarQuantidades}
                  disabled={salvandoAba}
                >
                  Salvar Quantidades
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={salvandoAba ? <CircularProgress size={18} color="inherit" /> : <Save />}
                  onClick={handleSalvarPrecos}
                  disabled={salvandoAba}
                >
                  Salvar Preços
                </Button>
              )}
            </Box>
          )}
        </Stack>
      )}

      {/* Confirmação de fechamento */}
      <Dialog open={confirmFechar} onClose={() => setConfirmFechar(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Fechar mês</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Isso vai consolidar o inventário de <strong>{MESES[mes - 1]} de {ano}</strong>.
            Depois de fechado, não será possível realizar nenhuma edição. Deseja continuar?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmFechar(false)} disabled={fechando}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleFechar}
            disabled={fechando}
            startIcon={fechando ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {fechando ? 'Fechando...' : 'Fechar mês'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.severity} onClose={() => setToast(null)} sx={{ width: '100%' }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}