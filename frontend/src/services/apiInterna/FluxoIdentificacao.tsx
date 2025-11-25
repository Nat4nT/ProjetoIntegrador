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

// MEU PERFIL
export function condicoes(): Promise<any> {
  return handleApi(api.get("/condicoes"));
}

// EDITAR DADOS CADASTRAIS
export function editarUsuario(payload: any): Promise<any> {
  return handleApi(api.post("/minha-conta", payload));
}

// DESATIVAR CONTA
export function desativarConta(): Promise<any> {
  return handleApi(api.post("/minha-conta/deletar"));
}

// ALTERAR SENHA
export function alterarSenha(payload: any): Promise<any> {
  return handleApi(api.post("/minha-conta/alterar-senha", payload));
}

// ALTERAR SENHA
export function recuperarSenha(payload: any, token: string) {
  return api.post("/minha-conta/alterar-senha", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// RECUPERAR CONTA
export function recuperarConta(payload: any): Promise<any> {
  return handleApi(api.post("/recuperar-conta", payload));
}

// REATIVAR CONTA
export function reativarConta(payload: any): Promise<any> {
  return handleApi(api.post("/reativar-conta", payload));
}


// VERIFICAR CODIGO
export function verificarCodigo(payload: any): Promise<any> {
  return handleApi(api.post("/verificar-codigo", payload));
}
