import { api, handleApi } from "../api";

// BUSCAR CATEGORIAS
export function buscarCategoria(): Promise<any> {
  return handleApi(api.get("/categoria"));
}

// ADICIONAR CATEGORIA
export function adicionarCategoria(payload: any): Promise<any> {
  return handleApi(api.post("/categoria", payload));
}

// ADICIONAR CATEGORIA
export function deletarCategoria(payload: any): Promise<any> {
  return handleApi(api.post("/categoria/deletar", payload));
}

// ADICIONAR CATEGORIA
export function editarCategoria(payload: any): Promise<any> {
  return handleApi(api.post("/categoria/editar", payload));
}
