//componentes antd
import { Button, Modal } from "antd";

import "./TermoDeUso.scss";

type ModalTermoDeUso = {
  open: boolean;
  onClose: () => void;
};

export default function ModalTermoDeUso({ open, onClose }: ModalTermoDeUso) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={1300}
      title={null}
      rootClassName="termo-de-uso-modal"
    >
      <div className="termo-header">
        <h2 className="titulo-modal">Termo de uso</h2>
        <p className="conteudo-termo">
          <strong>ACEITAÇÃO DO TERMO DE USO</strong>
          <br />O presente Termo de Uso refere-se a um contrato de adesão
          firmado entre o usuário e o <strong>MedExame</strong>, plataforma
          privada dedicada ao armazenamento, organização e compartilhamento
          seguro de exames médicos e informações de saúde. A utilização deste
          serviço está condicionada à plena concordância com os termos aqui
          expostos.
          <br />
          <br />
          Ao acessar ou utilizar o MedExame, o usuário declara estar ciente,
          compreender e aceitar todas as condições estabelecidas neste Termo de
          Uso. Caso não concorde com qualquer disposição, o usuário deve
          interromper imediatamente o uso da plataforma.
          <br />
          <br />
          <strong>DEFINIÇÕES DO TERMO DE USO</strong>
          <br />
          Para fins deste Termo, aplicam-se as seguintes definições:
          <br />
          <br />
          <strong>Usuário:</strong> pessoa natural que utiliza o MedExame,
          podendo ser classificada como Paciente ou Profissional de Saúde.
          <br />
          <strong>Paciente:</strong> usuário que acessa a plataforma para
          visualizar, armazenar e compartilhar exames médicos.
          <br />
          <strong>Profissional de Saúde:</strong> médico ou clínica devidamente
          registrado em conselho profissional competente (ex.: CRM).
          <br />
          <strong>Plataforma:</strong> ambiente digital denominado MedExame,
          acessível por meio de site e/ou aplicativo.
          <br />
          <strong>Dados Pessoais Sensíveis:</strong> informações relacionadas à
          saúde, exames, histórico clínico e demais dados previstos na Lei Geral
          de Proteção de Dados (LGPD).
          <br />
          <strong>Credenciais de Acesso:</strong> login e senha utilizados pelo
          usuário para autenticação na plataforma.
          <br />
          <br />
          <strong>ARCABOUÇO LEGAL</strong>
          <br />
          O tratamento de dados pessoais e dados sensíveis realizado pelo
          MedExame observa integralmente a legislação brasileira aplicável.
          Entre os principais atos normativos considerados, destacam-se:
          <br />
          <br />
          <strong>
            Lei nº 12.965, de 23 de abril de 2014 — Marco Civil da Internet:
          </strong>{" "}
          estabelece princípios, garantias, direitos e deveres para o uso da
          internet no Brasil.
          <br />
          <strong>
            Lei nº 12.527, de 18 de novembro de 2011 — Lei de Acesso à
            Informação:
          </strong>{" "}
          regula o acesso a informações previsto na Constituição Federal.
          <br />
          <strong>Lei nº 13.460, de 26 de junho de 2017:</strong> dispõe sobre
          participação, proteção e defesa dos direitos do usuário de serviços
          públicos — aplicada de forma complementar às melhores práticas de
          atendimento.
          <br />
          <strong>Lei nº 13.709, de 14 de agosto de 2018 — LGPD:</strong> regula
          o tratamento de dados pessoais, inclusive nos meios digitais, e
          estabelece regras para proteção de dados sensíveis relacionados à
          saúde.
          <br />
          <strong>Lei nº 13.444, de 11 de maio de 2017:</strong> dispõe sobre a
          Identificação Civil Nacional (ICN), aplicada quando necessária à
          validação do usuário.
          <br />
          <strong>Decreto nº 8.771, de 11 de maio de 2016:</strong> regulamenta
          dispositivos do Marco Civil da Internet referentes à segurança e
          proteção de dados.
          <br />
          <strong>Demais normas técnicas e boas práticas</strong> relacionadas à
          segurança da informação, governança de dados e privacidade digital.
          <br />
          <br />
          Este Termo de Uso poderá ser atualizado a qualquer momento. O uso
          continuado da plataforma implica concordância com sua versão mais
          recente.
        </p>
      </div>
      <div className="container-button-fechar">
        <Button className="button-fechar-modal" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
