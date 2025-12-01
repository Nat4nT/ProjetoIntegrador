import { Modal, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./ModalAceitarSolicitacao.scss";
import { parseMaybeJsonArray } from "../../../utils/Utilidades";

type PedidoAcessoModalProps = {
  open: boolean;
  onClose: () => void;
  medico: string;
  especialidade: string[] | string;
  dataPedido: string;
  crm: string;
  imagem_perfil?: string;

  onPermitir: () => void;
  onRecusar: () => void;
  loadingPermitir?: boolean;
  loadingRecusar?: boolean;
};

export default function PedidoAcessoModal({
  open,
  onClose,
  medico,
  especialidade,
  dataPedido,
  crm,
  imagem_perfil,
  onPermitir,
  onRecusar,
  loadingPermitir,
  loadingRecusar,
}: PedidoAcessoModalProps) {
   const userPhoto = imagem_perfil ? `/api${imagem_perfil}` : undefined;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={460}
      maskClosable={false}
      title={null}
      rootClassName="pedido-acesso-modal"
      styles={{
        content: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
        },
      }}
    >
      <div className="pa-header">
        <h2>Pedido de acesso ao seu perfil</h2>
      </div>

      <div className="pa-content">
        <div className="pa-avatar">
          <Avatar
            size={120}
            src={userPhoto}
            icon={!userPhoto ? <UserOutlined /> : undefined}
          />
        </div>

        <div className="pa-info">
          <p>
            <strong>Médico:</strong> {medico}
          </p>
          <p>
            <strong>Especialidade:</strong>{" "}
            {Array.isArray(parseMaybeJsonArray(especialidade))
              ? parseMaybeJsonArray(especialidade).join(", ")
              : especialidade}
          </p>
          <p>
            <strong>Data pedido:</strong> {dataPedido}
          </p>
          <p>{crm}</p>
        </div>
      </div>

      <p className="pa-note">
        Esse acesso poderá ser revogado a qualquer momento na tela{" "}
        <strong>Médicos com Acesso</strong> do menu lateral.
      </p>

      <div className="pa-actions">
        <Button
          type="primary"
          className="pa-btn-permitir"
          onClick={onPermitir}
          loading={loadingPermitir}
        >
          Permitir acesso
        </Button>
        <Button
          danger
          className="pa-btn-recusar"
          onClick={onRecusar}
          loading={loadingRecusar}
        >
          Recusar
        </Button>
      </div>
    </Modal>
  );
}
