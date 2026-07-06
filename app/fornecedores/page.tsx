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
import CloseIcon from '@mui/icons-material/Close';

interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
}

type FornecedorForm = Omit<Fornecedor, 'id'>;

const EMPTY_FORM: FornecedorForm = { nome: '', cnpj: undefined };

const BASE_URL = 'http://localhost:8081/fornecedores';

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
  list: () => apiFetch<Fornecedor[]>(BASE_URL),
  create: (data: FornecedorForm) => apiFetch<Fornecedor>(BASE_URL, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: FornecedorForm) => apiFetch<Fornecedor>(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

const formatCnpj = (v?: string) => {
  if (!v) return '—';
  const digits = v.replace(/\D/g, '').padStart(14, '0');
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

// ─── Ações ────────────────────────────────────────────────────────────────────

function RowActions({ onEdit }: { onEdit: () => void; }) {
  return (
    <>
      <Tooltip title="Editar">
        <IconButton size="small" onClick={onEdit}><EditIcon fontSize="small" /></IconButton>
      </Tooltip>
    </>
  );
}

// ─── Tabela desktop ───────────────────────────────────────────────────────────

function FornecedorTable({
  fornecedores,
  onEdit,
}: {
  fornecedores: Fornecedor[];
  onEdit: (f: Fornecedor) => void;
}) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>CNPJ</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fornecedores.map((f) => (
            <TableRow key={f.id} hover>
              <TableCell>{f.nome}</TableCell>
              <TableCell>{formatCnpj(f.cnpj)}</TableCell>
              <TableCell align="right">
                <RowActions onEdit={() => onEdit(f)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Card mobile ──────────────────────────────────────────────────────────────

function FornecedorCard({
  fornecedor,
  onEdit,
}: {
  fornecedor: Fornecedor;
  onEdit: (f: Fornecedor) => void;
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{fornecedor.nome}</Typography>
        <Divider sx={{ my: 1.5 }} />
        <Box>
          <Typography variant="caption" color="text.disabled">CNPJ</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCnpj(fornecedor.cnpj)}</Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <RowActions onEdit={() => onEdit(fornecedor)} />
      </CardActions>
    </Card>
  );
}

// ─── Modal criar/editar ───────────────────────────────────────────────────────

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
    if (open) { setForm(initial ? { ...initial } : EMPTY_FORM); setErrors({}); }
  }, [open, initial]);

  const set = (field: keyof FornecedorForm, value: string | undefined) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try { await onSave(form, initial?.id); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {initial ? 'Editar fornecedor' : 'Novo fornecedor'}
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
            label="CNPJ (opcional)"
            value={form.cnpj ?? ''}
            onChange={(e) => set('cnpj', e.target.value || undefined)}
            placeholder="00.000.000/0000-00"
            fullWidth
          />
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

// ─── Página principal ─────────────────────────────────────────────────────────

export default function FornecedorCrud() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Fornecedor | undefined>();
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const notify = (msg: string, severity: 'success' | 'error' = 'success') =>
    setToast({ msg, severity });

  useEffect(() => {
    api.list().then(setFornecedores).catch(() => notify('Erro ao carregar fornecedores', 'error')).finally(() => setLoading(false));
  }, []);

  const handleSave = async (form: FornecedorForm, id?: number) => {
    try {
      if (id) {
        const updated = await api.update(id, form);
        setFornecedores((prev) => prev.map((f) => (f.id === id ? updated : f)));
        notify('Fornecedor atualizado!');
      } else {
        const created = await api.create(form);
        setFornecedores((prev) => [created, ...prev]);
        notify('Fornecedor adicionado!');
      }
    } catch {
      notify('Erro ao salvar fornecedor', 'error');
      throw new Error('save failed');
    }
  };

  const openEdit = (f: Fornecedor) => { setEditing(f); setModalOpen(true); };
  const openNew = () => { setEditing(undefined); setModalOpen(true); };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Fornecedores</Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? '...' : `${fornecedores.length} fornecedor${fornecedores.length !== 1 ? 'es' : ''}`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}
          sx={{ display: { xs: 'none', sm: 'flex' } }}>
          Novo
        </Button>
      </Stack>

      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={isDesktop ? 52 : 120} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      ) : fornecedores.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Nenhum fornecedor cadastrado.</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={openNew}>
            Cadastrar primeiro fornecedor
          </Button>
        </Box>
      ) : isDesktop ? (
        <FornecedorTable fornecedores={fornecedores} onEdit={openEdit}/>
      ) : (
        <Stack spacing={2}>
          {fornecedores.map((f) => (
            <FornecedorCard key={f.id} fornecedor={f} onEdit={openEdit}/>
          ))}
        </Stack>
      )}

      <Fab
        color="primary"
        onClick={openNew}
        sx={{ position: 'fixed', bottom: 24, right: 24, display: { xs: 'flex', sm: 'none' } }}
      >
        <AddIcon />
      </Fab>

      <FornecedorModal open={modalOpen} initial={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast?.severity} onClose={() => setToast(null)} sx={{ width: '100%' }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}