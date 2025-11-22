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

// Sugeridos (saúde)
export const SUG_DOENCAS = [
  "Hipertensão arterial",
  "Diabetes mellitus tipo 2",
  "Asma",
  "DPOC (doença pulmonar obstrutiva crônica)",
  "Doença cardíaca isquêmica",
  "Insuficiência cardíaca",
  "Dislipidemia (colesterol alto)",
  "Hipotireoidismo",
  "Artrite/Artrose (osteoartrite)",
  "Enxaqueca",
  "Doença renal crônica",
  "Depressão",
  "Transtorno de ansiedade",
  "Apneia do sono",
];

export const SUG_ALERGIAS = [
  "Penicilina",
  "Amoxicilina",
  "Cefalosporinas",
  "Dipirona (metamizol)",
  "AAS (aspirina)",
  "Ibuprofeno",
  "AINEs (anti-inflamatórios)",
  "Iodo / contraste iodado",
  "Látex",
  "Frutos do mar / mariscos",
  "Amendoim",
  "Proteína do leite",
  "Ovo",
  "Picada de inseto",
];

export const SUG_MEDICACAO = [
  "Losartana 50 mg",
  "Enalapril 10 mg",
  "Hidroclorotiazida 25 mg",
  "Metformina 850 mg",
  "Insulina NPH",
  "Atorvastatina 20 mg",
  "Sinvastatina 20 mg",
  "Levotiroxina 50 mcg",
  "Omeprazol 20 mg",
  "Sertralina 50 mg",
  "Fluoxetina 20 mg",
  "Paracetamol 750 mg",
  "Dipirona 500 mg",
  "Ibuprofeno 400 mg",
  "Loratadina 10 mg",
  "Cetirizina 10 mg",
  "Salbutamol (spray)",
  "Budesonida (inalatório)",
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
