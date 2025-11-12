export const StatusAcesso = {
  PENDENTE: "PENDENTE",
  APROVADO: "APROVADO",
  REVOGADO: "REVOGADO",
} as const;

export type StatusAcesso = (typeof StatusAcesso)[keyof typeof StatusAcesso];
