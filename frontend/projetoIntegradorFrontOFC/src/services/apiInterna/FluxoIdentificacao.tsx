import { api, handleApi } from "../api";
import type {
  CadastroResponse,
  LoginPayload,
  LoginResponse,
} from "../interfaces/Interfaces";

// CADASTRO
export function cadastrarUsuario(payload: any): Promise<CadastroResponse> {
  return handleApi(api.post<CadastroResponse>("/registrar", payload));
}

// LOGIN
export function loginUsuario(payload: LoginPayload): Promise<LoginResponse> {
  return handleApi(api.post<LoginResponse>("/login", payload));
}

// MEU PERFIL

export function dadosUsuario(): Promise<any> {
  return handleApi(api.get("/minha-conta"));
}

// EDITAR DADOS CADASTRAIS

export function editarUsuario(payload: any): Promise<any> {
  return handleApi(api.post("/minha-conta", payload));
}

// DESATIVAR CONTA

export function desativarConta(): Promise<any> {
  return handleApi(api.post("/minha-conta/deletar"));
}
