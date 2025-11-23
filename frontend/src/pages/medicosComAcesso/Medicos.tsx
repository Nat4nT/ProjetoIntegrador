import { useEffect, useState } from "react";

//componentes antd
import { Card, Typography, Table, Button, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

//api
import {
  aprovarSolicitacao,
  recusarSolicitacao,
  revogarAcesso,
  verificarSolicitacoes,
} from "../../services/apiInterna/verificarSolicitacoesAcesso";

//validações
import { showMessage } from "../../components/messageHelper/ShowMessage";

//interfaces
import type { SolicitacaoRow } from "../../services/interfaces/Interfaces";

//modal
import PedidoAcessoModal from "../../components/modals/modalAceitarSolicitacaoMedico/ModalAceitarSolicitacao";
import { StatusAcesso } from "../../utils/Enum";

import "./Medicos.scss";
import AvisoExclusaoModal from "../../components/modals/avisoExclusão/AvisoExclusao";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function SeusExames() {
  const tipoUsuario = localStorage.getItem("tipo_usuario");

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPermitir, setLoadingPermitir] = useState(false);
  const [loadingRecusar, setLoadingRecusar] = useState(false);
  const [openModalAvisoExclusao, setOpenModalAvisoExclusao] = useState(false);

  const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
    useState<SolicitacaoRow | null>(null);
  const [rows, setRows] = useState<SolicitacaoRow[]>([]);

  const screens = useBreakpoint();
  const isMobile = !screens.xl;

  const handleAbrirModal = (record: SolicitacaoRow) => {
    setSolicitacaoSelecionada(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSolicitacaoSelecionada(null);
  };

  const closeModalAvisoExclusao = () => {
    setOpenModalAvisoExclusao(false);
  };

  // FUNÇÃO PARA ACEITAR ACESSO DO MÉDICO
  const handlePermitir = async () => {
    if (!solicitacaoSelecionada) return;
    try {
      setLoadingPermitir(true);
      const solicitacao_id = Number(solicitacaoSelecionada.key);
      await aprovarSolicitacao({ solicitacao_id });

      setRows((prev) =>
        prev.map((r) =>
          r.key === String(solicitacao_id)
            ? { ...r, status: StatusAcesso.APROVADO }
            : r
        )
      );

      showMessage("Acesso permitido com sucesso.", "success");
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showMessage("Erro ao permitir acesso.", "error");
    } finally {
      setLoadingPermitir(false);
    }
  };

  // FUNÇÃO PARA RECURAR ACESSO DO MÉDICO
  const handleRecusar = async () => {
    if (!solicitacaoSelecionada) return;
    try {
      setLoadingRecusar(true);
      const solicitacao_id = Number(solicitacaoSelecionada.key);
      await recusarSolicitacao({ solicitacao_id });

      setRows((prev) =>
        prev.map((r) =>
          r.key === String(solicitacao_id)
            ? { ...r, status: StatusAcesso.REVOGADO }
            : r
        )
      );

      showMessage("Solicitação recusada.", "info");
      handleCloseModal();
      closeModalAvisoExclusao();
    } catch (err) {
      console.error(err);
      showMessage("Erro ao recusar solicitação.", "error");
    } finally {
      setLoadingRecusar(false);
    }
  };

  // FUNÇÃO PARA REVOGAR ACESSO
  const handlerRevogar = async () => {
    if (!solicitacaoSelecionada) return;
    try {
      setLoadingRecusar(true);
      const solicitacao_id = Number(solicitacaoSelecionada.key);
      await revogarAcesso({ solicitacao_id });

      setRows((prev) =>
        prev.map((r) =>
          r.key === String(solicitacao_id)
            ? { ...r, status: StatusAcesso.REVOGADO }
            : r
        )
      );

      showMessage("Acesso cancelado com sucesso.", "success");
      handleCloseModal();
      closeModalAvisoExclusao();
    } catch (err) {
      console.error(err);
      showMessage("Erro ao cancelado acesso.", "error");
    } finally {
      setLoadingRecusar(false);
    }
  };

  // COLUNAS DA TABELA
  const colunas: ColumnsType<SolicitacaoRow> = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    {
      title: "Especialidade",
      dataIndex: "especialidade",
      key: "especialidade",
      responsive: ["sm"],
    },
    { title: "CRM", dataIndex: "crm", key: "crm", responsive: ["md"] },
    {
      title: "Data do pedido",
      dataIndex: "dataPedido",
      key: "dataPedido",
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
      responsive: ["xl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["xl"],
      render: (_, record) => {
        if (record.status === StatusAcesso.APROVADO) {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>Ativo</span>
          );
        }
        if (record.status === StatusAcesso.PENDENTE) {
          return (
            <span style={{ color: "orange", fontWeight: "bold" }}>
              Pendente
            </span>
          );
        }

        if (record.status === StatusAcesso.REVOGADO) {
          return (
            <span style={{ color: "#8888888f", fontWeight: "bold" }}>
              Revogado
            </span>
          );
        }
        return null;
      },
    },
    {
      title: "Ações",
      key: "acoes",
      responsive: ["xl"],
      render: (_, record) => {
        if (record.status === StatusAcesso.APROVADO) {
          return (
            <Button
              className="button-cancelar-acesso"
              danger
              size="small"
              onClick={() => {
                setSolicitacaoSelecionada(record);
                setOpenModalAvisoExclusao(true);
              }}
              loading={loadingRecusar}
            >
              Cancelar acesso
            </Button>
          );
        }

        if (record.status === StatusAcesso.PENDENTE) {
          return (
            <Button
              className="button-ver-solicitacao"
              type="primary"
              size="small"
              onClick={() => handleAbrirModal(record)}
            >
              Ver solicitação
            </Button>
          );
        }

        if (record.status === StatusAcesso.REVOGADO) {
          return <span style={{ color: "#8888888f" }}>Acesso revogado</span>;
        }

        return null;
      },
    },
  ];

  // FUNÇÃO PARA CARREGAR AS SOLICITAÇÕES
  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        setLoading(true);
        if (tipoUsuario !== "paciente") return;

        const response = await verificarSolicitacoes();
        const lista = response?.data ?? [];

        if (!Array.isArray(lista) || lista.length === 0) {
          setRows([]);
          return;
        }

        const mapped: SolicitacaoRow[] = lista.map((s: any) => {
          const nome =
            `${s.primeiro_nome ?? ""} ${s.ultimo_nome ?? ""}`.trim() ||
            "Médico";
          const crm = `CRM-${s.estado_atuacao ?? ""} ${s.crm ?? ""}`.trim();
          const d = dayjs(s.data_criacao);

          return {
            key: String(s.solcitacao_id ?? s.solicitacao_id ?? s.id),
            nome,
            especialidade: s.especialidade ?? "Não informado",
            crm,
            dataPedido: d.isValid()
              ? d.format("DD/MM/YYYY")
              : s.data_criacao ?? "-",
            rawDate: s.data_criacao ?? "",
            status: s.status,
            solcitacao_id: s.solcitacao_id,
          };
        });

        setRows(mapped);
      } catch (err) {
        console.error(err);
        showMessage("Erro ao carregar solicitações de acesso.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregarSolicitacoes();
  }, [tipoUsuario]);

  return (
    <div>
      <AvisoExclusaoModal
        onClose={closeModalAvisoExclusao}
        open={openModalAvisoExclusao}
        onSubmit={handlerRevogar}
        tituloModal={"Revogar acesso médico"}
        fraseUmModal={"Tem certeza de que deseja revogar o acesso?"}
        fraseDoiModal={""}
      />
      <Card>
        <Title>Médicos com Acesso</Title>
        <Paragraph className="descricao-pages">
          Aqui você pode visualizar os médicos que têm acesso ao seu perfil e
          gerenciar essas permissões. Caso queira, é possível revogar o acesso a
          qualquer momento.
        </Paragraph>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          rowKey="key"
          columns={colunas}
          loading={loading}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Nenhuma solicitação encontrada" }}
          rowClassName={(record) =>
            record.status === StatusAcesso.REVOGADO ? "linha-revogada" : ""
          }
          expandable={
            isMobile
              ? {
                  columnWidth: 40,
                  expandedRowRender: (record) => (
                    <div
                      style={{
                        padding: "8px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div>
                        <strong>Especialidade: </strong>
                        {record.especialidade}
                      </div>

                      <div>
                        <strong>CRM: </strong>
                        {record.crm}
                      </div>

                      <div>
                        <strong>Data do pedido: </strong>
                        {record.dataPedido}
                      </div>

                      <div>
                        <strong>Status: </strong>
                        {record.status}
                      </div>

                      <div>
                        {record.status === StatusAcesso.APROVADO && (
                          <Button
                            className="button-cancelar-acesso"
                            danger
                            size="small"
                            onClick={() => {
                              setSolicitacaoSelecionada(record);
                              setOpenModalAvisoExclusao(true);
                            }}
                            loading={loadingRecusar}
                          >
                            Cancelar acesso
                          </Button>
                        )}

                        {record.status === StatusAcesso.PENDENTE && (
                          <Button
                            className="button-ver-solicitacao"
                            type="primary"
                            size="small"
                            onClick={() => handleAbrirModal(record)}
                          >
                            Ver solicitação
                          </Button>
                        )}

                        {record.status === StatusAcesso.REVOGADO && (
                          <span style={{ color: "#8888888f" }}>
                            Acesso revogado
                          </span>
                        )}
                      </div>
                    </div>
                  ),
                }
              : undefined
          }
        />
      </Card>

      {solicitacaoSelecionada && (
        <PedidoAcessoModal
          open={modalOpen}
          onClose={handleCloseModal}
          medico={solicitacaoSelecionada.nome}
          especialidade={solicitacaoSelecionada.especialidade}
          dataPedido={solicitacaoSelecionada.dataPedido}
          crm={solicitacaoSelecionada.crm}
          onPermitir={handlePermitir}
          onRecusar={handleRecusar}
          loadingPermitir={loadingPermitir}
          loadingRecusar={loadingRecusar}
        />
      )}
    </div>
  );
}
