import { useState } from "react";

//compontes antd
import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Typography,
  Form,
  Grid,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

//apis
import {
  buscarPaciente,
  solicitarAcesso,
} from "../../../services/apiInterna/buscarPacientes";

//interfaces
import type { PacienteRow } from "../../../services/interfaces/Interfaces";

//validações
import { showMessage } from "../../../components/messageHelper/ShowMessage";
import { maskCPF, onlyDigits } from "../../../utils/Masks";
import { isValidCPF } from "../../../utils/Utilidades";

import "./BuscarPaciente.scss";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function BuscarPaciente() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<PacienteRow[]>([]);

  const screens = useBreakpoint();
  const isMobile = !screens.xl;

  //FUNÇÃO PARA BUSCAR USUÁRIO PACIENTE
  const handleBuscar = async (values: { cpf: string }) => {
    setLoading(true);
    try {
      const cpfLimpo = values.cpf.replace(/\D/g, "");
      const payload = {
        user: cpfLimpo,
      };

      const resp = await buscarPaciente(payload);
      const usuario = resp?.data;

      if (!usuario) {
        setUsuario([]);
        showMessage("Paciente não encontrado.", "warning");
        return;
      }

      const nomeCompleto = `${usuario.primeiro_nome || ""} ${
        usuario.ultimo_nome || ""
      }`.trim();

      const row: PacienteRow = {
        key: usuario.paciente_id || usuario.usuario_id,
        nome: nomeCompleto || "Paciente",
        cpf: maskCPF(usuario.cpf),
        dataNascimento: dayjs(usuario.data_nascimento).isValid()
          ? dayjs(usuario.data_nascimento).format("DD/MM/YYYY")
          : usuario.data_nascimento,
        rawDate: usuario.data_nascimento,
        solicitacao_id: usuario.solicitacao_id,
      };

      setUsuario([row]);
    } catch (err: any) {
      const msg = err?.message;
      if (msg === "Perfil não encontrado") {
        showMessage("Paciente não encontrado.", "warning");
        setUsuario([]);
      } else {
        showMessage("Erro ao buscar paciente", "error");
        console.error(err);
      }
    } finally {
      setLoading(false);
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
      responsive: ["sm"],
    },
    {
      title: "Ações",
      key: "acoes",
      responsive: ["xl"],
      render: (_, record) => (
        <Space>
          <Button
            className="button-solicitar-acesso"
            size="small"
            type="primary"
            onClick={() => handleSolicitarAcesso(record.key)}
          >
            Solicitar Acesso
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title>Buscar paciente</Title>
        <Paragraph className="descricao-pages">
          Digite o CPF para localizar um paciente e solicitar acesso ao seu
          perfil.
        </Paragraph>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleBuscar}
          className="container-buscar-paciente"
        >
          <div className="buscar-paciente-row">
            <div className="cpf-field">
              <Form.Item
                label="CPF"
                name="cpf"
                normalize={maskCPF}
                validateTrigger={["onBlur", "onSubmit"]}
                rules={[
                  { required: true, message: "Informe o CPF" },
                  {
                    validator: (_, value) => {
                      const digits = onlyDigits(value || "");
                      if (!digits) return Promise.resolve();
                      if (digits.length !== 11) {
                        return Promise.reject("CPF deve conter 11 dígitos.");
                      }
                      if (!isValidCPF(digits)) {
                        return Promise.reject("CPF inválido.");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Ex: 000.000.000-00"
                  maxLength={14}
                  className="input-buscar-paciente"
                />
              </Form.Item>
            </div>
            <Form.Item className="buscar-btn-item">
              <Button
                className="button-buscar-paciente"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Buscar
              </Button>
            </Form.Item>
          </div>
        </Form>
        <Table
          style={{ marginTop: 16 }}
          rowKey="key"
          columns={colunas}
          dataSource={usuario}
          loading={loading}
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
                        <Button
                          className="button-solicitar-acesso"
                          size="small"
                          type="primary"
                          onClick={() => handleSolicitarAcesso(record.key)}
                        >
                          Solicitar Acesso
                        </Button>
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
