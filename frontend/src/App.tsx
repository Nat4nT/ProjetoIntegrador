import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";

//telas
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Perfil from "./pages/perfil/Perfil";
import AppLayout from "./components/layoutPadrao/AppLayout";
import PrivateRoute from "./utils/PrivateRoute";
import SeusExamesPage from "./pages/exames/seusExames/SeusExames";

//config data para português
import ptBR from "antd/es/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Medicos from "./pages/medicosComAcesso/Medicos";
import CadastrarExames from "./pages/exames/cadastrarExames/CadastrarExames";
import MeusPacientes from "./pages/usuarioMedico/meusPacientes/MeusPacientes";
import BuscarPaciente from "./pages/usuarioMedico/buscarPaciente/BuscarPaciente";
import RecuperarSenha from "./pages/recuperarSenha/RecuperarSenhaScreen";
import RecuperarConta from "./pages/recuperarConta/RecuperarConta";

dayjs.locale("pt-br");

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <Router>
        <Routes>
          {/* pública */}
          <Route path="/" element={<Login />} />
          <Route path="/recuperar/senha" element={<RecuperarSenha />} />
          <Route path="/recuperar/conta" element={<RecuperarConta />} />

          {/* protegidas */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/exames/seusExames" element={<SeusExamesPage />} />
              <Route
                path="/exames/paciente"
                element={<SeusExamesPage />}
              />
              <Route path="/exames/cadastrar" element={<CadastrarExames />} />
              <Route path="/medicos" element={<Medicos />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/meus/pacientes" element={<MeusPacientes />} />
              <Route path="/buscar/paciente" element={<BuscarPaciente />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
