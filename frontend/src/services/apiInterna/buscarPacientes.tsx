import { api, handleApi } from "../api";

export function buscarPaciente(payload: any): Promise<any> {
  return handleApi(api.post("/medico/buscar", payload));
}

export function solicitarAcesso(payload: any): Promise<any> {
  return handleApi(api.post("/medico/solicitar-acesso", payload));
}

export function buscarExamesPaciente(payload: any): Promise<any> {
  return handleApi(api.post("/medico/buscar-exames", payload));
}

export function buscarCategoriasPaciente(payload: any): Promise<any> {
  return handleApi(api.post("/medico/buscar-categorias", payload));
}

export function buscarPacientes(): Promise<any> {
  return handleApi(api.get("/medico/pacientes"));
}
