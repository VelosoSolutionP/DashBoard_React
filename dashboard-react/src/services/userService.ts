import axios from "axios";
export interface Usuario {
  id: number;       
  nome: string;
  email: string;
  usuario?: string; 
}

interface EmbeddedUsuarios {
  usuarios: UsuarioAPI[];
}

interface UsuariosResponse {
  _embedded: EmbeddedUsuarios;
}

// Tipo da API
interface UsuarioAPI {
  id?: number;
  idUsuario?: number;
  nome: string;
  email: string;
  usuario?: string;
  senha?: string;
  _links?: {
    self: { href: string };
  };
}

const api = axios.create({
  baseURL: "http://localhost:8080",
});

const extractIdFromHref = (href: string): number => {
  const parts = href.split("/");
  const idStr = parts[parts.length - 1];
  return Number(idStr);
};

export async function getUsers(): Promise<Usuario[]> {
  try {
    const response = await api.get<UsuariosResponse>("/usuarios");
    const usuariosAPI = response.data._embedded?.usuarios || [];

    const usuarios: Usuario[] = usuariosAPI.map(u => ({
      id: u.id || u.idUsuario || (u._links?.self?.href ? extractIdFromHref(u._links.self.href) : 0),
      nome: u.nome,
      email: u.email,
      usuario: u.usuario,
    }));

    return usuarios;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

export const createUser = async (usuario: Omit<Usuario, "id">): Promise<Usuario> => {
  const response = await api.post<Usuario>("/usuarios", usuario);
  return response.data;
};

export const updateUser = async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
  const response = await api.put<Usuario>(`/usuarios/${id}`, usuario);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`);
};