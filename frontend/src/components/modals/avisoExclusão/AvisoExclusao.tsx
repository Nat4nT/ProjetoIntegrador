//componentes antd
import { Modal, Button } from "antd";

import "./AvisoExclusao.scss";

type AvisoExcluir = {
  open: boolean;
  tituloModal: String;
  fraseUmModal: String;
  fraseDoiModal: String;
  onClose: () => void;
  onSubmit: () => void;
};

export default function AvisoExclusaoModal({
  open,
  tituloModal,
  fraseUmModal,
  fraseDoiModal,
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
        <h2>{tituloModal}</h2>
        <p>{fraseUmModal}</p>
        <p>{fraseDoiModal}</p>
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
