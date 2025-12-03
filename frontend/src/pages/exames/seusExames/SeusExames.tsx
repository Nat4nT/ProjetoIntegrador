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
  Form,
  type TabsProps,
  Grid,
  Dropdown,
  Input,
  Upload,
  Modal,
  Row,
  Col,
  Avatar,
  Tag,
} from "antd";
import {
  PlusCircleOutlined,
  MoreOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

//data
import dayjs, { Dayjs } from "dayjs";

//api
import {
  buscarExames,
  deletarExame,
  editarExame,
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
  PacienteRow,
} from "../../../services/interfaces/Interfaces";

//validações
import { showMessage } from "../../../components/messageHelper/ShowMessage";

//modals
import CadatrarCategoria from "../../../components/modals/cadastrarCategoria/CadastrarCategoria";
import AvisoExclusaoModal from "../../../components/modals/avisoExclusão/AvisoExclusao";
import VisualizarExameModal from "../../../components/modals/visualizarExame/VisualizarExameModal";

import { useLocation } from "react-router-dom";
import {
  buscarCategoriasPaciente,
  buscarExamesPaciente,
} from "../../../services/apiInterna/buscarPacientes";

import "./SeusExames.scss";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;
const { Dragger } = Upload;

type CategoriaOption = {
  value: string;
  label: string;
  podeEditar: boolean;
};

export default function SeusExames() {
  const [loading, setLoading] = useState(false);
  const [loadingEditarExame, setLoadingEditarExame] = useState(false);
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
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [exameEditando, setExameEditando] = useState<ExameRow | null>(null);
  const [editForm] = Form.useForm();

  const [categoriaFiltro, setCategoriaFiltro] = useState<string | undefined>();

  const [editingCategoriaId, setEditingCategoriaId] = useState<string | null>(
    null
  );
  const [editingNome, setEditingNome] = useState("");

  const screens = useBreakpoint();
  const isMobile = !screens.xl;

  const location = useLocation();
  const pacienteInfo = (location.state as { paciente?: PacienteRow } | null)
    ?.paciente;

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
    if (tipoUsuario === "paciente" && record.ultimaDataComentario) {
      setLastSeenComment(String(record.key), record.ultimaDataComentario);

      setRows((prev) =>
        prev.map((row) =>
          row.key === record.key ? { ...row, hasNewComment: false } : row
        )
      );
    }

    setExameVisualizar(record);
    setOpenModalVisualizar(true);
  }

  const closeModalVisualizar = () => {
    setOpenModalVisualizar(false);
    setExameVisualizar(null);
  };

  const ULTIMA_VEZ_QUE_VIU_COMENTARIOS_KEY = "medexame:lastSeenComments";

  type LastSeenCommentsMap = Record<string, string>;

  const getLastSeenComments = (): LastSeenCommentsMap => {
    try {
      const raw = localStorage.getItem(ULTIMA_VEZ_QUE_VIU_COMENTARIOS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const setLastSeenComment = (examId: string, date: string) => {
    try {
      const current = getLastSeenComments();
      current[examId] = date;
      localStorage.setItem(
        ULTIMA_VEZ_QUE_VIU_COMENTARIOS_KEY,
        JSON.stringify(current)
      );
    } catch {}
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

  // SALVAR EDIÇÃO INLINE DE CATEGORIA
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

  // PARA POPULAR CAMPO CATEGORIAS NO EDITAR.
  const getCategoriaLabelFromValue = (value: string | string[]): string => {
    const values = Array.isArray(value) ? value : [value];
    const labels = cat
      .filter((c) => values.includes(c.value))
      .map((c) => c.label);
    return labels.join(", ");
  };

  const handleAbrirModalEditar = (exame: ExameRow) => {
    setExameEditando(exame);

    editForm.setFieldsValue({
      exame: exame.exame,
      local: exame.local,
      dataRealizacao: dayjs(exame.rawDate),
      categorias: [String(exame.categoriaId)],
    });

    setOpenModalEditar(true);
  };

  const handleFecharModalEditar = () => {
    setOpenModalEditar(false);
    setExameEditando(null);
    editForm.resetFields();
  };

  // FUNÇÃO PARA EDITAR EXAME
  const handleSalvarEdicao = async () => {
    if (!exameEditando) return;

    try {
      setLoadingEditarExame(true);
      const values = await editForm.validateFields();

      const data_realizacao = values.dataRealizacao.format("YYYY-MM-DD");

      const payload = {
        exame_id: exameEditando.key,
        nome_exame: values.exame,
        data_realizacao,
        nome_lab: values.local,
        categorias: values.categorias,
      };

      await editarExame(payload);

      showMessage("Exame atualizado com sucesso.", "success");

      setRows((prev) =>
        prev.map((row) =>
          row.key === exameEditando.key
            ? {
                ...row,
                exame: values.exame,
                local: values.local,
                categoria: getCategoriaLabelFromValue(values.categorias),
                categoriaId: Number(
                  Array.isArray(values.categorias)
                    ? values.categorias[0]
                    : values.categorias
                ),
                dataRealizacao: values.dataRealizacao.format("DD/MM/YYYY"),
                rawDate: data_realizacao,
              }
            : row
        )
      );

      handleFecharModalEditar();
    } catch (err: any) {
      if (err?.errorFields) return;
      showMessage(
        err?.response?.data?.message ||
          "Erro ao atualizar exame. Tente novamente.",
        "error"
      );
    } finally {
      setLoadingEditarExame(false);
    }
  };

  //COLUNAS TABELA
  const colunas: ColumnsType<ExameRow> = [
    {
      title: "Exame",
      dataIndex: "exame",
      key: "exame",
      sorter: (a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf(),
      defaultSortOrder: "ascend",
      render: (text, record) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {tipoUsuario === "paciente" && record.hasNewComment && (
            <Tag color="red">Novo comentário</Tag>
          )}
          <span>{text}</span>
        </span>
      ),
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
            hidden={tipoUsuario === "medico"}
            className="button-editar-exame"
            onClick={() => handleAbrirModalEditar(record)}
          >
            Editar
          </Button>

          <Button
            danger
            style={{ borderColor: "#ef4444", color: "#ef4444", height: "28px" }}
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
    const novaDataComentario = comentario.data_criacao;

    setRows((prev) =>
      prev.map((row) => {
        if (row.key !== exameId) return row;

        return {
          ...row,
          comentarios: [...(row.comentarios ?? []), comentario],
          hasNewComment: true,
          ultimaDataComentario: novaDataComentario,
        };
      })
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
        const lastSeenMap = getLastSeenComments();

        const mapExames = (data: any[]): ExameRow[] => {
          return data.map((it: any) => {
            const e = it.exame;
            const d = dayjs(e.data_realizacao);

            const comentarios: ComentarioExame[] = e.comentario ?? [];

            const datasComentarios = comentarios
              .map((c: any) => c.created_at || c.data_criacao || c.criado_em)
              .filter(Boolean);

            const ultimaDataComentario: string | null =
              datasComentarios.length > 0
                ? datasComentarios.sort()[datasComentarios.length - 1]
                : null;

            let hasNewComment = false;

            if (tipoUsuario === "paciente" && ultimaDataComentario) {
              const lastSeen = lastSeenMap[String(e.exame_id)];
              if (!lastSeen) {
                hasNewComment = true;
              } else if (dayjs(ultimaDataComentario).isAfter(dayjs(lastSeen))) {
                hasNewComment = true;
              }
            }

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
              comentarios,
              ultimaDataComentario,
              hasNewComment,
            };
          });
        };

        if (tipoUsuario === "medico" && pacienteInfo?.paciente_id) {
          const resp = await buscarExamesPaciente({
            paciente_id: pacienteInfo.paciente_id,
          });
          data = resp.data || [];
          setRows(mapExames(data));
        } else {
          const resp = await buscarExames();
          data = resp.data || [];
          setRows(mapExames(data));
        }
      } finally {
        setLoading(false);
      }
    }

    carregarExames();
  }, [tipoUsuario, pacienteInfo?.paciente_id]);

  // CARREGAR CATEGORIAS
  useEffect(() => {
    async function carregarCategoriasInicial() {
      try {
        setLoading(true);
        if (tipoUsuario === "medico" && pacienteInfo?.paciente_id) {
          const categoriasMedicoView = await buscarCategoriasPaciente({
            paciente_id: pacienteInfo?.paciente_id,
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

  // CARREGAR CATEGORIAS
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

  const parseCampoLista = (valor?: string): string[] => {
    if (!valor) return [];
    try {
      const parsed = JSON.parse(valor);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [valor];
    }
  };

  const alergiasLista = parseCampoLista(pacienteInfo?.alergias);
  const doencasLista = parseCampoLista(pacienteInfo?.doencas_diagnosticadas);
  const medicacaoLista = parseCampoLista(pacienteInfo?.medicacao);
  const deficienciasLista = parseCampoLista(pacienteInfo?.desc_deficiencia);

  return (
    <div>
      <Card>
        {tipoUsuario === "medico" && pacienteInfo ? (
          <div className="seus-exames-header-right">
            <div className="seus-exames-paciente-top">
              <Avatar
                size={98}
                src={
                  pacienteInfo.imagem_perfil
                    ? `/api${pacienteInfo.imagem_perfil}`
                    : `${pacienteInfo.primeiro_nome[0]} ${pacienteInfo.ultimo_nome[0]}`
                }
                icon={
                  !pacienteInfo.imagem_perfil ? <UserOutlined /> : undefined
                }
              />
              <div className="seus-exames-paciente-ident">
                <div className="seus-exames-paciente-nome">
                  {pacienteInfo.primeiro_nome} {pacienteInfo.ultimo_nome}
                </div>
                <div className="seus-exames-paciente-sub">
                  {pacienteInfo.tipo_sanguineo && (
                    <span>
                      <strong>Tipo sanguíneo:</strong>{" "}
                      {pacienteInfo.tipo_sanguineo ?? "-"}
                    </span>
                  )}
                  {pacienteInfo.altura && (
                    <span>
                      {" "}
                      <strong>Altura:</strong> {pacienteInfo.altura ?? "-"}
                    </span>
                  )}
                  {pacienteInfo.peso && (
                    <span>
                      {" "}
                      <strong>Peso:</strong> {pacienteInfo.peso ?? "-"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="seus-exames-paciente-tags">
              {alergiasLista.length > 0 && (
                <div className="seus-exames-paciente-linha">
                  <strong>Alergias:</strong>{" "}
                  <span>{alergiasLista.join(", ") ?? "Não possui"}</span>
                </div>
              )}
              {doencasLista.length > 0 && (
                <div className="seus-exames-paciente-linha">
                  <strong>Doenças:</strong>{" "}
                  <span>{doencasLista.join(", ") ?? "Não possui"}</span>
                </div>
              )}
              {medicacaoLista.length > 0 && (
                <div className="seus-exames-paciente-linha">
                  <strong>Medicações:</strong>{" "}
                  <span>{medicacaoLista.join(", ") ?? "Não utiliza"}</span>
                </div>
              )}
              {deficienciasLista.length > 0 && (
                <div className="seus-exames-paciente-linha">
                  <strong>Deficiências:</strong>{" "}
                  <span>{deficienciasLista.join(", ") ?? "Não possui"}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="seus-exames-header">
            <div className="seus-exames-header-left">
              <Title>
                {tipoUsuario === "medico" ? "Exames" : "Seus Exames"}
              </Title>
              <Paragraph className="descricao-pages">
                Use as categorias acima da tabela para filtrar os resultados.
                Você pode usar filtros como categoria e data.
              </Paragraph>
            </div>
          </div>
        )}
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
                            className="button-editar-exame"
                            size="small"
                            hidden={tipoUsuario === "medico"}
                            onClick={() => handleAbrirModalEditar(record)}
                          >
                            Editar
                          </Button>

                          <Button
                            danger
                            size="small"
                            hidden={tipoUsuario === "medico"}
                            style={{
                              borderColor: "#ef4444",
                              color: "#ef4444",
                              height: "28px",
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
      <Modal
        open={openModalEditar}
        onCancel={handleFecharModalEditar}
        width={900}
        title="Editar exame"
        confirmLoading={loadingEditarExame}
        destroyOnHidden
        footer={
          <Space style={{ width: "100%", justifyContent: "flex-start" }}>
            <Button onClick={handleFecharModalEditar}>Cancelar</Button>

            <Button
              type="primary"
              onClick={handleSalvarEdicao}
              loading={loadingEditarExame}
              style={{
                background: "#14b8a6",
                color: "#fff",
                fontWeight: "600",
                width: "85px",
              }}
            >
              Salvar
            </Button>
          </Space>
        }
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={[16, 16]}>
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
                  options={cat.map(({ value, label }) => ({
                    value,
                    label,
                  }))}
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
                label="Data realização"
                name="dataRealizacao"
                rules={[
                  {
                    required: true,
                    message: "Informe a data de realização",
                  },
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

            <Col xs={24} sm={12}>
              <Form.Item
                label="Local"
                name="local"
                rules={[{ required: true, message: "Informe o local" }]}
              >
                <Input placeholder="Ex: Clínica Unimed / Laboratório Master" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Arquivo do exame">
                <Dragger multiple={false} maxCount={1} disabled={true}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Já existe um arquivo vinculado a este exame. Para usar outro
                    arquivo, exclua este exame e cadastre um novo.
                  </p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
