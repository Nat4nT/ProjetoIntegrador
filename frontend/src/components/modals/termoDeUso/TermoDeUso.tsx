//componentes antd
import { Modal } from "antd";

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
      maskClosable={false}
      title={null}
      rootClassName="termo-de-uso-modal"
    >
      <div className="termo-header">
        <h2 className="titulo-modal">Termo de uso</h2>
        <p className="conteudo-termo">
          ACEITAÇÃO DO TERMO DE USOO presente Termo de Uso se refere a um
          contrato de adesão firmado entre o usuário e o Ministério da         
            Saúde, fornecedor deste serviço, com Sede na Esplanada dos
          Ministérios Bloco G, Zona Cívico-Administrativa,            Brasília -
          DF - CEP 70058900.O uso deste serviço está condicionado à aceitação
          dos termos e das políticas            associadas. O usuário deverá
          conhecer tais termos e políticas certificar-se de havê-los entendido,
          estar            consciente de todas as condições estabelecidas no
          Termo de Uso. Ao utilizar o serviço, o usuário assume            estar
          de acordo com relação ao conteúdo deste Termo de Uso e estará
          legalmente vinculado a todas as            condições aqui previstas.
          DEFINIÇÕES DO TERMO DE USOPara os fins deste Termo de Uso, são
          aplicáveis as seguintes definições: Agente público: todo aquele que
          exerce, ainda que transitoriamente ou sem remuneração, por           
            eleição, nomeação, designação, contratação ou qualquer outra forma
          de investidura ou vínculo, mandato, cargo, emprego ou função nos
          órgãos e entidades da Administração Pública, direta e indireta.
          Agentes de Estado: inclui órgãos e entidades da Administração pública
          além dos seus agentes públicos. Códigos maliciosos: são qualquer
          programa de computador, ou parte de um programa,             
          construído com a intenção de provocar danos, obter informações não
          autorizadas ou interromper o funcionamento de sistemas e/ou redes de
          computadores. Sítios e aplicativos: sítios e aplicativos por meio dos
          quais o usuário acessa os serviços e conteúdos disponibilizados.
          Terceiro: pessoa ou entidade que não participa diretamente em um
          contrato, em um ato              jurídico ou em um negócio, ou que,
          para além das partes envolvidas, pode ter interesse num processo     
                  jurídico. Internet: sistema constituído do conjunto de
          protocolos lógicos, estruturado em escala              mundial para
          uso público e irrestrito, com a finalidade de possibilitar a
          comunicação de dados entre terminais por meio de diferentes redes.
          Usuários: (ou "Usuário", quando individualmente considerado): todas as
          pessoas naturais que utilizarem o serviço (citar o serviço). ARCABOUÇO
          LEGALO arcabouço legal aplicável ao serviço Meu SUS Digital compreende
          os seguintes atos legislativos e            normativos:            Lei
          nº 12.965, de 23 de abril de 2014, Marco Civil da Internet: Estabelece
          princípios, garantias, direitos e            deveres para o uso da
          Internet no Brasil, Lei nº 12.527, de 18 de novembro de 2011, Lei de
          Acesso à            Informação: Regula o acesso a informações previsto
          na Constituição Federal, Lei nº 13.460, de 26 de junho de           
          2017: Dispõe sobre participação, proteção e defesa dos direitos do
          usuário dos serviços públicos da            administração pública, Lei
          nº 13.709, de 14 de agosto de 2018: Dispõe sobre o tratamento de dados
          pessoais,            inclusive nos meios digitais, por pessoa natural
          ou por pessoa jurídica de direito público ou privado, com o           
          objetivo de proteger os direitos fundamentais de liberdade e de
          privacidade e o livre desenvolvimento da            personalidade da
          pessoa natural, Lei nº 13.444, de 11 de maio de 2017: Dispõe sobre a
          Identificação Civil            Nacional (ICN), Decreto nº 8.777, de 11
          de maio de 2016: Institui a Política de Dados Abertos do Poder       
              Executivo federal, Decreto nº 7.724, de 16 de maio de 2012:
          Regulamenta a Lei no 12.527, de 18 de novembro            de 2011 (Lei
          de Acesso à Informação), que dispõe sobre o acesso a informações
          previsto na Constituição,            Decreto nº 7.845, de 14 de
          novembro de 2012: Regulamenta procedimentos para credenciamento de
          segurança e            tratamento de informação classificada em
          qualquer grau de sigilo, e dispõe sobre o Núcleo de Segurança e       
              Credenciamento, Decreto nº 10.046, de 09 de outubro de 2019:
          Dispõe sobre a governança no compartilhamento            de dados no
          âmbito da administração pública federal e institui o Cadastro Base do
          Cidadão e o Comitê Central            de Governança de Dados, Normas
          complementares do Gabinete de Segurança da Informação da Presidência .
        </p>
      </div>
    </Modal>
  );
}
