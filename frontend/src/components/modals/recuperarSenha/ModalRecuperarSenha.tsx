import { useState } from "react";
import { Modal, Input, Button, Form } from "antd";

import "./ModalRecuperarSenha.scss";
import { emailRegex } from "../../../utils/Masks";
import { recuperarConta } from "../../../services/apiInterna/FluxoIdentificacao";
import { showMessage } from "../../messageHelper/ShowMessage";
import { useNavigate } from "react-router-dom";

type RecuperarSenhaProps = {
  open: boolean;
  fluxoContaInativa: boolean;
  titulo: string;
  descricao: string;
  onClose: () => void;
  onBackToLogin?: () => void;
};

export default function RecuperarSenha({
  open,
  fluxoContaInativa,
  titulo,
  descricao,
  onClose,
  onBackToLogin,
}: RecuperarSenhaProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEnviar = async (values: any) => {
    setLoading(true);

    const payload = { email: values.email };

    try {
      await recuperarConta(payload);

      showMessage("Código enviado para o seu e-mail", "success");

      if (fluxoContaInativa == true) {
        navigate("/recuperar/conta", {
          state: { email: values.email, recuperarSenha: true },
        });
      } else {
        navigate("/recuperar/senha", {
          state: { email: values.email, recuperarSenha: true },
        });
      }

      onClose();
    } catch (err: any) {
      showMessage(err.message || "Usuário não encontrado", "error");
    }

    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={620}
      maskClosable={false}
      title={null}
      rootClassName="recuperar-senha-modal"
      styles={{
        content: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      <div className="rs-header">
        <h2>{titulo}</h2>
        <p>{descricao}</p>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleEnviar}
        className="rs-form"
      >
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: "Por favor, informe seu e-mail." },
            {
              pattern: emailRegex,
              message: "Informe um e-mail válido.",
            },
          ]}
        >
          <Input
            type="email"
            placeholder="Ex: exemplo.teste@email.com"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            className="rs-submit"
            htmlType="submit"
            loading={loading}
            block
          >
            Enviar
          </Button>
        </Form.Item>

        <button
          type="button"
          className="rs-back-link"
          onClick={onBackToLogin ?? onClose}
        >
          Voltar para o login
        </button>
      </Form>
    </Modal>
  );
}
