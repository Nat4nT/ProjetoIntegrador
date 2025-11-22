import { useState } from "react";
import { Form, Input, Button } from "antd";

import { showMessage } from "../../components/messageHelper/ShowMessage";
import { padraoDeSenha } from "../../utils/Masks";
import { useNavigate } from "react-router-dom";

import "./RecuperarSenha.scss";

export default function RecuperarSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [secondNovaSenha, setSecondNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAlterarSenha = async (values: any) => {
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
            label="Nova senha"
            name="novaSenha"
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

          <div className="container-button-alterar-senha">
            <Button
              className="button-recuperar-senha"
              type="primary"
              size="large"
              block
              loading={loading}
              htmlType="submit"
            >
              Confirmar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
