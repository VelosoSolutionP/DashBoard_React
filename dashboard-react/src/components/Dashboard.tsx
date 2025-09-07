import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";
import type { Usuario } from "../services/userService";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import UserFormDialog from "../components/UserFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      const mappedUsers = data.map((u, index) => ({
        ...u,
        id: u.id ?? u.idUsuario ?? index + 1,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Erro ao carregar usuários", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (user: Usuario) => {
    setEditing(user);
    setOpenForm(true);
  };

  const handleSave = async (payload: Usuario) => {
    try {
      if (editing && editing.id) {
        const toSend = { ...payload };
        if (!toSend.senha) delete toSend.senha;
        await updateUser(editing.id, toSend);
        setSnack({ open: true, message: "Usuário atualizado", severity: "success" });
      } else {
        await createUser(payload);
        setSnack({ open: true, message: "Usuário criado", severity: "success" });
      }
      setOpenForm(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.status === 409
          ? "Usuário já existe"
          : "Erro ao salvar usuário";
      setSnack({ open: true, message, severity: "error" });
    }
  };

  const handleDeleteConfirm = (id: number) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteUser(toDeleteId);
      setSnack({ open: true, message: "Usuário excluído", severity: "success" });
      setConfirmOpen(false);
      setToDeleteId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Erro ao excluir", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2}>
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Usuários
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}>
            Novo
          </Button>
        </Toolbar>

        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={60}>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Usuário</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.nome}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.usuario}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(u)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteConfirm(u.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      <UserFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        initialData={editing}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        content="Deseja realmente excluir este usuário?"
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;