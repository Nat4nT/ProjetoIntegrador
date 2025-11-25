import { Modal, Button } from "antd";

import "./ModalAvisoContaInativa.scss";

type ModalContaInativaProps = {
  open: boolean;
  onClose: () => void;
  onReativar: () => void; 
};

export default function ModalContaInativa({
  open,
  onClose,
  onReativar,
}: ModalContaInativaProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      title={null}
      maskClosable={false}
      rootClassName="conta-inativa-modal"
      styles={{
        content: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      <div className="ci-header">
        <h2>Conta inativa</h2>

        <p className="ci-subtext">
          Deseja solicitar a reativação da sua conta para voltar a utilizar o
          MedExame?
        </p>
      </div>

      <div className="ci-actions">
        <Button
          type="primary"
          size="large"
          className="ci-primary"
          block
          onClick={onReativar}
        >
          Reativar conta
        </Button>

        <Button type="default" size="large" block onClick={onClose}>
          Voltar para o login
        </Button>
      </div>
    </Modal>
  );
}
