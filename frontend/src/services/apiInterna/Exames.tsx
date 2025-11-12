import { api, handleApi } from "../api";
import type { AdicionarExamePayload } from "../interfaces/Interfaces";

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

  // arquivo
  if (payload.arquivo_exame) {
    formData.append(
      "arquivo_exame",
      payload.arquivo_exame,
      payload.arquivo_exame.name
    );
  }

  return handleApi(api.post("/exames/adicionar", formData));
}

export function buscarExames(): Promise<any> {
  return handleApi(api.get("/exames"));
}

export function deletarExame(payload: any): Promise<any> {
  return handleApi(api.post("/exames/deletar", payload));
}
