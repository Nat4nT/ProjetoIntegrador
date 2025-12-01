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

// EDITAR DADOS CADASTRAIS (em form-data)
export function editarUsuario(
  payload: any,
  avatarFile?: File | null
): Promise<any> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Como foi mudado para form-data, essa condição serve para mandar endereço como array.
    if (
      key === "endereco" &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      Object.entries(value as Record<string, any>).forEach(([campo, v]) => {
        if (v !== null && v !== undefined) {
          formData.append(`endereco[${campo}]`, String(v));
        }
      });
      return;
    }

    // mesmo cenário do de cima
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item));
      });
      return;
    }

    formData.append(key, String(value));
  });

  if (avatarFile) {
    formData.append("imagem_perfil", avatarFile);
  }

  return handleApi(
    api.post("/minha-conta", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
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
