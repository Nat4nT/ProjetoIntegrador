import { useEffect, useState } from "react";

//componentes antd
import { Modal, Spin, Typography } from "antd";
import dayjs from "dayjs";

//apis
import { api } from "../../../services/api";

//interfaces
import type { ExameRow } from "../../../services/interfaces/Interfaces";

import "./VisualizarExameModal.scss";

const { Paragraph } = Typography;

type VisualizarExameModalProps = {
  open: boolean;
  onClose: () => void;
  exame: ExameRow | null;
};

export default function VisualizarExameModal({
  open,
  onClose,
  exame,
}: VisualizarExameModalProps) {
  const [loadingExame, setLoadingExame] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [comentariosExame, setComentariosExame] = useState<any[]>([]);

  // FUNÇÃO PARA ABRIR EXAME
  useEffect(() => {
    async function carregarPdf() {
      if (!open || !exame?.url) return;

      try {
        setLoadingExame(true);
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl);
          setFileUrl(null);
        }

        const resp = await api.get(exame.url, { responseType: "blob" });
        const contentType = resp.headers["content-type"] || "application/pdf";

        const blob = new Blob([resp.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingExame(false);
      }
    }

    carregarPdf();
  }, [open, exame?.url]);

  // FUNÇÃO PARA CARREGAR EXAMES
  useEffect(() => {
    if (!exame) {
      setComentariosExame([]);
      return;
    }

    const comentarios =
      (exame as any).comentarios ||
      ((exame as any).mensagem ? [{ mensagem: (exame as any).mensagem }] : []);

    setComentariosExame(comentarios || []);
  }, [exame]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleClose = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl(null);
    setComentariosExame([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={1500}
      centered
      rootClassName="visualizar-exame"
      afterClose={() => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        setFileUrl(null);
        setComentariosExame([]);
      }}
    >
      {exame && (
        <div className="visualizar-exame-modal">
          <div className="exame-view">
            <div className="exame-info-header">
              <div>
                <div className="exame-info-titulo">
                  Exame: <span className="info-exame">{exame.exame}</span>
                </div>
                <div className="exame-info-text">
                  Data de Realização:{" "}
                  <span className="info-exame">{exame.dataRealizacao}</span>
                </div>
                <div className="exame-info-text">
                  Laboratório: <span className="info-exame">{exame.local}</span>{" "}
                </div>
              </div>
            </div>

            {loadingExame && (
              <div className="exame-loading">
                <Spin />
              </div>
            )}

            {fileUrl && !loadingExame && (
              <iframe
                title="Visualização do exame"
                src={fileUrl}
                className="exame-iframe"
              />
            )}
          </div>

          <div className="comentarios-wrapper">
            <h3>Comentários</h3>
            {comentariosExame.length === 0 && (
              <Paragraph type="secondary">
                Nenhum comentário disponível para este exame.
              </Paragraph>
            )}

            {comentariosExame.map((c: any, idx: number) => (
              <div
                key={c.id || c.comentario_id || idx}
                className="comentario-card"
              >
                <div className="comentario-autor">
                  {c.autor || c.nome_medico || "Profissional"}
                </div>
                <div className="comentario-data">
                  {c.data ? dayjs(c.data).format("DD/MM/YYYY HH:mm") : ""}
                </div>
                <div className="comentario-texto">
                  {c.mensagem || c.texto || c.descricao || c.comentario}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
