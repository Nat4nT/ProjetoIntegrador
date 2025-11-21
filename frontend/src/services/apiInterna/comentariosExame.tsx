import { api, handleApi } from "../api";

// CRIAR COMENTÁRIO
export function criarComentario(payload: any): Promise<any> {
  return handleApi(api.post("/exames/criar-comentario", payload));
}
