import { useEffect, useState } from "react";

//componentes antd
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Typography,
  Upload,
  Button,
  Space,
  Select,
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";

//data
import dayjs from "dayjs";

//validações
import { showMessage } from "../../../components/messageHelper/ShowMessage";

//api
import { adicionarExame } from "../../../services/apiInterna/Exames";
import { buscarCategoria } from "../../../services/apiInterna/Categorias";

import "./CadastrarExames.scss";

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errarArquivoEmpty, setErrorArquivoEmpty] = useState("");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [cat, setCat] = useState<{ value: string; label: string }[]>([]);

  // VALIDAR ARQUIVO
  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isAllowedType = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ].includes(file.type);
    if (!isAllowedType) {
      setErrorArquivoEmpty("Formato inválido. Envie PDF, PNG ou JPG/JPEG.");

      return Upload.LIST_IGNORE;
    }
    const isLt15M = file.size / 1024 / 1024 <= 15;
    if (!isLt15M) {
      setErrorArquivoEmpty("Arquivo maior que 15MB.");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newList }) => {
    setFileList(newList);
    if (newList.length > 0) setErrorArquivoEmpty("");
  };

  // LIMPAR FORM
  const handleClear = () => {
    form.resetFields();
    setFileList([]);
    setErrorArquivoEmpty("");
  };

  // ENVIAR FORM
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (fileList.length === 0) {
        setErrorArquivoEmpty("Selecione ao menos um arquivo.");
        return;
      }

      const file = fileList[0]?.originFileObj as File | undefined;
      if (!file) {
        setErrorArquivoEmpty("Falha ao ler o arquivo. Tente novamente.");
        return;
      }

      setSubmitting(true);

      await adicionarExame({
        nome_exame: values.exame,
        nome_lab: values.local,
        data_realizacao: values.dataRealizacao.format("YYYY-MM-DD"),
        categorias: values.categorias,
        arquivo_exame: file,
      });

      showMessage("Exame(s) enviado(s) com sucesso!", "success");
      handleClear();
    } catch (err: any) {
      if (err?.errorFields) return;
      showMessage(
        err?.message || "Não foi possível enviar. Tente novamente.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // CARREGAR CATEGORIAS
  useEffect(() => {
    async function carregarCategorias() {
      try {
        setLoading(true);
        const categorias = await buscarCategoria();
        setCat(
          categorias.data.map((e: any) => ({
            value: String(e.id ?? e.categoria_id),
            label: e.nome ?? e.nome_categoria,
          }))
        );
      } catch (err: any) {
        showMessage("Erro ao carregar categorias.", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarCategorias();
  }, []);

  return (
    <div>
      <Card>
        <Title>Cadastrar Exame</Title>
        <Paragraph>
          Utilize esse formulário para anexar um novo exame ao seu perfil.
        </Paragraph>
      </Card>

      <Card style={{ marginTop: 16 }} loading={loading}>
        <Form form={form} layout="vertical" labelWrap>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Exame"
                name="exame"
                rules={[{ required: true, message: "Informe o nome do exame" }]}
              >
                <Input placeholder="Digite para buscar ou adicionar" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Categorias"
                name="categorias"
                rules={[
                  {
                    required: true,
                    message: "Selecione ao menos uma categoria",
                  },
                ]}
              >
                <Select
                  placeholder="Selecione"
                  allowClear
                  showSearch
                  mode="multiple"
                  options={cat}
                  filterOption={(input, option) =>
                    (option?.label as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Local"
                name="local"
                rules={[{ required: true, message: "Informe o local" }]}
              >
                <Input placeholder="Ex: Clínica Unimed / Laboratório Master" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Data realização"
                name="dataRealizacao"
                rules={[
                  { required: true, message: "Informe a data de realização" },
                ]}
              >
                <DatePicker
                  placeholder="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current &&
                    (current > dayjs().endOf("day") ||
                      current < dayjs("1900-01-01"))
                  }
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Arquivo do exame (PDF, PNG, JPG/JPEG)" required>
                <Dragger
                  multiple={false}
                  maxCount={1} // limita e um arquivo
                  accept=".pdf,.png,.jpg,.jpeg"
                  beforeUpload={beforeUpload}
                  onChange={onChange}
                  fileList={fileList}
                  itemRender={(originNode) => originNode}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Clique ou arraste o arquivo para esta área
                  </p>
                  <p className="ant-upload-hint">
                    Aceita PDF, PNG, JPG/JPEG (max. 15MB)
                  </p>
                </Dragger>
              </Form.Item>
              <p style={{ color: "red" }}>
                {errarArquivoEmpty && errarArquivoEmpty}
              </p>
            </Col>

            <Col span={24}>
              <Space>
                <Button
                  onClick={handleClear}
                  danger
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                >
                  Limpar
                </Button>
                <Button
                  className="button-enviar-exame"
                  type="primary"
                  onClick={handleSubmit}
                  loading={submitting}
                >
                  Enviar
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
