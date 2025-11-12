import { useEffect, useMemo, useState } from "react";

//componentes antd
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Select,
  DatePicker,
  Tabs,
  type TabsProps,
  Grid,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

//data
import dayjs, { Dayjs } from "dayjs";

//api
import {
  buscarExames,
  deletarExame,
} from "../../../services/apiInterna/Exames";
import { buscarCategoria } from "../../../services/apiInterna/Categorias";

//interface
import type { ExameRow } from "../../../services/interfaces/Interfaces";

//validações
import { showMessage } from "../../../components/messageHelper/ShowMessage";

//modals
import CadatrarCategoria from "../../../components/modals/cadastrarCategoria/CadastrarCategoria";
import AvisoExclusaoModal from "../../../components/modals/avisoExclusão/AvisoExclusao";
import VisualizarExameModal from "../../../components/modals/visualizarExame/VisualizarExameModal";

import "./SeusExames.scss";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [openModalAvisoExclusao, setOpenModalAvisoExclusao] = useState(false);
  const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
  const [openModalCadastrarCategoria, setModalCadastrarCategoria] =
    useState(false);

  const [rows, setRows] = useState<ExameRow[]>([]);
  const [cat, setCat] = useState<{ value: string; label: string }[]>([]);
  const [tab, setTab] = useState<string>("Todos");

  const [exameSelecionadoId, setExameSelecionadoId] = useState<string | null>(
    null
  );
  const [periodo, setPeriodo] = useState<[Dayjs, Dayjs] | null>(null);
  const [exameVisualizar, setExameVisualizar] = useState<ExameRow | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | undefined>();

  const screens = useBreakpoint();
  const isMobile = !screens.xl;

  const closeModalCadastrarCat = () => {
    setModalCadastrarCategoria(false);
  };

  const closeModalAvisoExclusao = () => {
    setOpenModalAvisoExclusao(false);
  };

  // AO CLICAR EM VER EXAME
  function verExame(record: ExameRow) {
    if (!record.url) return;
    setExameVisualizar(record);
    setOpenModalVisualizar(true);
  }

  const closeModalVisualizar = () => {
    setOpenModalVisualizar(false);
    setExameVisualizar(null);
  };

  // FUNÇÃO PARA DELETAR EXAME
  async function excluirExameSelecionado() {
    if (!exameSelecionadoId) return;

    try {
      const payload = {
        exame_id: exameSelecionadoId,
      };

      await deletarExame(payload);

      showMessage("Exame deletado com sucesso.", "success");

      setRows((prev) => prev.filter((r) => r.key !== exameSelecionadoId));

      setOpenModalAvisoExclusao(false);
      setExameSelecionadoId(null);
    } catch (err: any) {
      showMessage("Erro ao deletar exame.", "error");
    }
  }

  // FILTROS
  const dataFiltrada = useMemo(() => {
    let arr = [...rows];

    if (tab !== "Todos") {
      const id = parseInt(tab, 10);
      if (!Number.isNaN(id)) {
        arr = arr.filter((r) => r.categoriaId === id);
      }
    }

    if (categoriaFiltro) {
      const id = parseInt(categoriaFiltro, 10);
      if (!Number.isNaN(id)) {
        arr = arr.filter((r) => r.categoriaId === id);
      }
    }

    if (periodo) {
      const [ini, fim] = periodo;
      arr = arr.filter((r) => {
        const d = dayjs(r.rawDate);
        return (
          d.isValid() &&
          d.isAfter(ini.startOf("day")) &&
          d.isBefore(fim.endOf("day"))
        );
      });
    }

    return arr;
  }, [rows, tab, categoriaFiltro, periodo]);

  // ARRAY PARA OS TABS ITENS
  const tabItems: TabsProps["items"] = useMemo(
    () => [
      { key: "Todos", label: "Todos" },
      ...cat.map((c) => ({ key: c.value, label: c.label })),
    ],
    [cat]
  );

  //COLUNAS TABELA
  const colunas: ColumnsType<ExameRow> = [
    {
      title: "Exame",
      dataIndex: "exame",
      key: "exame",
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      responsive: ["md"],
    },
    {
      title: "Data realização",
      dataIndex: "dataRealizacao",
      key: "dataRealizacao",
      responsive: ["sm"],
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
    },
    { title: "Local", dataIndex: "local", key: "local", responsive: ["xl"] },
    {
      title: "Ações",
      key: "acoes",
      responsive: ["xl"],
      render: (_, record) => (
        <Space>
          <Button
            danger
            style={{ borderColor: "#ef4444", color: "#ef4444" }}
            onClick={() => {
              setExameSelecionadoId(String(record.key));
              setOpenModalAvisoExclusao(true);
            }}
          >
            Deletar
          </Button>
          <Button
            className="button-ver-exame"
            type="primary"
            onClick={() => verExame(record)}
            disabled={!record.url}
          >
            Ver exame
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    async function carregarExames() {
      try {
        setLoading(true);
        const resp = await buscarExames();
        const data = resp.data || [];
        const mapped: ExameRow[] = data.map((it: any) => {
          const catNome = it.nome;
          const url = it.arquivo_exame;
          const d = dayjs(it.data_realizacao);
          return {
            key: String(it.exame_id),
            exame: it.nome_exame || it.nome,
            categoria: catNome,
            dataRealizacao: d.isValid()
              ? d.format("DD/MM/YYYY")
              : it.data_realizacao,
            local: it.nome_lab,
            url,
            categoriaId: it.categoria_id,
            rawDate: it.data_realizacao,
          };
        });
        setRows(mapped);
      } finally {
        setLoading(false);
      }
    }
    carregarExames();
  }, []);

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

  async function carregarCategorias() {
    try {
      setLoading(true);

      const resp = await buscarCategoria();
      const data = Array.isArray(resp?.data) ? resp.data : [];
      
      const invertida = [...data].reverse();

      setCat(
        invertida.map((e: any) => ({
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

  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <div>
      <Card>
        <Title>Seus Exames</Title>
        <Paragraph>
          Use as categorias acima da tabela para filtrar os resultados. Você
          pode buscar por nome, status e período.
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
        >
          <div className="container-categoria">
            <Tabs
              defaultActiveKey="Todos"
              items={tabItems}
              onChange={(k) => setTab(k)}
            />
            <PlusCircleOutlined
              onClick={() => setModalCadastrarCategoria(true)}
            />
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Select
              placeholder="Categoria"
              style={{ width: 200 }}
              options={cat}
              onChange={(v) => setCategoriaFiltro(v)}
              allowClear
            />
            <RangePicker
              placeholder={["Data inicial", "Data final"]}
              onChange={(v) => setPeriodo(v as any)}
              format="DD/MM/YYYY"
            />
          </div>
        </div>

        <Table
          rowKey="key"
          columns={colunas}
          dataSource={dataFiltrada}
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
                        <strong>Categoria: </strong>
                        {record.categoria || "-"}
                      </div>
                      <div>
                        <strong>Data realização: </strong>
                        {record.dataRealizacao || "-"}
                      </div>
                      <div>
                        <strong>Local: </strong>
                        {record.local || "-"}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Space>
                          <Button
                            danger
                            size="small"
                            style={{
                              borderColor: "#ef4444",
                              color: "#ef4444",
                            }}
                            onClick={() => {
                              setExameSelecionadoId(String(record.key));
                              setOpenModalAvisoExclusao(true);
                            }}
                          >
                            Deletar
                          </Button>
                          <Button
                            size="small"
                            className="button-ver-exame"
                            type="primary"
                            onClick={() => verExame(record)}
                            disabled={!record.url}
                          >
                            Ver exame
                          </Button>
                        </Space>
                      </div>
                    </div>
                  ),
                }
              : undefined
          }
        />
      </Card>
      <CadatrarCategoria
        open={openModalCadastrarCategoria}
        onClose={() => closeModalCadastrarCat()}
        onSuccess={carregarCategorias}
      />
      <AvisoExclusaoModal
        onClose={closeModalAvisoExclusao}
        open={openModalAvisoExclusao}
        onSubmit={excluirExameSelecionado}
      />
      <VisualizarExameModal
        open={openModalVisualizar}
        onClose={closeModalVisualizar}
        exame={exameVisualizar}
      />
    </div>
  );
}
