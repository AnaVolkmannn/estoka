'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  InputAdornment,
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

// ─── Tipos ────────────────────────────────────────────────────────────────────

const UNIDADES = ['UN', 'KG', 'G', 'L', 'ML', 'M', 'CM', 'CX', 'PC'];

interface Fornecedor {
  id: number;
  nome: string;
}

interface Product {
  id: number;
  nome: string;
  preco: number;
  ipi?: number;
  frete?: number;
  unidade: string;
  fornecedorId: number;
}

type ProductForm = Omit<Product, 'id'>;

const EMPTY_FORM: ProductForm = {
  nome: '',
  preco: 0,
  ipi: undefined,
  frete: undefined,
  unidade: 'UN',
  fornecedorId: 0,
};

// ─── API ──────────────────────────────────────────────────────────────────────

const BASE_URL_PRODUTOS = 'https://sua-api.com/produtos';
const BASE_URL_FORNECEDORES = 'https://sua-api.com/fornecedores';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return res.json();
}

const api = {
  list: () => apiFetch<Product[]>(BASE_URL_PRODUTOS),
  create: (data: ProductForm) => apiFetch<Product>(BASE_URL_PRODUTOS, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: ProductForm) => apiFetch<Product>(`${BASE_URL_PRODUTOS}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => apiFetch<void>(`${BASE_URL_PRODUTOS}/${id}`, { method: 'DELETE' }),
  fornecedores: () => apiFetch<Fornecedor[]>(BASE_URL_FORNECEDORES),
};

// ─── Formatadores ─────────────────────────────────────────────────────────────

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatPct = (v?: number) =>
  v != null ? `${v.toFixed(2)}%` : '—';

// ─── Ações compartilhadas ─────────────────────────────────────────────────────

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <>
      <Tooltip title="Editar">
        <IconButton size="small" onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir">
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}

// ─── Tabela desktop ───────────────────────────────────────────────────────────

function ProductTable({
  products,
  fornecedores,
  onEdit,
  onDelete,
}: {
  products: Product[];
  fornecedores: Fornecedor[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Fornecedor</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Preço</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>IPI</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Frete</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Unidade</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => {
            const fornecedor = fornecedores.find((f) => f.id === p.fornecedorId);
            return (
              <TableRow key={p.id} hover>
                <TableCell>{p.nome}</TableCell>
                <TableCell>{fornecedor?.nome ?? '—'}</TableCell>
                <TableCell>{formatBRL(p.preco)}</TableCell>
                <TableCell>{formatPct(p.ipi)}</TableCell>
                <TableCell>{formatPct(p.frete)}</TableCell>
                <TableCell><Chip label={p.unidade} size="small" /></TableCell>
                <TableCell align="right">
                  <RowActions onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Card mobile ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  fornecedores,
  onEdit,
  onDelete,
}: {
  product: Product;
  fornecedores: Fornecedor[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const fornecedor = fornecedores.find((f) => f.id === product.fornecedorId);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {product.nome}
            </Typography>
          </Box>
          <Chip label={product.unidade} size="small" sx={{ ml: 1, flexShrink: 0 }} />
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.disabled">Preço</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatBRL(product.preco)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled">IPI</Typography>
            <Typography variant="body2">{formatPct(product.ipi)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled">Frete</Typography>
            <Typography variant="body2">{formatPct(product.frete)}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.disabled">Fornecedor</Typography>
            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fornecedor?.nome ?? '—'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <RowActions onEdit={() => onEdit(product)} onDelete={() => onDelete(product)} />
      </CardActions>
    </Card>
  );
}

// ─── Modal criar/editar ───────────────────────────────────────────────────────

function ProductModal({
  open,
  initial,
  fornecedores,
  loadingFornecedores,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Product;
  fornecedores: Fornecedor[];
  loadingFornecedores: boolean;
  onClose: () => void;
  onSave: (form: ProductForm, id?: number) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, initial]);

  const set = (field: keyof ProductForm, value: string | number | undefined) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório';
    if (!form.fornecedorId) e.fornecedorId = 'Fornecedor obrigatório';
    if (form.preco <= 0) e.preco = 'Preço deve ser maior que zero';
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
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
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
              <MenuItem disabled sx={{ p: 0 }}>
                <Button component="a" href="/fornecedores" size="small" sx={{ px: 2, py: 1, width: '100%', justifyContent: 'flex-start' }}>
                  Nenhum fornecedor cadastrado. Cadastre aqui
                </Button>
              </MenuItem>
            ) : (
              fornecedores.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.nome}</MenuItem>
              ))
            )}
          </TextField>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Preço"
              type="number"
              value={form.preco}
              onChange={(e) => set('preco', parseFloat(e.target.value))}
              error={!!errors.preco}
              helperText={errors.preco}
              slotProps={{ input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> } }}
              fullWidth
            />
            <TextField
              label="Unidade"
              select
              value={form.unidade}
              onChange={(e) => set('unidade', e.target.value)}
              sx={{ minWidth: 100 }}
            >
              {UNIDADES.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
            </TextField>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="IPI (opcional)"
              type="number"
              value={form.ipi ?? ''}
              onChange={(e) => set('ipi', e.target.value ? parseFloat(e.target.value) : undefined)}
              slotProps={{ input: { endAdornment: <InputAdornment position="end">%</InputAdornment> } }}
              fullWidth
            />
            <TextField
              label="Frete (opcional)"
              type="number"
              value={form.frete ?? ''}
              onChange={(e) => set('frete', e.target.value ? parseFloat(e.target.value) : undefined)}
              slotProps={{ input: { endAdornment: <InputAdornment position="end">%</InputAdornment> } }}
              fullWidth
            />
          </Stack>
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

// ─── Modal exclusão ───────────────────────────────────────────────────────────

function DeleteDialog({
  product,
  onClose,
  onConfirm,
}: {
  product: Product | null;
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
    <Dialog open={!!product} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Excluir produto</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Tem certeza que deseja excluir <strong>{product?.nome}</strong>? Essa ação não pode ser desfeita.
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
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProductsCrud() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // ✅ detecta desktop

  const [products, setProducts] = useState<Product[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFornecedores, setLoadingFornecedores] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const notify = (msg: string, severity: 'success' | 'error' = 'success') =>
    setToast({ msg, severity });

  useEffect(() => {
    Promise.all([
      api.list().then(setProducts).catch(() => notify('Erro ao carregar produtos', 'error')).finally(() => setLoading(false)),
      api.fornecedores().then(setFornecedores).catch(() => notify('Erro ao carregar fornecedores', 'error')).finally(() => setLoadingFornecedores(false)),
    ]);
  }, []);

  const handleSave = async (form: ProductForm, id?: number) => {
    try {
      if (id) {
        const updated = await api.update(id, form);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        notify('Produto atualizado!');
      } else {
        const created = await api.create(form);
        setProducts((prev) => [created, ...prev]);
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
      setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
      notify('Produto excluído!');
    } catch {
      notify('Erro ao excluir produto', 'error');
      throw new Error('delete failed');
    }
  };

  const openEdit = (p: Product) => { setEditing(p); setModalOpen(true); };
  const openNew = () => { setEditing(undefined); setModalOpen(true); };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Header */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Produtos</Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? '...' : `${products.length} produto${products.length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}
          sx={{ display: { xs: 'none', sm: 'flex' } }}>
          Novo
        </Button>
      </Stack>

      {/* Lista — tabela no desktop, cards no mobile */}
      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={isDesktop ? 52 : 140} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Nenhum produto cadastrado.</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={openNew}>
            Cadastrar primeiro produto
          </Button>
        </Box>
      ) : isDesktop ? (
        <ProductTable
          products={products}
          fornecedores={fornecedores}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      ) : (
        <Stack spacing={2}>
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              fornecedores={fornecedores}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </Stack>
      )}

      {/* FAB mobile */}
      <Fab
        color="primary"
        onClick={openNew}
        sx={{ position: 'fixed', bottom: 24, right: 24, display: { xs: 'flex', sm: 'none' } }}
      >
        <AddIcon />
      </Fab>

      <ProductModal
        open={modalOpen}
        initial={editing}
        fornecedores={fornecedores}
        loadingFornecedores={loadingFornecedores}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteDialog
        product={deleting}
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