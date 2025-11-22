import { useEffect, useState } from "react";
// componentes antd
import {
  Button,
  Dropdown,
  Input,
  Modal,
  Typography,
  type MenuProps,
} from "antd";
import { MoreOutlined, SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// api's
import {
  criarComentario,
  deletarComentario,
  editarComentario,
} from "../../../services/apiInterna/comentariosExame";

// interfaces
import type {
  ComentarioExame,
  ExameRow,
} from "../../../services/interfaces/Interfaces";

import "./VisualizarExameModal.scss";
import { showMessage } from "../../messageHelper/ShowMessage";

const { Paragraph } = Typography;
const { TextArea } = Input;

type VisualizarExameModalProps = {
  open: boolean;
  onClose: () => void;
  exame: ExameRow | null;
  tipoUsuario?: "paciente" | "medico" | null;
  onComentarioCriado?: (exameId: string, comentario: ComentarioExame) => void;
  onComentarioDeletado?: (exameId: string, comentarioId: number) => void;
  onComentarioEditado?: (exameId: string, comentario: ComentarioExame) => void;
};

export default function VisualizarExameModal({
  open,
  onClose,
  exame,
  tipoUsuario,
  onComentarioCriado,
  onComentarioDeletado,
  onComentarioEditado,
}: VisualizarExameModalProps) {
  const [comentariosExame, setComentariosExame] = useState<ComentarioExame[]>(
    []
  );
  const [novoComentario, setNovoComentario] = useState("");
  const [salvandoComentario, setSalvandoComentario] = useState(false);

  const [comentarioEmEdicaoId, setComentarioEmEdicaoId] = useState<
    number | null
  >(null);
  const [textoEdicao, setTextoEdicao] = useState("");

  const usuario_id = localStorage.getItem("usuario_id");

  const podeGerenciarComentario = (comentario: ComentarioExame) => {
    if (!usuario_id) return false;

    const autorId = comentario.usuario_id;
    if (autorId == null) return false;

    return String(autorId) === String(usuario_id);
  };

  // URL DO ARQUIVO
  const fileUrl = exame?.url ? `/api${exame.url}` : null;

  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: "Editar comentário",
    },
    {
      key: "delete",
      label: "Excluir",
      danger: true,
    },
  ];

  // SALVAR NOVO COMENTÁRIO
  const handleSalvarComentario = async () => {
    if (!exame || !novoComentario.trim()) return;

    try {
      setSalvandoComentario(true);

      const payload = {
        exame_id: Number(exame.key),
        comentario: novoComentario.trim(),
      };

      const resp = await criarComentario(payload);

      const raw = resp?.data?.data || resp?.data || payload;

      const comentarioSalvo: ComentarioExame = {
        ...raw,
        comentario: raw.comentario ?? payload.comentario,
        exame_id: raw.exame_id ?? Number(exame.key),
        comentario_exame_id:
          raw.comentario_exame_id ?? raw.comentario_id ?? raw.id ?? undefined,
      };

      setComentariosExame((prev) => [...prev, comentarioSalvo]);
      onComentarioCriado?.(String(exame.key), comentarioSalvo);

      setNovoComentario("");
      showMessage("Comentário salvo com sucesso!", "success");
    } catch (error) {
      showMessage(
        "Não foi possível salvar o comentário. Tente novamente.",
        "error"
      );
    } finally {
      setSalvandoComentario(false);
    }
  };

  // SALVAR EDIÇÃO
  const handleSalvarEdicao = async () => {
    if (!exame || !comentarioEmEdicaoId || !textoEdicao.trim()) return;

    try {
      setSalvandoComentario(true);

      const payload = {
        comentario_id: comentarioEmEdicaoId,
        comentario: textoEdicao.trim(),
      };

      const resp = await editarComentario(payload);
      const comentarioEditado: ComentarioExame = resp.data?.data || {
        comentario_exame_id: comentarioEmEdicaoId,
        comentario: textoEdicao.trim(),
      };

      setComentariosExame((prev) =>
        prev.map((c) =>
          c.comentario_exame_id === comentarioEmEdicaoId
            ? { ...c, ...comentarioEditado, comentario: textoEdicao.trim() }
            : c
        )
      );

      const exameId = String(exame.key);
      onComentarioEditado?.(exameId, comentarioEditado);

      setComentarioEmEdicaoId(null);
      setTextoEdicao("");
      showMessage("Comentário editado com sucesso!", "success");
    } catch (error) {
      showMessage(
        "Não foi possível editar o comentário. Tente novamente.",
        "error"
      );
    } finally {
      setSalvandoComentario(false);
    }
  };

  const handleCancelarEdicao = () => {
    setComentarioEmEdicaoId(null);
    setTextoEdicao("");
  };

  // AÇÕES DO COMENTÁRIO (abrir edição / excluir)
  const handleAcaoComentario = async (
    acao: string,
    comentario: ComentarioExame
  ) => {
    if (!podeGerenciarComentario(comentario)) {
      return;
    }
    if (acao === "edit") {
      if (!comentario.comentario_exame_id) return;
      setComentarioEmEdicaoId(comentario.comentario_exame_id);
      setTextoEdicao(comentario.comentario || "");
      return;
    }

    if (acao === "delete") {
      if (!comentario.comentario_exame_id) return;

      try {
        const payload = {
          comentario_id: comentario.comentario_exame_id,
        };

        await deletarComentario(payload);

        setComentariosExame((prev) =>
          prev.filter(
            (c) => c.comentario_exame_id !== comentario.comentario_exame_id
          )
        );

        const exameId = String(comentario.exame_id ?? exame?.key);
        onComentarioDeletado?.(exameId, comentario.comentario_exame_id);
        
        if (comentarioEmEdicaoId === comentario.comentario_exame_id) {
          setComentarioEmEdicaoId(null);
          setTextoEdicao("");
        }

        showMessage("Comentário removido.", "success");
      } catch (err) {
        showMessage(
          "Não foi possível excluir o comentário. Tente novamente.",
          "error"
        );
      }
    }
  };

  const handleClose = () => {
    setComentariosExame([]);
    setComentarioEmEdicaoId(null);
    setTextoEdicao("");
    setNovoComentario("");
    onClose();
  };

  // CARREGAR COMENTÁRIOS QUANDO MUDA O EXAME
  useEffect(() => {
    if (!exame) {
      setComentariosExame([]);
      setComentarioEmEdicaoId(null);
      setTextoEdicao("");
      return;
    }
    setComentariosExame(exame.comentarios ?? []);
    setComentarioEmEdicaoId(null);
    setTextoEdicao("");
  }, [exame]);

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
        setComentarioEmEdicaoId(null);
        setTextoEdicao("");
        setNovoComentario("");
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

              {comentariosExame.map((c, idx) => {
                const emEdicao =
                  c.comentario_exame_id &&
                  c.comentario_exame_id === comentarioEmEdicaoId;

                const nome = `${c.primeiro_nome ?? ""} ${
                  c.ultimo_nome ?? ""
                }`.trim();

                return (
                  <div
                    key={c.comentario_exame_id || idx}
                    className="comentario-card"
                  >
                    <div className="comentario-header">
                      <div className="comentario-avatar">
                        {(c.primeiro_nome || "P")[0]}
                      </div>

                      <div className="comentario-header-main">
                        <div>
                          <div className="comentario-autor">
                            {nome || "Profissional"}
                          </div>
                          {(c.data_criacao || c.data_criacao) && (
                            <div className="comentario-data">
                              {dayjs(c.data_criacao || c.data_criacao).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </div>
                          )}
                        </div>

                        {tipoUsuario === "medico" &&
                          podeGerenciarComentario(c) && (
                            <Dropdown
                              trigger={["click"]}
                              menu={{
                                items: menuItems,
                                onClick: ({ key }) =>
                                  handleAcaoComentario(key, c),
                              }}
                            >
                              <Button
                                type="text"
                                size="small"
                                icon={<MoreOutlined />}
                              />
                            </Dropdown>
                          )}
                      </div>
                    </div>
                    {emEdicao ? (
                      <div className="comentario-edicao">
                        <TextArea
                          autoSize={{ minRows: 2, maxRows: 4 }}
                          value={textoEdicao}
                          onChange={(e) => setTextoEdicao(e.target.value)}
                        />
                        <div className="comentario-edicao-actions">
                          <Button
                            size="small"
                            onClick={handleCancelarEdicao}
                            disabled={salvandoComentario}
                            className="button-cancelar-edit-comentario"
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            onClick={handleSalvarEdicao}
                            loading={salvandoComentario}
                            disabled={!textoEdicao.trim()}
                            className="button-salvar-edit-comentario"
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="comentario-texto">{c.comentario}</div>
                    )}
                  </div>
                );
              })}
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
