import { api, handleApi } from "../api";

// CRIAR COMENTÁRIO
export function criarComentario(payload: any): Promise<any> {
  return handleApi(api.post("/exames/criar-comentario", payload));
}

// DELETAR COMENTÁRIO
export function deletarComentario(payload: any): Promise<any> {
  return handleApi(api.post("/exames/deletar-comentario", payload));
}

// EDITAR COMENTÁRIO
export function editarComentario(payload: any): Promise<any> {
  return handleApi(api.post("/exames/editar-comentario", payload));
}
