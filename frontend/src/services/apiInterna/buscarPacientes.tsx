import { api, handleApi } from "../api";

// BUSCAR PACIENTES PELO CPF
export function buscarPaciente(payload: any): Promise<any> {
  return handleApi(api.post("/medico/buscar", payload));
}

// SOLICITAR ACESSO PARA O PACIENTE
export function solicitarAcesso(payload: any): Promise<any> {
  return handleApi(api.post("/medico/solicitar-acesso", payload));
}

// BUSCAR EXAMES DO PACIENTE
export function buscarExamesPaciente(payload: any): Promise<any> {
  return handleApi(api.post("/medico/buscar-exames", payload));
}

// BUSCAR CATEGOREIAS DO PACIENTE
export function buscarCategoriasPaciente(payload: any): Promise<any> {
  return handleApi(api.post("/medico/buscar-categorias", payload));
}

// BUSCAR PACIENTES APÓS SOLICITADO
export function buscarPacientes(): Promise<any> {
  return handleApi(api.get("/medico/pacientes"));
}
