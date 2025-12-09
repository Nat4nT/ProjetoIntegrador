import { useEffect, useState } from "react";

//componentes antd
import { Card, Typography, Table, Button, Space, Grid } from "antd";

import type { ColumnsType } from "antd/es/table";

//data
import dayjs from "dayjs";

//api
import {
  buscarPacientes,
  solicitarAcesso,
} from "../../../services/apiInterna/buscarPacientes";
import { revogarAcesso } from "../../../services/apiInterna/verificarSolicitacoesAcesso";

//interface
import type { PacienteRow } from "../../../services/interfaces/Interfaces";

//componentes
import { showMessage } from "../../../components/messageHelper/ShowMessage";
import { maskCPF } from "../../../utils/Masks";
import { useNavigate } from "react-router-dom";
import { StatusAcesso } from "../../../utils/Enum";
import AvisoExclusaoModal from "../../../components/modals/avisoExclusão/AvisoExclusao";

import "./MeusPacientes.scss";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [openModalAvisoExclusao, setOpenModalAvisoExclusao] = useState(false);
  const [pacientes, setPacientes] = useState<PacienteRow[]>([]);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<
    any | null
  >(null);

  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.xl;

  const closeModalAvisoExclusao = () => {
    setOpenModalAvisoExclusao(false);
  };

  const handleCloseModal = () => {
    setSolicitacaoSelecionada(null);
  };

  // FUNÇÃO PARA REVOGAR ACESSO
  const handlerRevogar = async () => {
    if (!solicitacaoSelecionada) return;
    try {
      debugger;
      const solicitacao_id = Number(solicitacaoSelecionada.solicitacao_id);
      await revogarAcesso({ solicitacao_id });

      setPacientes((prev) =>
        prev.map((r) =>
          r.solicitacao_id === solicitacao_id
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
    }
  };

  //FUNÇÃO PARA SOLICITAR ACESSO AO PERFIL DO USUÁRIO
  const handleSolicitarAcesso = async (pacienteId: string | number) => {
    setLoading(true);
    try {
      const payload = { paciente_id: pacienteId };

      await solicitarAcesso(payload);

      showMessage("Solicitação enviada com sucesso.", "success");
    } catch (err: any) {
      console.error(err);
      showMessage("Erro ao solicitar acesso.", "error");
    } finally {
      setLoading(false);
    }
  };

  const colunas: ColumnsType<PacienteRow> = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "CPF", dataIndex: "cpf", key: "cpf", responsive: ["md"] },
    {
      title: "Data de nascimento",
      dataIndex: "dataNascimento",
      key: "dataNascimento",
      sorter: (a, b) =>
        dayjs(a.dataNascimento).valueOf() - dayjs(b.dataNascimento).valueOf(),
      defaultSortOrder: "ascend",
      responsive: ["xl"],
    },
    {
      title: "Autorizado em",
      dataIndex: "autorizadoEm",
      key: "autorizadoEm",
      sorter: (a, b) =>
        dayjs(a.autorizadoEm).valueOf() - dayjs(b.autorizadoEm).valueOf(),
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
        if (record.status === StatusAcesso.RECUSADO) {
          return <span style={{ color: "red" }}>Acesso recusado</span>;
        }
        return null;
      },
    },
    {
      title: "Ações",
      key: "acoes",
      responsive: ["xl"],
      render: (_, record) => {
        //RN08, médico só consegue acessar os exames do usuário caso status com status aprovado
        //record.status é o valor que vem do backend, populado na linha 245.
        if (record.status === StatusAcesso.APROVADO) {
          return (
            <div className="container-buttons-paciente-ativo">
              <Button
                className="button-ver-exames"
                size="small"
                type="primary"
                onClick={() =>
                  navigate(`/exames/paciente`, {
                    state: { paciente: record },
                  })
                }
              >
                Ver exames
              </Button>
              <Button
                className="button-cancelar-acesso-paciente"
                size="small"
                danger
                onClick={() => {
                  setSolicitacaoSelecionada(record);
                  setOpenModalAvisoExclusao(true);
                }}
              >
                Cancelar acesso
              </Button>
            </div>
          );
        }

        if (record.status === StatusAcesso.PENDENTE) {
          return (
            <Button className="button-paciente-pendente" size="small">
              Pedido pendente
            </Button>
          );
        }

        if (record.status === StatusAcesso.REVOGADO) {
          return <span style={{ color: "#8888888f" }}>Acesso revogado</span>;
        }

        if (record.status === StatusAcesso.RECUSADO) {
          return (
            <Button
              className="button-ver-exames"
              size="small"
              type="primary"
              onClick={() => handleSolicitarAcesso(record.key)}
            >
              Solicitar acesso
            </Button>
          );
        }
        return null;
      },
    },
  ];

  //FUNÇÃO CARREGAR PACIENTES
  useEffect(() => {
    async function carregarPacientes() {
      try {
        setLoading(true);
        const response = await buscarPacientes();

        const mapped: PacienteRow[] = response.data.map((s: any) => {
          const nomeCompleto = `${s.primeiro_nome ?? ""} ${
            s.ultimo_nome ?? ""
          }`.trim();
          const nome = nomeCompleto || "Paciente";
          const cpf = maskCPF(s.cpf);

          const dataNascRaw = s.data_nascimento;
          const dataAtualizacaoRaw = s.data_atualizacao;

          return {
            key: s.paciente_id,

            solicitacao_id: s.solicitacao_id,
            nome,
            especialidade: s.especialidade ?? "Não informado",
            cpf,
            dataNascimento: dataNascRaw
              ? dayjs(dataNascRaw).format("DD/MM/YYYY")
              : "",
            rawDate: dataNascRaw,
            autorizadoEm: dataAtualizacaoRaw
              ? dayjs(dataAtualizacaoRaw).format("DD/MM/YYYY")
              : "",
            status: s.status,

            paciente_id: s.paciente_id,
            primeiro_nome: s.primeiro_nome,
            ultimo_nome: s.ultimo_nome,
            email: s.email,
            telefone: s.telefone,
            imagem_perfil: s.imagem_perfil,

            alergias: s.alergias,
            desc_deficiencia: s.desc_deficiencia,
            doencas_diagnosticadas: s.doencas_diagnosticadas,
            medicacao: s.medicacao,

            tipo_sanguineo: s.tipo_sanguineo,
            altura: s.altura,
            peso: s.peso,
            data_atualizacao: s.data_atualizacao,
          };
        });

        setPacientes(mapped);
      } catch (err: any) {
        showMessage("Erro ao carregar pacientes.", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarPacientes();
  }, []);

  return (
    <div>
      <AvisoExclusaoModal
        onClose={closeModalAvisoExclusao}
        open={openModalAvisoExclusao}
        onSubmit={handlerRevogar}
        tituloModal={"Cancelar acesso ao paciente"}
        fraseUmModal={"Tem certeza de que deseja cancelar o acesso?"}
        fraseDoiModal={""}
      />
      <Card>
        <Title>Meus pacientes</Title>
        <Paragraph className="descricao-pages">
          Aqui você encontra os pacientes que concederam acesso e as
          solicitações pendentes. Você pode visualizar os exames autorizados ou
          encerrar o acesso quando não for mais necessário.
        </Paragraph>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 16,
          }}
        ></div>
        {/* RN17 tabela de listagem dos pacientes.*/}
        <Table
          rowKey="key"
          columns={colunas}
          loading={loading}
          dataSource={pacientes}
          pagination={{ pageSize: 10 }}
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
                        <strong>CPF: </strong>
                        {record.cpf}
                      </div>
                      <div>
                        <strong>Data de nascimento: </strong>
                        {record.dataNascimento}
                      </div>
                      <div>
                        <strong>Autorizado em: </strong>
                        {record.autorizadoEm || "-"}
                      </div>

                      <div>
                        <strong>Status: </strong>
                        {record.status === StatusAcesso.APROVADO && (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            Ativo
                          </span>
                        )}

                        {record.status === StatusAcesso.PENDENTE && (
                          <span style={{ color: "orange", fontWeight: "bold" }}>
                            Pendente
                          </span>
                        )}

                        {record.status === StatusAcesso.REVOGADO && (
                          <span
                            style={{ color: "#8888888f", fontWeight: "bold" }}
                          >
                            Revogado
                          </span>
                        )}

                        {record.status === StatusAcesso.RECUSADO && (
                          <span style={{ color: "red" }}>Acesso recusado</span>
                        )}
                      </div>

                      <div style={{ marginTop: 8 }}>
                        {record.status === StatusAcesso.APROVADO && (
                          <Space wrap>
                            <Button
                              className="button-ver-exames"
                              size="small"
                              type="primary"
                              onClick={() =>
                                navigate(`/exames/paciente`, {
                                  state: { paciente: record },
                                })
                              }
                            >
                              Ver exames
                            </Button>

                            <Button
                              className="button-cancelar-acesso-paciente"
                              size="small"
                              danger
                              onClick={() => {
                                setSolicitacaoSelecionada(record);
                                setOpenModalAvisoExclusao(true);
                              }}
                            >
                              Cancelar acesso
                            </Button>
                          </Space>
                        )}

                        {record.status === StatusAcesso.PENDENTE && (
                          <Button
                            className="button-paciente-pendente"
                            size="small"
                          >
                            Pedido pendente
                          </Button>
                        )}

                        {record.status === StatusAcesso.REVOGADO && (
                          <span style={{ color: "#8888888f" }}>
                            Acesso revogado
                          </span>
                        )}

                        {record.status === StatusAcesso.RECUSADO && (
                          <Button
                            className="button-ver-exames"
                            size="small"
                            type="primary"
                            onClick={() => handleSolicitarAcesso(record.key)}
                          >
                            Solicitar acesso
                          </Button>
                        )}
                      </div>
                    </div>
                  ),
                }
              : undefined
          }
        />
      </Card>
    </div>
  );
}
