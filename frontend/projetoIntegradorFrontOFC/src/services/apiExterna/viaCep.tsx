import axios from "axios";
import type { ViaCepAddress } from "../interfaces/Interfaces";

export async function getAddressByCep(cepInput: string) {
  const cep = (cepInput || "").replace(/\D/g, "");
  if (cep.length !== 8) throw new Error("CEP inválido. Informe 8 dígitos.");

  const { data } = await axios.get<ViaCepAddress>(
    `https://viacep.com.br/ws/${cep}/json/`
  );

  if (data.erro) throw new Error("CEP não encontrado.");
  return data;
}


