import { useEffect, useState } from "react";

//componentes antd
import { Card, Typography, Table, Button, Space } from "antd";

import type { ColumnsType } from "antd/es/table";

//data
import dayjs, { Dayjs } from "dayjs";

//api
import {
  buscarPacientes,
} from "../../../services/apiInterna/buscarPacientes";

//interface
import type { PacienteRow } from "../../../services/interfaces/Interfaces";

//componentes
import { showMessage } from "../../../components/messageHelper/ShowMessage";
import { maskCPF } from "../../../utils/Masks";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<PacienteRow[]>([]);

  const navigate = useNavigate();

  const colunas: ColumnsType<PacienteRow> = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "CPF", dataIndex: "cpf", key: "cpf" },
    {
      title: "Data de nascimento",
      dataIndex: "dataNascimento",
      key: "dataNascimento",
      sorter: (a, b) =>
        dayjs(a.dataNascimento).valueOf() - dayjs(b.dataNascimento).valueOf(),
      defaultSortOrder: "ascend",
    },
    {
      title: "Autorizado em",
      dataIndex: "autorizadoEm",
      key: "autorizadoEm",
      sorter: (a, b) =>
        dayjs(a.autorizadoEm).valueOf() - dayjs(b.autorizadoEm).valueOf(),
      defaultSortOrder: "ascend",
    },

    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Button
            className="button-solicitar-acesso"
            size="small"
            type="primary"
            onClick={() => navigate(`/exames/paciente/${record.key}/${record.nome}`)}
          >
            Ver exames
          </Button>
        </Space>
      ),
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
            cpf,
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
        <Paragraph>
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
        />
      </Card>
    </div>
  );
}
