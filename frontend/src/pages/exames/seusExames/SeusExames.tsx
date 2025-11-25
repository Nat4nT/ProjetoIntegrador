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
  Dropdown,
  Input,
} from "antd";
import { PlusCircleOutlined, MoreOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

//data
import dayjs, { Dayjs } from "dayjs";

//api
import {
  buscarExames,
  deletarExame,
} from "../../../services/apiInterna/Exames";
import {
  buscarCategoria,
  deletarCategoria,
  editarCategoria,
} from "../../../services/apiInterna/Categorias";

//interface
import type {
  ComentarioExame,
  ExameRow,
} from "../../../services/interfaces/Interfaces";

//validações
import { showMessage } from "../../../components/messageHelper/ShowMessage";

//modals
import CadatrarCategoria from "../../../components/modals/cadastrarCategoria/CadastrarCategoria";
import AvisoExclusaoModal from "../../../components/modals/avisoExclusão/AvisoExclusao";
import VisualizarExameModal from "../../../components/modals/visualizarExame/VisualizarExameModal";

import { useParams } from "react-router-dom";
import {
  buscarCategoriasPaciente,
  buscarExamesPaciente,
} from "../../../services/apiInterna/buscarPacientes";

import "./SeusExames.scss";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

type CategoriaOption = {
  value: string;
  label: string;
  podeEditar: boolean;
};

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [openModalAvisoExclusao, setOpenModalAvisoExclusao] = useState(false);
  const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
  const [openModalCadastrarCategoria, setModalCadastrarCategoria] =
    useState(false);

  const [rows, setRows] = useState<ExameRow[]>([]);
  const [cat, setCat] = useState<CategoriaOption[]>([]);
  const [tab, setTab] = useState<string>("Todos");

  const [exameSelecionadoId, setExameSelecionadoId] = useState<string | null>(
    null
  );
  const [periodo, setPeriodo] = useState<[Dayjs, Dayjs] | null>(null);
  const [exameVisualizar, setExameVisualizar] = useState<ExameRow | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | undefined>();

  const [editingCategoriaId, setEditingCategoriaId] = useState<string | null>(
    null
  );
  const [editingNome, setEditingNome] = useState("");

  const screens = useBreakpoint();
  const isMobile = !screens.xl;

  const { pacienteId } = useParams();
  const { nome } = useParams();
  const tipoUsuario = localStorage.getItem("tipo_usuario");

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

  // EXCLUIR CATEGORIA
  async function handleExcluirCategoria(categoriaId: string) {
    try {
      await deletarCategoria({ categoria_id: categoriaId });

      showMessage("Categoria excluída com sucesso.", "success");
      setCat((prev) => prev.filter((c) => c.value !== categoriaId));
      setTab((prevTab) => (prevTab === categoriaId ? "Todos" : prevTab));

      setCategoriaFiltro((prev) => (prev === categoriaId ? undefined : prev));
    } catch (err: any) {
      showMessage("Erro ao excluir categoria.", "error");
    }
  }

  // INICIAR EDIÇÃO INLINE DE CATEGORIA
  function startEditarCategoria(categoriaId: string, nomeAtual: string) {
    setTimeout(() => {
      setEditingCategoriaId(categoriaId);
      setEditingNome(nomeAtual);
    }, 0);
  }

  // SALVAR EDIÇÃO INLINE DE CATEGORIA (apenas no Enter)
  async function salvarCategoriaEditada() {
    if (!editingCategoriaId) return;
    const nomeTrim = editingNome.trim();
    if (!nomeTrim) {
      showMessage("O nome da categoria não pode ser vazio.", "warning");
      setEditingCategoriaId(null);
      setEditingNome("");
      return;
    }

    try {
      await editarCategoria({
        categoria_id: editingCategoriaId,
        nome: nomeTrim,
      });

      setCat((prev) =>
        prev.map((c) =>
          c.value === editingCategoriaId ? { ...c, label: nomeTrim } : c
        )
      );

      showMessage("Categoria atualizada com sucesso.", "success");
    } catch (err: any) {
      showMessage("Erro ao atualizar categoria.", "error");
    } finally {
      setEditingCategoriaId(null);
      setEditingNome("");
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
      ...cat.map((c) => ({
        key: c.value,
        label: (
          <div className="tab-categoria-label">
            {editingCategoriaId === c.value ? (
              <Input
                size="small"
                value={editingNome}
                autoFocus
                onChange={(e) => setEditingNome(e.target.value)}
                onPressEnter={salvarCategoriaEditada}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingCategoriaId(null);
                    setEditingNome("");
                  }
                }}
                style={{ maxWidth: 140 }}
              />
            ) : (
              <>
                <span>{c.label}</span>
                {tipoUsuario === "paciente" && c.podeEditar && (
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        { key: "editar", label: "Editar" },
                        { key: "excluir", label: "Excluir", danger: true },
                      ],
                      onClick: ({ key }) => {
                        if (key === "editar") {
                          startEditarCategoria(c.value, c.label);
                        }
                        if (key === "excluir") {
                          handleExcluirCategoria(c.value);
                        }
                      },
                    }}
                  >
                    <Button
                      type="text"
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreOutlined />
                    </Button>
                  </Dropdown>
                )}
              </>
            )}
          </div>
        ),
      })),
    ],
    [cat, tipoUsuario, editingCategoriaId, editingNome]
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
            className="button-ver-exame"
            type="primary"
            onClick={() => verExame(record)}
            disabled={!record.url}
          >
            Ver exame
          </Button>
          <Button
            danger
            style={{ borderColor: "#ef4444", color: "#ef4444" }}
            hidden={tipoUsuario === "medico"}
            onClick={() => {
              setExameSelecionadoId(String(record.key));
              setOpenModalAvisoExclusao(true);
            }}
          >
            Deletar
          </Button>
        </Space>
      ),
    },
  ];

  // RESPONSÁVEL POR ATUALIZAR OS COMENTÁRIOS NO MODAL SEM PRECISAR RECARREGAR A PÁGINA.
  const handleComentarioCriado = (
    exameId: string,
    comentario: ComentarioExame
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.key === exameId
          ? {
              ...row,
              comentarios: [...(row.comentarios ?? []), comentario],
            }
          : row
      )
    );
    setExameVisualizar((prev) =>
      prev && prev.key === exameId
        ? {
            ...prev,
            comentarios: [...(prev.comentarios ?? []), comentario],
          }
        : prev
    );
  };

  const handleComentarioEditado = (
    exameId: string,
    comentarioEditado: ComentarioExame
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.key === exameId
          ? {
              ...row,
              comentarios: (row.comentarios ?? []).map((c) =>
                c.comentario_exame_id === comentarioEditado.comentario_exame_id
                  ? { ...c, ...comentarioEditado }
                  : c
              ),
            }
          : row
      )
    );

    setExameVisualizar((prev) =>
      prev && prev.key === exameId
        ? {
            ...prev,
            comentarios: (prev.comentarios ?? []).map((c) =>
              c.comentario_exame_id === comentarioEditado.comentario_exame_id
                ? { ...c, ...comentarioEditado }
                : c
            ),
          }
        : prev
    );
  };

  const handleComentarioDeletado = (exameId: string, comentarioId: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.key === exameId
          ? {
              ...row,
              comentarios: (row.comentarios ?? []).filter(
                (c) => c.comentario_exame_id !== comentarioId
              ),
            }
          : row
      )
    );

    setExameVisualizar((prev) =>
      prev && prev.key === exameId
        ? {
            ...prev,
            comentarios: (prev.comentarios ?? []).filter(
              (c) => c.comentario_exame_id !== comentarioId
            ),
          }
        : prev
    );
  };

  //FUNÇÃO RESPONSÁVEL PARA CARREGAR OS EXAMES COM BASE NO TIPO DE USUÁRIO.
  useEffect(() => {
    async function carregarExames() {
      try {
        setLoading(true);

        let data: any[] = [];

        if (tipoUsuario === "medico" && pacienteId) {
          const resp = await buscarExamesPaciente({ paciente_id: pacienteId });
          data = resp.data || [];

          const mapped: ExameRow[] = data.map((it: any) => {
            const e = it.exame;
            const d = dayjs(e.data_realizacao);

            return {
              key: String(e.exame_id),
              exame: e.nome_exame,
              categoria: e.categoria?.[0]?.nome ?? "Todos",
              categoriaId: e.categoria?.[0]?.categoria_id,
              dataRealizacao: d.isValid()
                ? d.format("DD/MM/YYYY")
                : e.data_realizacao,
              rawDate: e.data_realizacao,
              local: e.nome_lab,
              url: e.arquivo_exame,
              comentarios: e.comentario ?? [],
            };
          });

          setRows(mapped);
        } else {
          const resp = await buscarExames();
          data = resp.data || [];

          const mapped: ExameRow[] = data.map((it: any) => {
            const e = it.exame;
            const d = dayjs(e.data_realizacao);

            return {
              key: String(e.exame_id),
              exame: e.nome_exame,
              categoria: e.categoria?.[0]?.nome ?? "Todos",
              categoriaId: e.categoria?.[0]?.categoria_id,
              dataRealizacao: d.isValid()
                ? d.format("DD/MM/YYYY")
                : e.data_realizacao,
              rawDate: e.data_realizacao,
              local: e.nome_lab,
              url: e.arquivo_exame,
              comentarios: e.comentario ?? [],
            };
          });

          setRows(mapped);
        }
      } finally {
        setLoading(false);
      }
    }
    carregarExames();
  }, [tipoUsuario, pacienteId]);

  // CARREGAR CATEGORIAS (inicial)
  useEffect(() => {
    async function carregarCategoriasInicial() {
      try {
        setLoading(true);
        if (tipoUsuario === "medico" && pacienteId) {
          const categoriasMedicoView = await buscarCategoriasPaciente({
            paciente_id: pacienteId,
          });
          const invertida = [...categoriasMedicoView.data].reverse();
          setCat(
            invertida.map((e: any) => ({
              value: String(e.categoria_id),
              label: e.nome,
              podeEditar: e.sis_cat === 0,
            }))
          );
        } else {
          const categorias = await buscarCategoria();
          setCat(
            categorias.data.map((e: any) => ({
              value: String(e.categoria_id ?? e.id),
              label: e.nome ?? e.nome_categoria,
              podeEditar: e.sis_cat === 0,
            }))
          );
        }
      } catch (err: any) {
        showMessage("Erro ao carregar categorias.", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarCategoriasInicial();
  }, []);

  // CARREGAR CATEGORIAS (para onSuccess do modal)
  async function carregarCategorias() {
    try {
      setLoading(true);

      const resp = await buscarCategoria();
      const data = Array.isArray(resp?.data) ? resp.data : [];

      const invertida = [...data].reverse();

      setCat(
        invertida.map((e: any) => ({
          value: String(e.categoria_id ?? e.id),
          label: e.nome ?? e.nome_categoria,
          podeEditar: e.sis_cat === 0,
        }))
      );
    } catch (err: any) {
      showMessage("Erro ao carregar categorias.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tipoUsuario === "paciente") {
      carregarCategorias();
    }
  }, [tipoUsuario]);

  return (
    <div>
      <Card>
        <Title>
          {tipoUsuario === "medico" ? "Exames do " + nome : "Seus Exames"}
        </Title>
        <Paragraph className="descricao-pages">
          Use as categorias acima da tabela para filtrar os resultados. Você
          pode usar filtros como categoria e data.
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
              hidden={tipoUsuario === "medico"}
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
                            size="small"
                            className="button-ver-exame"
                            type="primary"
                            onClick={() => verExame(record)}
                            disabled={!record.url}
                          >
                            Ver exame
                          </Button>
                          <Button
                            danger
                            size="small"
                            hidden={tipoUsuario === "medico"}
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
        tituloModal={"Excluir exame"}
        fraseUmModal={"Tem certeza de que deseja excluir o exame?"}
        fraseDoiModal={"Esta ação é irreversível."}
      />
      <VisualizarExameModal
        open={openModalVisualizar}
        onClose={closeModalVisualizar}
        onComentarioCriado={handleComentarioCriado}
        onComentarioDeletado={handleComentarioDeletado}
        onComentarioEditado={handleComentarioEditado}
        exame={exameVisualizar}
        tipoUsuario={
          tipoUsuario === "paciente" || tipoUsuario === "medico"
            ? tipoUsuario
            : null
        }
      />
    </div>
  );
}
