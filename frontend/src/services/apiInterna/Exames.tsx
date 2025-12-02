import { api, handleApi } from "../api";
import type { AdicionarExamePayload, EditarExamePayload } from "../interfaces/Interfaces";

// FORMDATA PARA CADASTAR EXAME
export function adicionarExame(payload: AdicionarExamePayload): Promise<any> {
  const formData = new FormData();
  formData.append("nome_exame", payload.nome_exame);
  formData.append("data_realizacao", payload.data_realizacao);
  formData.append("nome_lab", payload.nome_lab);

  const categorias = Array.isArray(payload.categorias)
    ? payload.categorias
    : payload.categorias
    ? [payload.categorias as unknown as string]
    : [];

  categorias.forEach((c) => formData.append("categorias[]", c));

  if (payload.arquivo_exame) {
    formData.append(
      "arquivo_exame",
      payload.arquivo_exame,
      payload.arquivo_exame.name
    );
  }

  return handleApi(api.post("/exames/adicionar", formData));
}

// FORMDATA PARA EDITAR EXAME
export function editarExame(payload: EditarExamePayload): Promise<any> {
  const formData = new FormData();

  formData.append("exame_id", String(payload.exame_id));
  formData.append("nome_exame", payload.nome_exame);
  formData.append("data_realizacao", payload.data_realizacao);
  formData.append("nome_lab", payload.nome_lab);

  const categorias = Array.isArray(payload.categorias)
    ? payload.categorias
    : payload.categorias
    ? [payload.categorias as unknown as string]
    : [];

  categorias.forEach((c) => formData.append("categorias[]", c));

  if (payload.arquivo_exame) {
    formData.append(
      "arquivo_exame",
      payload.arquivo_exame,
      payload.arquivo_exame.name
    );
  }

  return handleApi(api.post("/exames/editar", formData));
}

// BUSCAR EXAMES
export function buscarExames(): Promise<any> {
  return handleApi(api.get("/exames"));
}

// BUSCAR EXAMES
export function buscarExame(payload: any): Promise<any> {
  return handleApi(api.post("/exames/buscar-exame", payload));
}

// DELETAR EXAME
export function deletarExame(payload: any): Promise<any> {
  return handleApi(api.post("/exames/deletar", payload));
}
