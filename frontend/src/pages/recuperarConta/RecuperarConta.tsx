import { useState } from "react";
import { Form, Input, Button } from "antd";

import { showMessage } from "../../components/messageHelper/ShowMessage";
import { padraoDeSenha } from "../../utils/Masks";
import { useNavigate } from "react-router-dom";

import "./RecuperarConta.scss";

export default function RecuperarConta() {
  const [novaSenha, setNovaSenha] = useState("");
  const [secondNovaSenha, setSecondNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [codigoValidado, setCodigoValidado] = useState(false);
  const [loadingCodigo, setLoadingCodigo] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // VALIDAR CÓDIGO E-MAIL
  const handleValidarCodigo = async () => {
    const codigo = form.getFieldValue("codigo");

    if (!codigo) {
      showMessage("Informe o código enviado para seu e-mail.", "warning");
      return;
    }

    try {
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

  const handleAlterarSenha = async (values: any) => {
    if (!codigoValidado) {
      showMessage("Valide o código antes de alterar a senha.", "warning");
      return;
    }

    setLoading(true);
    try {
      console.log("Nova senha:", values.novaSenha);

      showMessage("Senha alterada com sucesso!", "success");

      navigate("/");
    } catch (error) {
      showMessage("Erro ao alterar senha.", "error");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {

  };

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
              maxLength={6}
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
              hidden={!codigoValidado}
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
              hidden={!codigoValidado}
              disabled={!codigoValidado}
            />
          </Form.Item>

          <div className="container-button-alterar-conta">
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
          </div>
        </Form>
      </div>
    </div>
  );
}
