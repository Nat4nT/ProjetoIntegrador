import { useEffect, useState } from "react";
import { Button, Input, Modal, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import type {
  ComentarioExame,
  ExameRow,
} from "../../../services/interfaces/Interfaces";

import "./VisualizarExameModal.scss";
import { showMessage } from "../../messageHelper/ShowMessage";
import { criarComentario } from "../../../services/apiInterna/comentariosExame";

const { Paragraph } = Typography;

type VisualizarExameModalProps = {
  open: boolean;
  onClose: () => void;
  exame: ExameRow | null;
  tipoUsuario?: "paciente" | "medico" | null;
};

export default function VisualizarExameModal({
  open,
  onClose,
  exame,
  tipoUsuario,
}: VisualizarExameModalProps) {
  const [comentariosExame, setComentariosExame] = useState<ComentarioExame[]>(
    []
  );
  const [novoComentario, setNovoComentario] = useState("");
  const [salvandoComentario, setSalvandoComentario] = useState(false);

  // URL direta do arquivo
  const fileUrl = exame?.url ? `/api${exame.url}` : null;

  // carregar comentários que vêm junto no exame
  useEffect(() => {
    if (!exame) {
      setComentariosExame([]);
      return;
    }
    setComentariosExame(exame.comentarios ?? []);
  }, [exame]);

  const handleSalvarComentario = async () => {
    if (!exame || !novoComentario.trim()) return;

    try {
      setSalvandoComentario(true);

      const payload = {
        exame_id: Number(exame.key),
        comentario: novoComentario.trim(),
      };

      const resp = await criarComentario(payload);
      const comentarioSalvo: ComentarioExame =
        resp.data?.data || resp.data || payload;

      setComentariosExame((prev) => [...prev, comentarioSalvo]);
      setNovoComentario("");
      showMessage("Comentário salvo com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showMessage(
        "Não foi possível salvar o comentário. Tente novamente.",
        "error"
      );
    } finally {
      setSalvandoComentario(false);
    }
  };

  const handleClose = () => {
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
                  Laboratório: <span className="info-exame">{exame.local}</span>
                </div>
              </div>
            </div>

            {fileUrl && (
              <iframe
                title="Visualização do exame"
                src={fileUrl}
                className="exame-iframe"
              />
            )}
          </div>

          <div className="comentarios-wrapper">
            <h3>Comentários</h3>

            <div className="comentarios-list">
              {comentariosExame.length === 0 && (
                <Paragraph type="secondary">
                  Nenhum comentário disponível para este exame.
                </Paragraph>
              )}

              {comentariosExame.map((c, idx) => (
                <div
                  key={c.comentario_exame_id || idx}
                  className="comentario-card"
                >
                  <div className="comentario-header">
                    <div className="comentario-avatar">
                      {(c.nome_medico || "P")[0]}
                    </div>
                    <div>
                      <div className="comentario-autor">
                        {c.nome_medico || "Profissional"}
                      </div>
                      {(c.data_criacao || c.created_at) && (
                        <div className="comentario-data">
                          {dayjs(c.data_criacao || c.created_at).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="comentario-texto">{c.comentario}</div>
                </div>
              ))}
            </div>

            {tipoUsuario === "medico" && (
              <div className="novo-comentario-input">
                <Input
                  placeholder="Escreva um comentário..."
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    if (!salvandoComentario && novoComentario.trim()) {
                      handleSalvarComentario();
                    }
                  }}
                  suffix={
                    <Button
                      type="text"
                      icon={<SendOutlined />}
                      onClick={handleSalvarComentario}
                      loading={salvandoComentario}
                      disabled={!novoComentario.trim()}
                    />
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
