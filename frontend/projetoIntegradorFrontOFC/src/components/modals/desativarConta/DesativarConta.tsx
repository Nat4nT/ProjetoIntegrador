import { useState } from "react";

//componentes antd
import { Modal, Button } from "antd";

//api
import { desativarConta } from "../../../services/apiInterna/FluxoIdentificacao";

//componentes de mensagem
import { showMessage } from "../../messageHelper/ShowMessage";

//rotas
import { useNavigate } from "react-router-dom";

import "./DesativarConta.scss";

type DesativarContaProps = {
  open: boolean;
  onClose: () => void;
};

export default function DesativarContaModal({
  open,
  onClose,
}: DesativarContaProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // FUNÇÃO PARA DESATIVAR CONTA
  const handleConfirmDesativar = async () => {
    try {
      setLoading(true);
      await desativarConta();
      localStorage.clear();
      navigate("/");
      showMessage("Conta desativada com sucesso.", "success");
    } catch {
      showMessage("Erro ao desativar conta.", "error");
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
        <h2>Desativar conta</h2>
        <p>
          Tem certeza de que deseja desativar sua conta?
          <br />
          Após confirmar, você <b>não terá mais acesso</b> e todos os seus dados
          e histórico serão <b>permanentemente removidos</b>.
        </p>
        <p>Esta ação é irreversível.</p>
      </div>

      <div className="dc-buttons">
        <Button
          danger
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleConfirmDesativar}
        >
          Confirmar desativação
        </Button>

        <Button size="large" block onClick={onClose} style={{ marginTop: 12 }}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
