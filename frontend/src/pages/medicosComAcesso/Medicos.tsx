import { useEffect, useState } from "react";

//componentes antd
import { Card, Typography, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

//api
import {
  aprovarSolicitacao,
  recusarSolicitacao,
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

const { Title, Paragraph } = Typography;

export default function SeusExames() {
  const tipoUsuario = localStorage.getItem("tipo_usuario");

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPermitir, setLoadingPermitir] = useState(false);
  const [loadingRecusar, setLoadingRecusar] = useState(false);

  const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
    useState<SolicitacaoRow | null>(null);
  const [rows, setRows] = useState<SolicitacaoRow[]>([]);

  const handleAbrirModal = (record: SolicitacaoRow) => {
    setSolicitacaoSelecionada(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSolicitacaoSelecionada(null);
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

      showMessage("Solicitação recusada.", "success");
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showMessage("Erro ao recusar solicitação.", "error");
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
    },
    { title: "CRM", dataIndex: "crm", key: "crm" },
    {
      title: "Data do pedido",
      dataIndex: "dataAutorizacao",
      key: "dataAutorizacao",
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => {
        setSolicitacaoSelecionada(record);
        if (record.status === StatusAcesso.APROVADO) {
          return (
            <Button
              className="button-cancelar-acesso"
              danger
              size="small"
              onClick={handleRecusar}
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
          return <span style={{ color: "#999" }}>Acesso revogado</span>;
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
            dataAutorizacao: d.isValid()
              ? d.format("DD/MM/YYYY HH:mm")
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
      <Card>
        <Title>Médicos com Acesso</Title>
        <Paragraph>
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
        />
      </Card>

      {solicitacaoSelecionada && (
        <PedidoAcessoModal
          open={modalOpen}
          onClose={handleCloseModal}
          medico={solicitacaoSelecionada.nome}
          especialidade={solicitacaoSelecionada.especialidade}
          dataPedido={solicitacaoSelecionada.dataAutorizacao}
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
