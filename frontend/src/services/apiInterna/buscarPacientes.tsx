import { api, handleApi } from "../api";

export function buscarPaciente(payload: any): Promise<any> {
  return handleApi(api.post("/medico/buscar", payload));
}

export function solicitarAcesso(payload: any): Promise<any> {
  return handleApi(api.post("/medico/solicitar-acesso", payload));
}
