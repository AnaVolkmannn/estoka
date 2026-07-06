// src/app/produtos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Alert,
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

import { DoDisturb, Edit, Close, Restore, Add } from '@mui/icons-material';

// ─── Tipos ────────────────────────────────────────────────────────────────────

const UNIDADES = ['Unidade (UN)', 'Chapa (CH)', 'Kilo (KG)', 'Litro (L)', 'Balde (BL)', 'Metro (M)', 'Caixa (CX)', 'Peça (PC)'];

interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
}

interface Produto {
  id: number;
  nome: string;
  unidadeMedida: string;
  fornecedor: Fornecedor;
  temIpi: boolean;
  temFrete: boolean;
}

interface ProdutoForm {
  nome: string;
  unidadeMedida: string;
  fornecedorId: number;
  temIpi: boolean;
  temFrete: boolean;
}

const EMPTY_FORM: ProdutoForm = {
  nome: '',
  unidadeMedida: 'UN',
  fornecedorId: 0,
  temIpi: false,
  temFrete: false,
};

// ─── API ──────────────────────────────────────────────────────────────────────

const BASE_URL_PRODUTOS = 'http://localhost:8081/produtos';
const BASE_URL_FORNECEDORES = 'http://localhost:8081/fornecedores';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

const api = {
  list: () => apiFetch<Produto[]>(BASE_URL_PRODUTOS),
  listInativos: () => apiFetch<Produto[]>(`${BASE_URL_PRODUTOS}/inativos`),
  create: (data: ProdutoForm) =>
    apiFetch<Produto>(BASE_URL_PRODUTOS, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: ProdutoForm) =>
    apiFetch<Produto>(`${BASE_URL_PRODUTOS}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<void>(`${BASE_URL_PRODUTOS}/${id}`, { method: 'DELETE' }),
  reativar: (id: number) =>
    apiFetch<void>(`${BASE_URL_PRODUTOS}/${id}/reativar`, { method: 'PUT' }),
  fornecedores: () => apiFetch<Fornecedor[]>(BASE_URL_FORNECEDORES),
};

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

// ─── Ações ativos ─────────────────────────────────────────────────────────────

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <>
      <Tooltip title="Editar">
        <IconButton size="small" onClick={onEdit}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Inativar">
        <IconButton size="small" color="error" onClick={onDelete}>
          <DoDisturb fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}

// ─── Ações inativos ───────────────────────────────────────────────────────────

function RowActionsInativo({ onReativar }: { onReativar: () => void }) {
  return (
    <Tooltip title="Reativar">
      <IconButton size="small" color="success" onClick={onReativar}>
        <Restore fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

// ─── Tabela desktop ───────────────────────────────────────────────────────────

function ProdutoTable({
  produtos,
  inativo,
  onEdit,
  onDelete,
  onReativar,
}: {
  produtos: Produto[];
  inativo: boolean;
  onEdit: (p: Produto) => void;
  onDelete: (p: Produto) => void;
  onReativar: (p: Produto) => void;
}) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Fornecedor</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Unidade</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Encargos</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {produtos.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell sx={{ color: inativo ? 'text.disabled' : 'inherit' }}>{p.nome}</TableCell>
              <TableCell sx={{ color: inativo ? 'text.disabled' : 'inherit' }}>{p.fornecedor?.nome ?? '—'}</TableCell>
              <TableCell><Chip label={p.unidadeMedida} size="small" /></TableCell>
              <TableCell><ProdutoBadges produto={p} /></TableCell>
              <TableCell align="right">
                {inativo
                  ? <RowActionsInativo onReativar={() => onReativar(p)} />
                  : <RowActions onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Card mobile ──────────────────────────────────────────────────────────────

function ProdutoCard({
  produto,
  inativo,
  onEdit,
  onDelete,
  onReativar,
}: {
  produto: Produto;
  inativo: boolean;
  onEdit: (p: Produto) => void;
  onDelete: (p: Produto) => void;
  onReativar: (p: Produto) => void;
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, opacity: inativo ? 0.6 : 1 }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{produto.nome}</Typography>
          <Chip label={produto.unidadeMedida} size="small" sx={{ ml: 1 }} />
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="caption" color="text.disabled">Fornecedor</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{produto.fornecedor?.nome ?? '—'}</Typography>
          </Box>
          <ProdutoBadges produto={produto} />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        {inativo
          ? <RowActionsInativo onReativar={() => onReativar(produto)} />
          : <RowActions onEdit={() => onEdit(produto)} onDelete={() => onDelete(produto)} />
        }
      </CardActions>
    </Card>
  );
}

// ─── Modal criar/editar ───────────────────────────────────────────────────────

function ProdutoModal({
  open,
  initial,
  fornecedores,
  loadingFornecedores,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Produto;
  fornecedores: Fornecedor[];
  loadingFornecedores: boolean;
  onClose: () => void;
  onSave: (form: ProdutoForm, id?: number) => Promise<void>;
}) {
  const [form, setForm] = useState<ProdutoForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProdutoForm, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              nome: initial.nome,
              unidadeMedida: initial.unidadeMedida,
              fornecedorId: initial.fornecedor.id,
              temIpi: initial.temIpi,
              temFrete: initial.temFrete,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, initial]);

  const set = (field: keyof ProdutoForm, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório';
    if (!form.fornecedorId) e.fornecedorId = 'Fornecedor obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form, initial?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {initial ? 'Editar produto' : 'Novo produto'}
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Nome"
            value={form.nome}
            onChange={(e) => set('nome', e.target.value)}
            error={!!errors.nome}
            helperText={errors.nome}
            fullWidth
          />
          <TextField
            label="Fornecedor"
            select
            value={form.fornecedorId || ''}
            onChange={(e) => set('fornecedorId', Number(e.target.value))}
            error={!!errors.fornecedorId}
            helperText={errors.fornecedorId}
            disabled={loadingFornecedores}
            fullWidth
          >
            {loadingFornecedores ? (
              <MenuItem disabled>Carregando...</MenuItem>
            ) : fornecedores.length === 0 ? (
              <MenuItem disabled>
                <Button component="a" href="/fornecedores" size="small">
                  Nenhum fornecedor. Cadastre aqui
                </Button>
              </MenuItem>
            ) : (
              fornecedores.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.nome}</MenuItem>
              ))
            )}
          </TextField>
          <TextField
            label="Unidade"
            select
            value={form.unidadeMedida}
            onChange={(e) => set('unidadeMedida', e.target.value)}
            fullWidth
          >
            {UNIDADES.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </TextField>

          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.temIpi}
                  onChange={(e) => set('temIpi', e.target.checked)}
                />
              }
              label="Tem IPI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.temFrete}
                  onChange={(e) => set('temFrete', e.target.checked)}
                />
              }
              label="Tem Frete"
            />
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Modal inativar ───────────────────────────────────────────────────────────

function DeleteDialog({
  produto,
  onClose,
  onConfirm,
}: {
  produto: Produto | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={!!produto} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Inativar produto</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Tem certeza que deseja inativar <strong>{produto?.nome}</strong>? O histórico será preservado.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handle}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? 'Inativando...' : 'Inativar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProdutosCrud() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [filtro, setFiltro] = useState<'ativos' | 'inativos'>('ativos');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [inativos, setInativos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFornecedores, setLoadingFornecedores] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Produto | undefined>();
  const [deleting, setDeleting] = useState<Produto | null>(null);
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const notify = (msg: string, severity: 'success' | 'error' = 'success') =>
    setToast({ msg, severity });

  const carregarProdutos = () => {
    setLoading(true);
    Promise.all([
      api.list(),
      api.listInativos(),
    ])
      .then(([ativos, inativosData]) => {
        setProdutos(ativos);
        setInativos(inativosData);
      })
      .catch(() => notify('Erro ao carregar produtos', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarProdutos();
    api.fornecedores()
      .then(setFornecedores)
      .catch(() => notify('Erro ao carregar fornecedores', 'error'))
      .finally(() => setLoadingFornecedores(false));
  }, []);

  const handleSave = async (form: ProdutoForm, id?: number) => {
    try {
      if (id) {
        const updated = await api.update(id, form);
        setProdutos((prev) => prev.map((p) => (p.id === id ? updated : p)));
        notify('Produto atualizado!');
      } else {
        const created = await api.create(form);
        setProdutos((prev) => [created, ...prev]);
        notify('Produto criado!');
      }
    } catch {
      notify('Erro ao salvar produto', 'error');
      throw new Error('save failed');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.remove(deleting.id);
      setProdutos((prev) => prev.filter((p) => p.id !== deleting.id));
      setInativos((prev) => [deleting, ...prev]);
      notify('Produto inativado!');
    } catch {
      notify('Erro ao inativar produto', 'error');
      throw new Error('delete failed');
    }
  };

  const handleReativar = async (produto: Produto) => {
    try {
      await api.reativar(produto.id);
      setInativos((prev) => prev.filter((p) => p.id !== produto.id));
      setProdutos((prev) => [produto, ...prev]);
      notify('Produto reativado!');
    } catch {
      notify('Erro ao reativar produto', 'error');
    }
  };

  const openEdit = (p: Produto) => { setEditing(p); setModalOpen(true); };
  const openNew = () => { setEditing(undefined); setModalOpen(true); };

  const lista = filtro === 'ativos' ? produtos : inativos;
  const isInativo = filtro === 'inativos';

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Produtos</Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? '...' : `${lista.length} produto${lista.length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <ToggleButtonGroup
            value={filtro}
            exclusive
            onChange={(_, val) => val && setFiltro(val)}
            size="small"
          >
            <ToggleButton value="ativos">Ativos</ToggleButton>
            <ToggleButton value="inativos">Inativos</ToggleButton>
          </ToggleButtonGroup>
          {!isInativo && (
            <Button variant="contained" startIcon={<Add />} onClick={openNew}
              sx={{ display: { xs: 'none', sm: 'flex' } }}>
              Novo
            </Button>
          )}
        </Stack>
      </Stack>

      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={isDesktop ? 52 : 120} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      ) : lista.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            {isInativo ? 'Nenhum produto inativo.' : 'Nenhum produto cadastrado.'}
          </Typography>
          {!isInativo && (
            <Button variant="outlined" sx={{ mt: 2 }} onClick={openNew}>
              Cadastrar primeiro produto
            </Button>
          )}
        </Box>
      ) : isDesktop ? (
        <ProdutoTable
          produtos={lista}
          inativo={isInativo}
          onEdit={openEdit}
          onDelete={setDeleting}
          onReativar={handleReativar}
        />
      ) : (
        <Stack spacing={2}>
          {lista.map((p) => (
            <ProdutoCard
              key={p.id}
              produto={p}
              inativo={isInativo}
              onEdit={openEdit}
              onDelete={setDeleting}
              onReativar={handleReativar}
            />
          ))}
        </Stack>
      )}

      {!isInativo && (
        <Fab
          color="primary"
          onClick={openNew}
          sx={{ position: 'fixed', bottom: 24, right: 24, display: { xs: 'flex', sm: 'none' } }}
        >
          <Add />
        </Fab>
      )}

      <ProdutoModal
        open={modalOpen}
        initial={editing}
        fornecedores={fornecedores}
        loadingFornecedores={loadingFornecedores}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteDialog
        produto={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />

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