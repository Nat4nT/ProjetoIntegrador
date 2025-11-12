import { api, handleApi } from "../api";

export function verificarSolicitacoes(): Promise<any> {
  return handleApi(api.get("/minha-conta/solicitacoes"));
}

export function aprovarSolicitacao(payload: any): Promise<any> {
  return handleApi(api.post("/minha-conta/solicitacoes/aprovar", payload));
}

export function recusarSolicitacao(payload: any): Promise<any> {
  return handleApi(api.post("/minha-conta/solicitacoes/negar", payload));
}
