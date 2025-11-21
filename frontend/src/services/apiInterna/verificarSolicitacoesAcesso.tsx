import { api, handleApi } from "../api";

// VERIFICAR SE TEM SOLICITAÇÕES DE ACESSO AO PERFIL
export function verificarSolicitacoes(): Promise<any> {
  return handleApi(api.get("/minha-conta/solicitacoes"));
}

// APROVAR SOLICITAÇÃO DE ACESSO AO PERFIL
export function aprovarSolicitacao(payload: any): Promise<any> {
  return handleApi(api.post("/minha-conta/solicitacoes/aprovar", payload));
}

// RECUSAR SOLICITAÇÃO DE ACESSO AO PERFIL
export function recusarSolicitacao(payload: any): Promise<any> {
  return handleApi(api.post("/minha-conta/solicitacoes/negar", payload));
}
