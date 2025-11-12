import { api, handleApi } from "../api";

export function buscarCategoria(): Promise<any> {
  return handleApi(api.get("/categoria"));
}

export function adicionarCategoria(payload: any): Promise<any> {
  return handleApi(api.post("/categoria", payload));
}
