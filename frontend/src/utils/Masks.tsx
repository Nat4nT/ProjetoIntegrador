export const onlyDigits = (v: string) => (v || "").replace(/\D+/g, "");

//RN01
export const padraoDeSenha =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.replace(/(\d{3})(\d+)/, "$1.$2");
  if (d.length <= 9) return d.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
}

export function maskPhoneBR(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return d.replace(/(\d{2})(\d+)/, "($1) $2");
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

export const maskCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  return d.length <= 5 ? d : d.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};

export function validateCPF(cpfRaw: string) {
  const cpf = onlyDigits(cpfRaw);
  if (cpf.length !== 11 || /(\d)\1{10}/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  if (rev !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  return rev === parseInt(cpf[10]);
}

export function maskAltura(v: string) {
  let d = onlyDigits(v).slice(0, 3); // até 3 dígitos (210 -> 2.10)
  if (!d) return "";

  if (d.length === 1) return d; // "1"
  if (d.length === 2) return `${d[0]}.${d[1]}`; // "17" -> "1.7"

  // length === 3
  return `${d[0]}.${d.slice(1)}`; // "190" -> "1.90"
}

export function maskCRM(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6); // só números, máximo 6 dígitos
}
