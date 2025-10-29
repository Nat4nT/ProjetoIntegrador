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
  };
  code?: number;
}

// SALVAR DADOS
