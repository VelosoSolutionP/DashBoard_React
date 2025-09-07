import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { Usuario } from "../services/userService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Usuario) => void;
  initialData: Usuario | null;
}

const UserFormDialog: React.FC<Props> = ({ open, onClose, onSave, initialData }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    usuario: "",
    senha: "",
  });

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || "");
      setEmail(initialData.email || "");
      setUsuario(initialData.usuario || "");
      setSenha(""); // não pré-preenche senha
    } else {
      setNome("");
      setEmail("");
      setUsuario("");
      setSenha("");
    }
    setErrors({ nome: "", email: "", usuario: "", senha: "" });
  }, [initialData, open]);

  const validate = () => {
    let valid = true;
    const newErrors = { nome: "", email: "", usuario: "", senha: "" };

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
      valid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }
    if (!usuario.trim()) {
      newErrors.usuario = "Usuário é obrigatório";
      valid = false;
    }
    // só valida senha se for criação (sem ID)
    if (!initialData?.id && !senha.trim()) {
      newErrors.senha = "Senha é obrigatória";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      id: initialData?.id || 0,
      nome,
      email,
      usuario,
      senha: senha || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={!!errors.nome}
          helperText={errors.nome}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="dense"
          label="Usuário"
          fullWidth
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          error={!!errors.usuario}
          helperText={errors.usuario}
        />
        <TextField
          margin="dense"
          label="Senha"
          type="password"
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={!!errors.senha}
          helperText={errors.senha || (initialData ? "Deixe vazio para não alterar" : "")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? "Salvar Alterações" : "Criar Usuário"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;