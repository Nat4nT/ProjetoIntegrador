import { useEffect, useState } from "react";

//componentes antd
import { Card, Typography, Table, Button, Space } from "antd";

import type { ColumnsType } from "antd/es/table";

//data
import dayjs, { Dayjs } from "dayjs";

//api
import { buscarCategoria } from "../../../services/apiInterna/Categorias";

//interface
import type { PacienteRow } from "../../../services/interfaces/Interfaces";

//componentes
import { showMessage } from "../../../components/messageHelper/ShowMessage";

const { Title, Paragraph } = Typography;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);

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
            onClick={() => {}}
          >
            Solicitar Acesso
          </Button>
        </Space>
      ),
    },
  ];

  // CARREGAR PACIENTES OBS: AINDA NÃO TEM
  // useEffect(() => {
  //   async function carregarMedicos() {
  //     try {
  //       setLoading(true);
  //       const categorias = await buscarCategoria();
  //     } catch (err: any) {
  //       showMessage("Erro ao carregar categorias.", "error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   carregarMedicos();
  // }, []);

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
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
