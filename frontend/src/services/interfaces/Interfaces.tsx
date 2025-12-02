//CADASTRO

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export interface CadastroResponse {
  code: number;
  message: string;
  data?: {
    token: string;
  };
}

//LOGIN

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  message?: string;
  data?: {
    token: string;
    firstname: string;
    lastname: string;
    user_photo: string;
  };
  code?: number;
}

// EXAME
export interface AdicionarExamePayload {
  nome_exame: string;
  data_realizacao: string;
  nome_lab: string;
  categorias: string[];
  arquivo_exame: File;
}

//CATEGORIAS

export interface Categoria {}

export interface ComentarioExame {
  comentario_exame_id: number;
  exame_id: number;
  usuario_id: number | null;
  comentario: string;
  data_criacao?: string;
  data_atualizacao: string;
  primeiro_nome?: string;
  ultimo_nome?: string;
  imagem_perfil: string;
}

export type ExameRow = {
  key: string;
  exame: string;
  categoria: string;
  dataRealizacao: string;
  local: string;
  url?: string;
  categoriaId: number;
  rawDate: string;
  comentarios?: ComentarioExame[];
};

export type PacienteRow = {
  key: number;
  status?: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  rawDate?: string;
  autorizadoEm?: string;
  solicitacao_id: number;
};

export type SolicitacaoRow = {
  key: string;
  nome: string;
  especialidade: string[] | string;
  especialidadeModal: string[] | string;
  crm: string;
  dataPedido: string;
  rawDate: string;
  status: string;
  solcitacao_id?: number;
  imagem_perfil: string;
};

export type SolicitacaoAcesso = {
  id: number;
  medico: string;
  especialidade: string[] | string;
  data_pedido: string;
  crm: string;
  status: string;
  imagem_perfil: string;
};
