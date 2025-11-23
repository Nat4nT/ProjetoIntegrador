import { useEffect, useState } from "react";

//componentes antd
import { Card, Typography, Table, Button, Space, Grid } from "antd";

import type { ColumnsType } from "antd/es/table";

//data
import dayjs from "dayjs";

//api
import { buscarPacientes } from "../../../services/apiInterna/buscarPacientes";

//interface
import type { PacienteRow } from "../../../services/interfaces/Interfaces";

//componentes
import { showMessage } from "../../../components/messageHelper/ShowMessage";
import { maskCPF } from "../../../utils/Masks";
import { useNavigate } from "react-router-dom";
import { StatusAcesso } from "../../../utils/Enum";

import "./MeusPacientes.scss";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<PacienteRow[]>([]);

  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.xl;

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
            <div className="container-buttons-paciente-ativo">
              <Button
                className="button-ver-exames"
                size="small"
                type="primary"
                onClick={() =>
                  navigate(`/exames/paciente/${record.key}/${record.nome}`)
                }
              >
                Ver exames
              </Button>
              <Button
                className="button-cancelar-acesso-paciente"
                size="small"
                danger
                onClick={() =>
                  navigate(`/exames/paciente/${record.key}/${record.nome}`)
                }
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
          const nome =
            `${s.primeiro_nome ?? ""} ${s.ultimo_nome ?? ""}`.trim() ||
            "Médico";
          const cpf = maskCPF(s.cpf);

          return {
            key: s.paciente_id,
            nome,
            especialidade: s.especialidade ?? "Não informado",
            dataNascimento: dayjs(s.data_nascimento).format("DD/MM/YYYY"),
            cpf,
            autorizadoEm: s.data_atualizacao
              ? dayjs(s.data_atualizacao).format("DD/MM/YYYY")
              : "",
            status: s.status,
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
                        {record.autorizadoEm}
                      </div>
                      <Space wrap>
                        <Button
                          className="button-ver-exames"
                          size="small"
                          type="primary"
                          onClick={() =>
                            navigate(
                              `/exames/paciente/${record.key}/${record.nome}`
                            )
                          }
                        >
                          Ver exames
                        </Button>

                        <Button
                          className="button-cancelar-acesso-paciente"
                          size="small"
                          danger
                          onClick={() =>
                            navigate(
                              `/exames/paciente/${record.key}/${record.nome}`
                            )
                          }
                        >
                          Cancelar acesso
                        </Button>
                      </Space>
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
