import { useState, useRef } from "react";

//componentes antd
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Spin,
  Radio,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";

//apis
import { getAddressByCep } from "../../../services/apiExterna/viaCep";
import { cadastrarUsuario } from "../../../services/apiInterna/FluxoIdentificacao";

//validações
import {
  maskCEP,
  maskCPF,
  maskCRM,
  maskPhoneBR,
  onlyDigits,
  padraoDeSenha,
} from "../../../utils/Masks";
import { isValidCPF } from "../../../utils/Utilidades";
import { showMessage } from "../../messageHelper/ShowMessage";

//modals
import ModalTermoDeUso from "../termoDeUso/TermoDeUso";

import "./ModalCadastro.scss";
import { ESPECIALIDADES_MEDICAS } from "../../../utils/Constants";

type CadastroModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CadastroModal({ open, onClose }: CadastroModalProps) {
  const [form] = Form.useForm();

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModalTermoDeUso, setOpenModalTermoDeUso] = useState(false);

  const [cepError, setCepError] = useState<string>();
  const [tipoUsuario, setTipoUsuario] = useState<"paciente" | "medico">(
    "paciente"
  );
  const isMedico = tipoUsuario === "medico";

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generoMap: Record<string, number> = { m: 1, f: 2, o: 3, n: 4 };

  const closeModalTermoDeUso = () => {
    setOpenModalTermoDeUso(false);
  };

  // CONVERTE ARRAY SIMPLES PARA {label: "", value: ""}
  const toOptions = (arr: string[]) => arr.map((v) => ({ label: v, value: v }));

  // FUNÇÃO PARA BUSCAR ENDEREÇO DO CEP
  const handleCepChange = (raw: string) => {
    const masked = maskCEP(raw);
    form.setFieldsValue({ cep: masked });
    setCepError(undefined);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    const numeric = masked.replace(/\D/g, "");
    if (numeric.length === 8) {
      debounceRef.current = setTimeout(async () => {
        setLoadingCep(true);
        try {
          const data = await getAddressByCep(numeric);
          form.setFieldsValue({
            cep: maskCEP(data.cep),
            logradouro: data.logradouro || form.getFieldValue("logradouro"),
            bairro: data.bairro || form.getFieldValue("bairro"),
            cidade: data.localidade || form.getFieldValue("cidade"),
            estado: data.uf || form.getFieldValue("estado"),
          });
        } catch (err: any) {
          setCepError(err?.message || "Erro ao consultar CEP");
        } finally {
          setLoadingCep(false);
        }
      }, 800);
    }
  };

  // FUNÇÃO PARA VALIDAR CAMPOS DO FORM, VERIFICA SE TEM ALGUM CAMPO COM ERRO.
  const onFinishFailed = () => {
    showMessage("Preencha os campos obrigatórios destacados.", "warning");
    form.scrollToField(
      form.getFieldsError().find((f) => f.errors.length)?.name ?? [],
      {
        block: "center",
      }
    );
  };

  // FUNÇÃO PARA CADASTRAR
  const handleSubmit = async (values: any) => {
    //RNO7
    if (!agree) {
      showMessage("Você precisa aceitar os termos para continuar.", "warning");
      return;
    }
    if (values.senha !== values.senha2) {
      showMessage("As senhas não conferem.", "error");
      return;
    }

    //RN20  PAYLOAD DE CADASTRO NÃO É NECESSÁRIO PASSAR OS CAMPOS OPCIONAIS

    const payload: any = {
      tipo_usuario: tipoUsuario,
      primeiro_nome: values.nome?.trim(),
      ultimo_nome: values.sobrenome?.trim(),
      genero: generoMap[values.genero] ?? values.genero,
      cpf: onlyDigits(values.cpf),
      telefone: onlyDigits(values.celular),
      email: values.email?.trim(),
      senha: values.senha,
      consentimento_lgpd: agree ? 1 : 0,
      data_nascimento: values.nascimento
        ? dayjs(values.nascimento).format("YYYY-MM-DD")
        : undefined,
      endereco: {
        rua: values.logradouro,
        bairro: values.bairro,
        numero: values.numero,
        cep: onlyDigits(values.cep),
        cidade: values.cidade,
        estado: values.estado,
        complemento: values.complemento,
      },
    };

    if (isMedico) {
      payload.crm = values.crm;
      payload.estado_atuacao = values.estado_atuacao;
      payload.especialidade = values.especialidade;
    }

    try {
      setLoading(true);
      await cadastrarUsuario(payload as any);
      showMessage("Cadastro realizado com sucesso!", "success");
      onClose();
    } catch (err: any) {
      showMessage(err?.message || "Erro ao cadastrar usuário.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      afterClose={() => form.resetFields()}
      footer={null}
      centered
      width={1000}
      title={null}
      rootClassName="cadastro-modal"
      styles={{ content: { borderRadius: 14 } }}
      maskClosable={false}
      destroyOnHidden
    >
      <div className="cad-header">
        <h2>Cadastro</h2>
        <div className="cad-toggle">
          <Radio.Group
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <Radio value="paciente">Paciente</Radio>
            <Radio value="medico">Médico</Radio>
          </Radio.Group>
        </div>
      </div>

      <ModalTermoDeUso
        onClose={closeModalTermoDeUso}
        open={openModalTermoDeUso}
      />
      <Form
        form={form}
        layout="vertical"
        style={{ rowGap: 1 }}
        requiredMark
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <input
          type="text"
          name="username"
          autoComplete="username"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          style={{ display: "none" }}
        />
        {/* DADOS PESSOAIS */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nome"
              name="nome"
              rules={[{ required: true, message: "Informe seu nome" }]}
            >
              <Input placeholder="Digite seu nome" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Sobrenome"
              name="sobrenome"
              rules={[{ required: true, message: "Informe seu sobrenome" }]}
            >
              <Input placeholder="Digite seu sobrenome" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Data de nascimento"
              name="nascimento"
              rules={[
                { required: true, message: "Informe sua data de nascimento" },
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
          <Col xs={24} md={12}>
            <Form.Item
              label="Celular"
              name="celular"
              normalize={maskPhoneBR}
              rules={[{ required: true, message: "Informe seu celular" }]}
            >
              <Input placeholder="(DDD) 9 0000-0000" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, message: "Informe seu e-mail" },
                { type: "email", message: "E-mail inválido" },
              ]}
            >
              <Input placeholder="Digite seu e-mail" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
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
              <Input placeholder="000.000.000-00" maxLength={14} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Gênero"
              name="genero"
              rules={[{ required: true, message: "Selecione o gênero" }]}
            >
              <Select
                placeholder="Selecione"
                options={[
                  { value: "m", label: "Masculino" },
                  { value: "f", label: "Feminino" },
                  { value: "o", label: "Outro" },
                  { value: "n", label: "Prefiro não dizer" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Senha"
              name="senha"
              rules={[
                { required: true, message: "Crie uma senha" },
                {
                  pattern: padraoDeSenha,
                  message:
                    "A senha deve conter ao menos 8 caracteres, uma letra maiúscula, um número e um símbolo.",
                },
              ]}
            >
              <Input.Password
                name="loginSecret"
                autoComplete="new-password"
                placeholder="Digite a senha"
                visibilityToggle={{
                  visible: showPass,
                  onVisibleChange: setShowPass,
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Senha novamente"
              name="senha2"
              dependencies={["senha"]}
              rules={[
                { required: true, message: "Repita a senha" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("senha") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("As senhas não conferem"));
                  },
                }),
              ]}
            >
              <Input.Password
                name="loginSecret"
                autoComplete="new-password"
                placeholder="Repita a senha"
                visibilityToggle={{
                  visible: showPass2,
                  onVisibleChange: setShowPass2,
                }}
              />
            </Form.Item>
          </Col>

          {/* ENDEREÇO */}

          <Col xs={24} md={8}>
            <Form.Item
              label="CEP"
              name="cep"
              validateStatus={cepError ? "error" : ""}
              help={cepError}
              rules={[{ required: true, message: "Informe o CEP" }]}
            >
              <Input
                placeholder="00000-000"
                maxLength={9}
                onChange={(e) => handleCepChange(e.target.value)}
                suffix={loadingCep ? <Spin size="small" /> : undefined}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Form.Item
              label="Logradouro"
              name="logradouro"
              rules={[{ required: true, message: "Informe o logradouro" }]}
            >
              <Input placeholder="Rua, Avenida..." />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Complemento" name="complemento">
              <Input placeholder="Apartamento, bloco, etc." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Bairro"
              name="bairro"
              rules={[{ required: true, message: "Informe o bairro" }]}
            >
              <Input placeholder="Digite seu bairro" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Número"
              name="numero"
              rules={[{ required: true, message: "Informe o número" }]}
            >
              <Input placeholder="Digite o número" />
            </Form.Item>
          </Col>

          <Col xs={24} md={18}>
            <Form.Item
              label="Cidade"
              name="cidade"
              rules={[{ required: true, message: "Informe a cidade" }]}
            >
              <Input placeholder="Cidade" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Estado"
              name="estado"
              rules={[{ required: true, message: "Informe a UF" }]}
            >
              <Select placeholder="Selecione a UF">
                <Select.Option value="AC">AC</Select.Option>
                <Select.Option value="AL">AL</Select.Option>
                <Select.Option value="AP">AP</Select.Option>
                <Select.Option value="AM">AM</Select.Option>
                <Select.Option value="BA">BA</Select.Option>
                <Select.Option value="CE">CE</Select.Option>
                <Select.Option value="DF">DF</Select.Option>
                <Select.Option value="ES">ES</Select.Option>
                <Select.Option value="GO">GO</Select.Option>
                <Select.Option value="MA">MA</Select.Option>
                <Select.Option value="MT">MT</Select.Option>
                <Select.Option value="MS">MS</Select.Option>
                <Select.Option value="MG">MG</Select.Option>
                <Select.Option value="PA">PA</Select.Option>
                <Select.Option value="PB">PB</Select.Option>
                <Select.Option value="PR">PR</Select.Option>
                <Select.Option value="PE">PE</Select.Option>
                <Select.Option value="PI">PI</Select.Option>
                <Select.Option value="RJ">RJ</Select.Option>
                <Select.Option value="RN">RN</Select.Option>
                <Select.Option value="RS">RS</Select.Option>
                <Select.Option value="RO">RO</Select.Option>
                <Select.Option value="RR">RR</Select.Option>
                <Select.Option value="SC">SC</Select.Option>
                <Select.Option value="SP">SP</Select.Option>
                <Select.Option value="SE">SE</Select.Option>
                <Select.Option value="TO">TO</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {isMedico && (
            <>
              <Col xs={24} md={8}>
                <Form.Item
                  label="CRM"
                  name="crm"
                  rules={[{ required: true, message: "Informe seu CRM" }]}
                >
                  <Input
                    placeholder="Digite seu CRM"
                    maxLength={6}
                    onChange={(e) =>
                      form.setFieldsValue({ crm: maskCRM(e.target.value) })
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Estado de atuação"
                  name="estado_atuacao"
                  rules={[
                    {
                      required: true,
                      message: "Selecione o estado de atuação",
                    },
                  ]}
                >
                  <Select placeholder="Selecione a UF">
                    <Select.Option value="AC">AC</Select.Option>
                    <Select.Option value="AL">AL</Select.Option>
                    <Select.Option value="AP">AP</Select.Option>
                    <Select.Option value="AM">AM</Select.Option>
                    <Select.Option value="BA">BA</Select.Option>
                    <Select.Option value="CE">CE</Select.Option>
                    <Select.Option value="DF">DF</Select.Option>
                    <Select.Option value="ES">ES</Select.Option>
                    <Select.Option value="GO">GO</Select.Option>
                    <Select.Option value="MA">MA</Select.Option>
                    <Select.Option value="MT">MT</Select.Option>
                    <Select.Option value="MS">MS</Select.Option>
                    <Select.Option value="MG">MG</Select.Option>
                    <Select.Option value="PA">PA</Select.Option>
                    <Select.Option value="PB">PB</Select.Option>
                    <Select.Option value="PR">PR</Select.Option>
                    <Select.Option value="PE">PE</Select.Option>
                    <Select.Option value="PI">PI</Select.Option>
                    <Select.Option value="RJ">RJ</Select.Option>
                    <Select.Option value="RN">RN</Select.Option>
                    <Select.Option value="RS">RS</Select.Option>
                    <Select.Option value="RO">RO</Select.Option>
                    <Select.Option value="RR">RR</Select.Option>
                    <Select.Option value="SC">SC</Select.Option>
                    <Select.Option value="SP">SP</Select.Option>
                    <Select.Option value="SE">SE</Select.Option>
                    <Select.Option value="TO">TO</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* <Col xs={24} md={8}>
                <Form.Item
                  label="Especialidade médica"
                  name="especialidade"
                  rules={[
                    {
                      required: true,
                      message: "Informe a especialidade médica",
                    },
                  ]}
                >
                  <Input placeholder="Digite para buscar ou adicionar" />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Especialidade médica"
                  name="especialidade"
                  normalize={(arr) =>
                    Array.from(new Set((arr ?? []).map((s: any) => s.trim())))
                  }
                >
                  <Select
                    mode="tags"
                    placeholder="Ex: Cardiologia, Cirurgia geral"
                    tokenSeparators={[","]}
                    showSearch
                    optionFilterProp="label"
                    options={toOptions(ESPECIALIDADES_MEDICAS)}
                    filterOption={(input, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    maxTagCount="responsive"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        <p className="cad-note" style={{ marginTop: 12 }}>
          <strong>Observação:</strong> Algumas informações de saúde são
          opcionais e podem ser preenchidas depois em seu perfil.
        </p>

        <div className="cad-terms" style={{ marginTop: 8 }}>
          {/* RN06 */}
          <Checkbox
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          >
            Declaro que li e aceito o{" "}
            <a href="#" onClick={() => setOpenModalTermoDeUso(true)}>
              Termo de uso e a Política de privacidade
            </a>
          </Checkbox>
        </div>

        <Button
          type="primary"
          size="large"
          className="cad-submit"
          disabled={!agree}
          loading={loading}
          htmlType="submit"
        >
          Cadastrar
        </Button>

        <div className="cad-footer">
          Já tem conta?{" "}
          <button type="button" className="cad-link" onClick={onClose}>
            Entrar
          </button>
        </div>
      </Form>
    </Modal>
  );
}
