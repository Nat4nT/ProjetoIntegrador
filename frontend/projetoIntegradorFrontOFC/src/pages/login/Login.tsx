import { useState } from "react";

// antd
import { Form, Input, Button } from "antd";

// rotas
import { useNavigate } from "react-router-dom";

// apis
import { loginUsuario } from "../../services/apiInterna/FluxoIdentificacao";

// modals
import CadastroModal from "../../components/modals/cadastro/ModalCadastro";
import RecuperarSenha from "../../components/modals/recuperarSenha/RecuperarSenha";

import "antd/dist/reset.css";
import "./Login.scss";
import { showMessage } from "../../components/messageHelper/ShowMessage";

function Login() {
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [isRecuperarOpen, setIsRecuperarOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);

  const navigate = useNavigate();

  // FUNÇÃO PARA LOGAR
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLogin) {
      showMessage("Informe seu e-mail.", "warning");
      return;
    }
    if (!userPassword) {
      showMessage("Informe sua senha.", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUsuario({
        email: userLogin,
        senha: userPassword,
      });

      if (response.data?.token) {
        const primeiroNome = response.data.firstname;
        const ultimoNome = response.data.lastname;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("primeiroNomeUsuario", primeiroNome);
        localStorage.setItem("ultimoNomeUsuario", ultimoNome);
        showMessage("Login realizado com sucesso!", "success");
        navigate("/home", { replace: true });
      } else {
        showMessage("Login inválido", "error");
      }
    } catch (error: any) {
      const msg = error?.message || "Erro ao fazer login.";
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="container-title-up-login">
          <div className="title-up-login">
            <span className="primera-palavra">Med</span>
            <span className="segunda-palavra">Exame</span>
          </div>
          <div>
            <p className="frase-title-up-login">
              Cuidando da sua saúde com praticidade
            </p>
          </div>
        </div>

        <div className="container-login">
          <h1>Login</h1>

          <Form
            className="login-form"
            layout="vertical"
            onSubmitCapture={handleSubmit}
          >
            <input
              type="text"
              name="username"
              autoComplete="username"
              style={{ display: "none" }}
            />
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              style={{ display: "none" }}
            />
            <Form.Item label="Login" name="email">
              <Input
                type="email"
                value={userLogin}
                onChange={(e) => setUserLogin(e.target.value)}
                placeholder="exemplo@email.com"
                size="large"
              />
            </Form.Item>

            <Form.Item label="Senha" name="senha">
              <Input.Password
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                name="loginSecret"
                autoComplete="new-password"
                placeholder="Digite sua senha"
                size="large"
              />
            </Form.Item>

            <Button
              className="login-button"
              loading={loading}
              htmlType="submit"
              type="primary"
              size="large"
              block
              style={{ marginTop: 30 }}
            >
              Entrar
            </Button>

            <Button
              className="criar-conta-button"
              disabled={loading}
              onClick={() => setIsCadastroOpen(true)}
              type="default"
              size="large"
              block
            >
              Criar conta
            </Button>

            <div className="container-esqueceu-senha">
              <p>Esqueceu a senha?</p>
              <Button
                className="esqueceu-senha-button"
                type="link"
                onClick={() => setIsRecuperarOpen(true)}
              >
                Clique aqui
              </Button>
            </div>
          </Form>
          <CadastroModal
            open={isCadastroOpen}
            onClose={() => setIsCadastroOpen(false)}
          />
          <RecuperarSenha
            open={isRecuperarOpen}
            onClose={() => setIsRecuperarOpen(false)}
          />
        </div>
      </div>
    </>
  );
}

export default Login;
