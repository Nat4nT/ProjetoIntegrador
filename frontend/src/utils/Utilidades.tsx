export const parseMaybeJsonArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        return JSON.parse(s);
      } catch {
        return [];
      }
    }
  }
  return [];
};

//RN02 VALIDAÇÃO DE CPF VÁLIDO
export function isValidCPF(cpfRaw: string): boolean {
  if (!cpfRaw) return false;
  const cpf = cpfRaw.replace(/\D/g, "");

  // 11 dígitos e não pode ser sequência repetida (000..., 111..., etc.)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  // cálculo do 1º dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i], 10) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9], 10)) return false;

  // cálculo do 2º dígito
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i], 10) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10], 10)) return false;

  return true;
}

const VALID_DDDS = new Set([
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "21",
  "22",
  "24",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "37",
  "38",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "53",
  "54",
  "55",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "71",
  "73",
  "74",
  "75",
  "77",
  "79",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
]);

export function isValidPhoneBR(
  phoneRaw: string,
  opts: { allowLandline?: boolean } = {}
): boolean {
  if (!phoneRaw) return false;
  const { allowLandline = false } = opts;
  const p = phoneRaw.replace(/\D/g, "");

  // não aceitar tamanho fora do padrão
  if (p.length !== 11 && !(allowLandline && p.length === 10)) return false;

  // rejeita sequências de um único dígito: 000..., 111..., etc.
  if (/^(\d)\1+$/.test(p)) return false;

  const ddd = p.slice(0, 2);
  if (!VALID_DDDS.has(ddd)) return false;

  if (p.length === 11) {
    // CELULAR: 3º dígito obrigatoriamente 9
    if (p[2] !== "9") return false;
    // número não pode começar com 90 00... etc. (evita 99000000000)
    if (/^990+/.test(p.slice(2))) return false;
    return true;
  }

  // TELEFONE FIXO (opcional): 3º dígito 2–5
  if (allowLandline && p.length === 10) {
    return /^[2-5]/.test(p[2]);
  }

  return false;
}

export function isValidCEP(cepRaw: string): boolean {
  if (!cepRaw) return false;
  const cep = cepRaw.replace(/\D/g, "");
  if (cep.length !== 8) return false;
  // rejeita sequências óbvias inválidas (00000000, 11111111, etc.)
  if (/^(\d)\1{7}$/.test(cep)) return false;
  return true;
}
