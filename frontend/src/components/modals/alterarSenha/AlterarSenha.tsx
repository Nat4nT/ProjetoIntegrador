import { useState } from "react";

//componentes antd
import { Modal, Button, Form, Input } from "antd";

//api
import { alterarSenha } from "../../../services/apiInterna/FluxoIdentificacao";

//componentes de mensagem
import { showMessage } from "../../messageHelper/ShowMessage";

import "./AlterarSenha.scss";

type AlterarSenhaProps = {
  open: boolean;
  onClose: () => void;
};

export default function AlterarSenha({ open, onClose }: AlterarSenhaProps) {
  const [loading, setLoading] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [secondNovaSenha, setSecondNovaSenha] = useState("");

  // FUNÇÃO PARA CADASTRAR CATEGORIA
  const handleAlterarSenha = async () => {
    try {
      setLoading(true);
      const payload = {
        senha: senhaAtual,
        "nova-senha": novaSenha,
        "confirmacao-senha": secondNovaSenha,
      };
      await alterarSenha(payload as any);
      showMessage("Senha atualizada com sucesso.", "success");
      setSenhaAtual("");
      setNovaSenha("");
      setSecondNovaSenha("");
      onClose();
    } catch {
      showMessage("Erro ao alterar senha.", "error");
    } finally {
      setLoading(false);
    }
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
      rootClassName="alterar-senha-modal"
      styles={{
        content: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      <div className="alterar-senha-header">
        <h2>Alterar senha</h2>
        <p>Preencha os campos abaixo para realizar a alteração da sua senha.</p>
      </div>

      <Form layout="vertical">
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          style={{ display: "none" }}
        />

        <Form.Item
          label="Senha atual"
          name="senhaAtual"
          rules={[{ required: true, message: "Digite sua senha atual!" }]}
        >
          <Input.Password
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          label="Nova senha"
          name="novaSenha"
          rules={[{ required: true, message: "Digite a nova senha!" }]}
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
          rules={[{ required: true, message: "Confirme a nova senha!" }]}
        >
          <Input.Password
            placeholder="confirme a nova senha"
            value={secondNovaSenha}
            onChange={(e) => setSecondNovaSenha(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Item>
      </Form>

      <div className="container-button-alterar-senha">
        <Button
          className="button-alterar-senha"
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleAlterarSenha}
        >
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
