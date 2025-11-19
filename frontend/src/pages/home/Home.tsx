import { useEffect, useState } from "react";

//componentes antd
import { Carousel, Card, Row, Col } from "antd";
import {
  FileAddOutlined,
  FileSearchOutlined,
  UserSwitchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

//apis
import {
  aprovarSolicitacao,
  recusarSolicitacao,
  verificarSolicitacoes,
} from "../../services/apiInterna/verificarSolicitacoesAcesso";

//banners
import banner1 from "../../assets/banner3.png";
import banner2 from "../../assets/banner2.png";

//validações
import { showMessage } from "../../components/messageHelper/ShowMessage";

//modals

//interfaces
import type { SolicitacaoAcesso } from "../../services/interfaces/Interfaces";

//enum
import { StatusAcesso } from "../../utils/Enum";

import "./Home.scss";
import PedidoAcessoModal from "../../components/modals/modalAceitarSolicitacaoMedico/ModalAceitarSolicitacao";

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPermitir, setLoadingPermitir] = useState(false);
  const [loadingRecusar, setLoadingRecusar] = useState(false);

  const tipoUsuario = localStorage.getItem("tipo_usuario");

  const [solicitacao, setSolicitacao] = useState<SolicitacaoAcesso | null>(
    null
  );

  const atalhosUsuarioPaciente = [
    {
      key: "seus-exames",
      title: "Seus exames",
      description: "Consulte todos os exames já enviados.",
      icon: <FileSearchOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/exames/seusExames"),
    },
    {
      key: "cadastrar-exame",
      title: "Cadastrar exame",
      description: "Envie novos exames em poucos cliques.",
      icon: <FileAddOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/exames/cadastrar"),
    },
    {
      key: "medicos",
      title: "Médicos com acesso",
      description: "Gerencie médicos com acesso aos seus exames.",
      icon: <UserSwitchOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/medicos"),
    },
    {
      key: "perfil",
      title: "Perfil",
      description: "Atualize seus dados pessoais e de acesso.",
      icon: <UserOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/perfil"),
    },
  ];

  const atalhosUsuarioMedico = [
    {
      key: "meus-pacientes",
      title: "Meus pacientes",
      description: "Consulte todos os exames já enviados.",
      icon: <FileSearchOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/meus/pacientes"),
    },
    {
      key: "buscar-paciente",
      title: "Buscar paciente",
      description: "Busque um paciente e solicite acesso.",
      icon: <FileAddOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/buscar/paciente"),
    },
    {
      key: "perfil",
      title: "Perfil",
      description: "Atualize seus dados pessoais e de acesso.",
      icon: <UserOutlined style={{ fontSize: 26 }} />,
      onClick: () => navigate("/perfil"),
    },
  ];

  const handleCloseModal = () => {
    setModalOpen(false);
    setSolicitacao(null);
  };

  //FUNÇÃO PARA ACEITAR SOLICITAÇÃO
  const handlePermitir = async () => {
    if (!solicitacao) return;
    try {
      setLoadingPermitir(true);
      await aprovarSolicitacao({ solicitacao_id: solicitacao.id });

      showMessage("Acesso permitido com sucesso.", "success");
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showMessage("Erro ao permitir acesso.", "error");
    } finally {
      setLoadingPermitir(false);
    }
  };

  //FUNÇÃO PARA RECUSAR SOLICITAÇÃO
  const handleRecusar = async () => {
    if (!solicitacao) return;
    try {
      setLoadingRecusar(true);
      await recusarSolicitacao({ solicitacao_id: solicitacao.id });

      showMessage("Solicitação recusada.", "success");
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showMessage("Erro ao recusar solicitação.", "error");
    } finally {
      setLoadingRecusar(false);
    }
  };

  const atalhosAtuais =
    tipoUsuario === "paciente"
      ? atalhosUsuarioPaciente
      : tipoUsuario === "medico"
      ? atalhosUsuarioMedico
      : [];

  //FUNÇÃO PARA CARREGAR SOLICITAÇÕES E EXIBIR MODAL NA HOME.
  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        setLoading(true);
        if (tipoUsuario !== "paciente") return;

        const response = await verificarSolicitacoes();
        const lista = response?.data || [];

        const aprovadas = lista.filter(
          (s: any) => s.status === StatusAcesso.PENDENTE
        );

        if (aprovadas.length > 0) {
          const s = aprovadas[0];

          const nomeMedico = `${s.primeiro_nome ?? ""} ${
            s.ultimo_nome ?? ""
          }`.trim();
          const crm = `CRM-${s.estado_atuacao ?? ""} ${s.crm ?? ""}`.trim();

          setSolicitacao({
            id: s.solcitacao_id,
            medico: nomeMedico || "Médico",
            especialidade: s.especialidade ?? "Não informado",
            data_pedido: dayjs(s.data_criacao).format("DD-MM-YYYY"),
            crm: crm ?? "",
            status: s.status,
          });

          setModalOpen(true);
        }
      } catch (err: any) {
        console.error(err);
        showMessage("Erro ao carregar solicitações de acesso.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregarSolicitacoes();
  }, [tipoUsuario]);

  return (
    <>
      <div className="home-header">
        <h1>Home</h1>
        <p>Acesse rapidamente as principais funcionalidades.</p>
      </div>

      <Carousel
        autoplay
        arrows
        draggable={false}
        dotPosition="bottom"
        autoplaySpeed={5000}
      >
        <div>
          <img src={banner1} alt="Banner MedExame" className="home-banner" />
        </div>
        <div>
          <img src={banner2} alt="Banner MedExame" className="home-banner" />
        </div>
      </Carousel>

      <div className="home-atalhos-container">
        <Row gutter={[16, 16]}>
          {atalhosAtuais.map((item) => (
            <Col
              key={item.key}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              onClick={item.onClick}
            >
              <Card hoverable className="home-card">
                <div className="home-card-icon">{item.icon}</div>
                <div>
                  <div className="home-card-title">{item.title}</div>
                  <div className="home-card-description">
                    {item.description}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {solicitacao && (
        <PedidoAcessoModal
          open={modalOpen}
          onClose={handleCloseModal}
          medico={solicitacao.medico}
          especialidade={solicitacao.especialidade}
          dataPedido={solicitacao.data_pedido}
          crm={solicitacao.crm}
          onPermitir={handlePermitir}
          onRecusar={handleRecusar}
          loadingPermitir={loadingPermitir}
          loadingRecusar={loadingRecusar}
        />
      )}
    </>
  );
}
