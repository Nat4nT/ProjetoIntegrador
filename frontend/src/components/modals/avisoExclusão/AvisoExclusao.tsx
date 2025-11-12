//componentes antd
import { Modal, Button } from "antd";

import "./AvisoExclusao.scss";

type AvisoExcluir = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function AvisoExclusaoModal({
  open,
  onClose,
  onSubmit,
}: AvisoExcluir) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={620}
      maskClosable={false}
      title={null}
      rootClassName="aviso-exclusao-modal"
      styles={{
        content: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      <div className="dc-header-aviso-exclusao">
        <h2>Excluir exame</h2>
        <p>Tem certeza de que deseja excluir o exame?</p>
        <p>Esta ação é irreversível.</p>
      </div>

      <div className="dc-buttons-aviso-exclusao">
        <Button danger type="primary" size="large" block onClick={onSubmit}>
          Confirmar
        </Button>

        <Button size="large" block onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
