import { useState } from "react";

//componentes antd
import { Modal, Button, Form, Input } from "antd";

//api
import { adicionarCategoria } from "../../../services/apiInterna/Categorias";

//componentes de mensagem
import { showMessage } from "../../messageHelper/ShowMessage";

import "./CadastrarCategoria.scss";

type CadastrarCategoriaProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CadastrarCategoria({
  open,
  onClose,
  onSuccess,
}: CadastrarCategoriaProps) {
  const [loading, setLoading] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");

  // FUNÇÃO PARA CADASTRAR CATEGORIA
  const handleCadastrarCategoria = async () => {
    if (!nomeCategoria.trim()) {
      showMessage("Digite o nome da categoria antes de cadastrar.", "warning");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        nome: nomeCategoria,
      };
      await adicionarCategoria(payload as any);
      showMessage("Categoria adicionada com sucesso.", "success");
      setNomeCategoria("");
      onSuccess?.();
      onClose();
    } catch {
      showMessage("Erro ao adicionar categoria.", "error");
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
      rootClassName="desativar-conta-modal"
      styles={{
        content: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      <div className="dc-header">
        <h2>Cadastrar Categoria</h2>
        <p>Informe o nome da nova categoria que deseja adicionar ao sistema.</p>
      </div>

      <Form layout="vertical">
        <Form.Item
          label="Nome da categoria"
          name="nomeCategoria"
          rules={[{ required: true, message: "Digite o nome da categoria!" }]}
        >
          <Input
            placeholder="Ex: Hemograma, Ultrassonografia..."
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
          />
        </Form.Item>
      </Form>

      <div className="container-button-cadastrar">
        <Button
          className="button-cadastrar-categoria"
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleCadastrarCategoria}
        >
          Cadastrar
        </Button>

        <Button size="large" block onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
