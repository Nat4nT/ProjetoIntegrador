import {
  HomeOutlined,
  IdcardOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const ESTADOS_BR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export const GENEROS = [
  { label: "Masculino", value: 1 },
  { label: "Feminino", value: 2 },
  { label: "Outro", value: 3 },
  { label: "Prefiro não informar", value: 4 },
];

export const TIPOS_SANGUINEOS = [
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
]; 

export const ESPECIALIDADES_MEDICAS = [
  "Alergia e Imunologia",
  "Anestesiologia",
  "Angiologia",
  "Cancerologia",
  "Cardiologia",
  "Cirurgia Cardiovascular",
  "Cirurgia da Mão",
  "Cirurgia de Cabeça e Pescoço",
  "Cirurgia do Aparelho Digestivo",
  "Cirurgia Geral",
  "Cirurgia Pediátrica",
  "Cirurgia Plástica",
  "Cirurgia Torácica",
  "Cirurgia Vascular",
  "Clínica Médica",
  "Coloproctologia",
  "Dermatologia",
  "Endocrinologia e Metabologia",
  "Endoscopia",
  "Gastroenterologia",
  "Genética Médica",
  "Geriatria",
  "Ginecologia e Obstetrícia",
  "Hematologia e Hemoterapia",
  "Homeopatia",
  "Infectologia",
  "Mastologia",
  "Medicina de Emergência",
  "Medicina de Família e Comunidade",
  "Medicina do Trabalho",
  "Medicina Esportiva",
  "Medicina Física e Reabilitação",
  "Medicina Intensiva",
  "Medicina Legal e Perícia Médica",
  "Medicina Nuclear",
  "Medicina Preventiva e Social",
  "Nefrologia",
  "Neurocirurgia",
  "Neurologia",
  "Nutrologia",
  "Oftalmologia",
  "Ortopedia e Traumatologia",
  "Otorrinolaringologia",
  "Patologia",
  "Patologia Clínica/Medicina Laboratorial",
  "Pediatria",
  "Pneumologia",
  "Psiquiatria",
  "Radiologia e Diagnóstico por Imagem",
  "Radioterapia",
  "Reumatologia",
  "Urologia",
];


// OPÇÕES MENU LATERAL PACIENTE NO LAYOUT PADRÃO
export const itemsUsuarioPaciente = [
  { key: "/home", icon: <HomeOutlined />, label: "Home" },
  {
    key: "exames",
    icon: <IdcardOutlined />,
    label: "Exames",
    children: [
      { key: "/exames/seusExames", label: "Seus Exames" },
      { key: "/exames/cadastrar", label: "Cadastrar Exames" },
    ],
  },
  {
    key: "/medicos",
    icon: <SolutionOutlined />,
    label: "Médicos com acesso",
  },
  { key: "/perfil", icon: <UserOutlined />, label: "Perfil" },
];

// OPÇÕES MENU LATERAL MEDICO NO LAYOUT PADRÃO
export const itemsUsuarioMedico = [
  { key: "/home", icon: <HomeOutlined />, label: "Home" },
  {
    key: "pacientes",
    icon: <IdcardOutlined />,
    label: "pacientes",
    children: [
      { key: "/meus/pacientes", label: "Meus Pacientes" },
      { key: "/buscar/paciente", label: "Buscar Paciente" },
    ],
  },
  { key: "/perfil", icon: <UserOutlined />, label: "Perfil" },
];

export const PAGES = [
  {
    path: "/home",
    label: "Home",
    keywords: ["home", "início", "inicio", "dashboard"],
  },
  {
    path: "/exames/seusExames",
    label: "Seus Exames",
    keywords: [
      "exames",
      "seus exames",
      "meus exames",
      "lista de exames",
      "exames paciente",
    ],
  },
  {
    path: "/exames/cadastrar",
    label: "Cadastrar Exames",
    keywords: ["cadastrar exame", "novo exame", "upload exame", "enviar exame"],
  },
  {
    path: "/medicos",
    label: "Médicos com acesso",
    keywords: ["médicos", "medicos", "acesso médicos", "medicos com acesso"],
  },
  {
    path: "/meus/pacientes",
    label: "Meus Pacientes",
    keywords: ["meus pacientes", "pacientes", "lista pacientes"],
  },
  {
    path: "/buscar/paciente",
    label: "Buscar Paciente",
    keywords: [
      "buscar paciente",
      "buscar pacientes",
      "pesquisar paciente",
      "procurar paciente",
    ],
  },
  {
    path: "/perfil",
    label: "Perfil",
    keywords: ["perfil", "meu perfil", "conta", "configurações"],
  },
];
