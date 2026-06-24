'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  Skeleton,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
}

type FornecedorForm = Omit<Fornecedor, 'id'>;

const EMPTY_FORM: FornecedorForm = {
  nome: '',
  cnpj: undefined,
};

// ─── API ──────────────────────────────────────────────────────────────────────
// Troque BASE_URL pela URL da sua API

const BASE_URL = 'https://sua-api.com/fornecedores';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return res.json();
}

const api = {
  list: () => apiFetch<Fornecedor[]>(''),
  create: (data: FornecedorForm) => apiFetch<Fornecedor>('', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: FornecedorForm) => apiFetch<Fornecedor>(`/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => apiFetch<void>(`/${id}`, { method: 'DELETE' }),
};

// ─── Formatadores ─────────────────────────────────────────────────────────────
const formatCnpj = (v?: string) => {
  if (!v) return '—';
  const digits = v.replace(/\D/g, '').padStart(14, '0');
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

// ─── Card de produto ──────────────────────────────────────────────────────────

function FornecedorCard({
  fornecedor,
  onEdit,
  onDelete,
}: {
  fornecedor: Fornecedor;
  onEdit: (p: Fornecedor) => void;
  onDelete: (p: Fornecedor) => void;
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {fornecedor.nome}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCnpj(fornecedor.cnpj)}</Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Editar">
          <IconButton size="small" onClick={() => onEdit(fornecedor)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Excluir">
          <IconButton size="small" color="error" onClick={() => onDelete(fornecedor)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

// ─── Modal de criação / edição ────────────────────────────────────────────────

function FornecedorModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Fornecedor;
  onClose: () => void;
  onSave: (form: FornecedorForm, id?: number) => Promise<void>;
}) {
  const [form, setForm] = useState<FornecedorForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FornecedorForm, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, initial]);

  const set = (field: keyof FornecedorForm, value: string | number | undefined) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nome.trim()) e.nome = 'Nome do fornecedor obrigatório';
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={false}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {initial ? 'Editar fornecedor' : 'Novo fornecedor'}
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Nome do fornecedor"
            value={form.nome}
            onChange={(e) => set('nome', e.target.value)}
            error={!!errors.nome}
            helperText={errors.nome}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="CNPJ (opcional)"
              type="number"
              value={form.cnpj ?? ''}
              onChange={(e) => set('cnpj', e.target.value ? parseFloat(e.target.value) : undefined)}
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

// ─── Modal de confirmação de exclusão ────────────────────────────────────────

function DeleteDialog({
  fornecedor,
  onClose,
  onConfirm,
}: {
  fornecedor: Fornecedor | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!fornecedor} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Excluir produto</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Tem certeza que deseja excluir <strong>{fornecedor?.nome}</strong>? Essa ação não pode ser desfeita.
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

export default function FornecedorCrud() {
  const [fornecedor, setFornecedor] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Fornecedor | undefined>();
  const [deleting, setDeleting] = useState<Fornecedor | null>(null);
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const notify = (msg: string, severity: 'success' | 'error' = 'success') =>
    setToast({ msg, severity });

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.list();
      setFornecedor(data);
    } catch {
      notify('Erro ao carregar fornecedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form: FornecedorForm, id?: number) => {
    try {
      if (id) {
        const updated = await api.update(id, form);
        setFornecedor((prev) => prev.map((p) => (p.id === id ? updated : p)));
        notify('Fornecedor atualizado!');
      } else {
        const created = await api.create(form);
        setFornecedor((prev) => [created, ...prev]);
        notify('Fornecedor adicionado!');
      }
    } catch {
      notify('Erro ao salvar novo fornecedor', 'error');
      throw new Error('save failed');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.remove(deleting.id);
      setFornecedor((prev) => prev.filter((p) => p.id !== deleting.id));
      notify('Fornecedor excluído!');
    } catch {
      notify('Erro ao excluir fornecedor', 'error');
      throw new Error('delete failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 3 }}>
      {/* Header */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Fornecedores</Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? '...' : `${fornecedor.length} fornecedor${fornecedor.length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditing(undefined); setModalOpen(true); }}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Novo
        </Button>
      </Stack>

      {/* Lista */}
      <Stack spacing={2}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 3 }} />
            ))
          : fornecedor.length === 0
          ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">Nenhum fornecedor cadastrado.</Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => { setEditing(undefined); setModalOpen(true); }}
                >
                  Cadastrar primeiro fornecedor
                </Button>
              </Box>
            )
          : fornecedor.map((p) => (
              <FornecedorCard
                key={p.id}
                fornecedor={p}
                onEdit={(p) => { setEditing(p); setModalOpen(true); }}
                onDelete={setDeleting}
              />
            ))}
      </Stack>

      {/* FAB mobile */}
      <Fab
        color="primary"
        onClick={() => { setEditing(undefined); setModalOpen(true); }}
        sx={{ position: 'fixed', bottom: 24, right: 24, display: { xs: 'flex', sm: 'none' } }}
      >
        <AddIcon />
      </Fab>

      {/* Modal criar/editar */}
      <FornecedorModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {/* Modal excluir */}
      <DeleteDialog
        fornecedor={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />

      {/* Toast */}
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