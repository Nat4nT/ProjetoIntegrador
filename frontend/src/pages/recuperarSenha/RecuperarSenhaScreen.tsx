import { useState } from "react";
import { Form, Input, Button } from "antd";

import { showMessage } from "../../components/messageHelper/ShowMessage";
import { padraoDeSenha } from "../../utils/Masks";
import { useLocation, useNavigate } from "react-router-dom";

import {
  recuperarSenha,
  verificarCodigo,
} from "../../services/apiInterna/FluxoIdentificacao";

import "./RecuperarSenhaScreen.scss";

export default function RecuperarSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [secondNovaSenha, setSecondNovaSenha] = useState("");
  const [codigoEmail, setCodigoEmail] = useState("");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [loadingCodigo, setLoadingCodigo] = useState(false);

  const location = useLocation();
  const emailDoUsuario = location.state?.email ?? "";
  const navigate = useNavigate();

  const handleAlterarSenha = async () => {
    try {
      setLoading(true);
      const payload = {
        nova_senha: novaSenha,
        confirmacao_senha: secondNovaSenha,
      };
      await recuperarSenha(payload as any, token);
      showMessage("Senha atualizada com sucesso.", "success");
      setNovaSenha("");
      setSecondNovaSenha("");
      navigate("/");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao alterar senha.";
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCodigo = async () => {
    if (!codigoEmail) {
      showMessage("Informe o código enviado para seu e-mail.", "warning");
      return;
    }

    try {
      const payload = {
        email: emailDoUsuario,
        validation_code: codigoEmail,
      };

      const response = await verificarCodigo(payload);

      setToken(response.data.token);
      setLoadingCodigo(true);
      setCodigoValidado(true);
      showMessage("Código validado com sucesso!", "success");
    } catch (error) {
      showMessage("Código inválido ou expirado.", "error");
      setCodigoValidado(false);
    } finally {
      setLoadingCodigo(false);
    }
  };

  const onBackToLogin = () => {
    navigate("/");
  };

  const onFinishFailed = () => {};

  return (
    <div className="container">
      <div className="container-title-up-recuperar-senha">
        <div className="title-up-rescuperar-senha">
          <span className="primera-palavra">Med</span>
          <span className="segunda-palavra">Exame</span>
        </div>
        <p className="frase-title-up-recuperar-senha">
          Cuidando da sua saúde com praticidade
        </p>
      </div>

      <div className="container-recuperar-senha">
        <h1>Alterar senha</h1>

        <div className="recuperar-senha-header">
          <p className="descricao-recuperar-senha">
            Defina sua nova senha abaixo.
          </p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleAlterarSenha}
          onFinishFailed={onFinishFailed}
          className="form-recupperar-senha"
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
              onChange={(e: any) => setCodigoEmail(e.target.value)}
              value={codigoEmail}
              placeholder="Informe o código enviado para seu e-mail"
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
            //RN25 TODOS OS CAMPOS QUE SÃO EXIBIDOS PÓS VERIFICAÇÃO DO CÓDIGO ESTÃO COM A VALIDAÇÃO hidden={!codigoValidado}
            //OU SEJA SE O CÓDIGO AINDA NÃO FOI VALIDADO NÃO EXIBE, O VALOR DA VARIAVEL codigoValidado É SETADO NA LINHA 65.
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
            />
          </Form.Item>

          <div className="container-button-esqueci-senha">
            <Button
              className="button-recuperar-senha"
              type="primary"
              size="large"
              block
              loading={loading}
              htmlType="submit"
              hidden={!codigoValidado}
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
