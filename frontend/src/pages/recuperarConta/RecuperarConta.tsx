import { useState } from "react";
import { Form, Input, Button } from "antd";

import { showMessage } from "../../components/messageHelper/ShowMessage";
import { padraoDeSenha } from "../../utils/Masks";
import { useLocation, useNavigate } from "react-router-dom";

import {
  recuperarSenha,
  verificarCodigo,
} from "../../services/apiInterna/FluxoIdentificacao";

import "./RecuperarConta.scss";

export default function RecuperarConta() {
  const [novaSenha, setNovaSenha] = useState("");
  const [secondNovaSenha, setSecondNovaSenha] = useState("");
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const [token, setToken] = useState("");
  const [codigoEmail, setCodigoEmail] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const emailDoUsuario = location.state?.email ?? "";

  // VALIDAR CÓDIGO E-MAIL
  const handleValidarCodigo = async () => {
    if (!emailDoUsuario) {
      showMessage(
        "Não foi possível identificar o e-mail. Tente iniciar a recuperação novamente.",
        "error"
      );
      return;
    }

    try {
      setLoadingCodigo(true);

      const payload = {
        email: emailDoUsuario,
        validation_code: codigoEmail,
      };

      const response = await verificarCodigo(payload);

      setToken(response.data.token);
      setCodigoValidado(true);
      showMessage("Código validado com sucesso!", "success");
    } catch (error) {
      showMessage("Código inválido ou expirado.", "error");
      setCodigoValidado(false);
    } finally {
      setLoadingCodigo(false);
    }
  };

  const handleAlterarSenha = async (values: any) => {
    if (!codigoValidado) {
      showMessage("Valide o código antes de alterar a senha.", "warning");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nova_senha: values.novaSenha,
        confirmacao_senha: values.confirmarNovaSenha,
      };

      await recuperarSenha(payload as any, token);

      showMessage("Senha alterada com sucesso!", "success");
      navigate("/");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao alterar senha.";
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const onBackToLogin = () => {
    navigate("/");
  };

  const onFinishFailed = () => {};

  return (
    <div className="container">
      <div className="container-title-up-recuperar-conta">
        <div className="title-up-rescuperar-conta">
          <span className="primera-palavra">Med</span>
          <span className="segunda-palavra">Exame</span>
        </div>
        <p className="frase-title-up-recuperar-conta">
          Cuidando da sua saúde com praticidade
        </p>
      </div>

      <div className="container-recuperar-conta">
        <h1>Recuperar conta</h1>

        <div className="recuperar-conta-header">
          <p className="descricao-recuperar-conta">
            Insira o código enviado para o seu e-mail cadastrado e, em seguida,
            defina uma nova senha para recuperar o acesso à sua conta.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAlterarSenha}
          onFinishFailed={onFinishFailed}
          className="form-recupperar-conta"
        >
          <input
            type="password"
            name="hidden-pass"
            autoComplete="new-password"
            style={{ display: "none" }}
          />

          <Form.Item
            label="Código de verificação"
            name="codigo"
            style={{ paddingTop: "10px" }}
            rules={[{ required: true, message: "Digite o código recebido!" }]}
          >
            <Input
              placeholder="Informe o código enviado para seu e-mail"
              onChange={(e: any) => setCodigoEmail(e.target.value)}
              value={codigoEmail}
            />
          </Form.Item>

          <Button
            type="default"
            className="button-validar-codigo"
            block
            onClick={handleValidarCodigo}
            loading={loadingCodigo}
            disabled={codigoValidado}
            style={{ marginBottom: 16 }}
          >
            {codigoValidado ? "Código validado" : "Validar código"}
          </Button>

          <Form.Item
            label="Nova senha"
            name="novaSenha"
            hidden={!codigoValidado}
            style={{ paddingTop: "10px" }}
            rules={[
              { required: true, message: "Digite a nova senha!" },
              {
                pattern: padraoDeSenha,
                message:
                  "A senha deve conter ao menos 8 caracteres, uma letra maiúscula, um número e um símbolo.",
              },
            ]}
          >
            <Input.Password
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              autoComplete="new-password"
              disabled={!codigoValidado}
            />
          </Form.Item>

          <Form.Item
            label="Confirmar nova senha"
            name="confirmarNovaSenha"
            hidden={!codigoValidado}
            style={{ paddingTop: "8px" }}
            rules={[
              { required: true, message: "Confirme a nova senha!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("novaSenha") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não conferem"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirme a nova senha"
              value={secondNovaSenha}
              onChange={(e) => setSecondNovaSenha(e.target.value)}
              autoComplete="new-password"
              disabled={!codigoValidado}
            />
          </Form.Item>

          <div className="container-button-reacuperar-conta">
            <Button
              className="button-recuperar-conta"
              type="primary"
              size="large"
              block
              loading={loading}
              htmlType="submit"
              hidden={!codigoValidado}
              disabled={!codigoValidado}
            >
              Confirmar
            </Button>
            <button
              type="button"
              className="button-voltar-login"
              onClick={onBackToLogin}
            >
              Voltar para o login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
