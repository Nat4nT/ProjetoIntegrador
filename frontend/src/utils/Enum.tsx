export const StatusAcesso = {
  PENDENTE: "PENDENTE",
  APROVADO: "APROVADO",
  REVOGADO: "REVOGADO",
  RECUSADO: "RECUSADO",
} as const;

export type StatusAcesso = (typeof StatusAcesso)[keyof typeof StatusAcesso];
