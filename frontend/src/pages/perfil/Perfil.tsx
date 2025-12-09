import { useEffect, useRef, useState } from "react";

//componentes antd
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
  type UploadProps,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

//api
import {
  condicoes,
  dadosUsuario,
  editarUsuario,
} from "../../services/apiInterna/FluxoIdentificacao";
import { getAddressByCep } from "../../services/apiExterna/viaCep";

//utils
import {
  maskAltura,
  maskCEP,
  maskCPF,
  maskPhoneBR,
  onlyDigits,
} from "../../utils/Masks";

//constantes
import {
  ESPECIALIDADES_MEDICAS,
  ESTADOS_BR,
  GENEROS,
  TIPOS_SANGUINEOS,
} from "../../utils/Constants";

//validações
import { showMessage } from "../../components/messageHelper/ShowMessage";
import {
  isValidCPF,
  isValidPhoneBR,
  parseMaybeJsonArray,
} from "../../utils/Utilidades";

//modals
import DesativarContaModal from "../../components/modals/desativarConta/DesativarConta";

import "./Perfil.scss";
import AlterarSenha from "../../components/modals/alterarSenha/AlterarSenha";

export default function Perfil() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [openModalDesativarConta, setOpenModalDesativarConta] = useState(false);
  const [openModalAlterarSenha, setOpenModalAlterarSenha] = useState(false);

  const [cepError, setCepError] = useState<string>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [doencasDiagnosticadas, setDoencasDiagnosticas] = useState<string[]>(
    []
  );
  const [medicacoes, setMedicacoes] = useState<string[]>([]);
  const [alergias, setAlergias] = useState<string[]>([]);
  const [deficiencias, setDeficiencias] = useState<string[]>([]);

  const primeiroNomeUsuario = localStorage.getItem("primeiroNomeUsuario");
  const ultimoNomeUsuario = localStorage.getItem("ultimoNomeUsuario");
  const tipoUsuario = localStorage.getItem("tipo_usuario");

  const { Title, Paragraph } = Typography;

  // CONVERTE ARRAY SIMPLES PARA {label: "", value: ""}
  const toOptions = (arr: string[]) => arr.map((v) => ({ label: v, value: v }));

  // PEGAR ARQUIVO DO AVATAR E MOSTRAR PRÉVIA
  const handleAvatarBeforeUpload: UploadProps["beforeUpload"] = (file) => {
    if (!file.type.startsWith("image/")) {
      showMessage("Envie apenas arquivos de imagem.", "warning");
      return Upload.LIST_IGNORE;
    }
    setAvatarFile(file as File);

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    return false;
  };

  // FUNÇÃO PARA EDITAR DADOS
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const endereco = {
        cep: values.cep ?? "",
        rua: values.logradouro ?? "",
        numero: values.numero ?? "",
        complemento: values.complemento ?? "",
        bairro: values.bairro ?? "",
        cidade: values.cidade ?? "",
        estado: values.estado ?? "",
      };

      const payload: any = {
        tipo_usuario: tipoUsuario,
        primeiro_nome: values.nome?.trim() ?? null,
        ultimo_nome: values.sobrenome?.trim() ?? null,
        data_nascimento: values.nascimento
          ? dayjs(values.nascimento).format("YYYY-MM-DD")
          : null,
        telefone: onlyDigits(values.celular) ?? null,
        email: values.email ?? null,
        cpf: onlyDigits(values.cpf) ?? null,
        genero: values.genero != null ? Number(values.genero) : null,
        tipo_sanguineo: values.tipoSanguineo ?? values.tipo_sanguineo ?? null,
        doencas_diagnosticadas:
          values.doencas ?? values.doencas_diagnosticadas ?? [],
        alergias: values.alergias ?? [],
        medicacao: values.medicacao ?? [],
        altura: values.altura
          ? parseFloat(String(values.altura).replace(",", "."))
          : null,
        peso: values.peso
          ? parseFloat(String(values.peso).replace(",", "."))
          : null,
        desc_deficiencia:
          values.deficiencias ?? values.desc_deficiencia ?? null,
        endereco,
      };

      if (tipoUsuario === "medico") {
        payload.crm = values.crm;
        payload.estado_atuacao = values.estado_atuacao;
        payload.especialidade = values.especialidade;
      }
      await editarUsuario(payload, avatarFile);

       const respPerfil = await dadosUsuario();
       const userAtualizado = respPerfil.data;

       if (userAtualizado.imagem_perfil) {
         setAvatarUrl(`/api${userAtualizado.imagem_perfil}`);
         localStorage.setItem("user_photo", userAtualizado.imagem_perfil);
         window.dispatchEvent(new Event("user_photo_updated"));
       }

      showMessage("Dados salvos com sucesso!", "success");
    } catch (err: any) {
      showMessage("Erro ao salvar dados pessoais.", "error");
    } finally {
      setLoading(false);
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

  // CHAMA SEMPRE QUE ENTRAR NA TELA PARA BUSCAR OS DADOS DO USUÁRIO E POPULAR OS CAMPOS
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const responseCondicoes = await condicoes();
        setDoencasDiagnosticas(
          responseCondicoes.data.doencas.map((e: any) => e.nome)
        );
        setAlergias(responseCondicoes.data.alergias.map((e: any) => e.nome));
        setMedicacoes(
          responseCondicoes.data.medicacoes.map((e: any) => e.nome)
        );
        setDeficiencias(
          responseCondicoes.data.deficiencia.map((e: any) => e.nome)
        );

        const response = await dadosUsuario();
        const user = response.data;
        form.setFieldsValue({
          nome: user.primeiro_nome,
          sobrenome: user.ultimo_nome,
          nascimento: user.data_nascimento ? dayjs(user.data_nascimento) : null,
          celular: maskPhoneBR(user.telefone),
          email: user.email,
          crm: user.crm ?? null,
          estado_atuacao: user.estado_atuacao ?? null,
          especialidade: parseMaybeJsonArray(user.especialidade) ?? null,
          cpf: maskCPF(user.cpf),
          genero: user.genero != null ? Number(user.genero) : undefined,
          tipoSanguineo: user.tipo_sanguineo,
          doencas: parseMaybeJsonArray(user.doencas_diagnosticadas),
          alergias: parseMaybeJsonArray(user.alergias),
          medicacao: parseMaybeJsonArray(user.medicacao),
          deficiencias: parseMaybeJsonArray(user.desc_deficiencia),
          cep: user.cep,
          logradouro: user.rua,
          complemento: user.complemento,
          bairro: user.bairro,
          numero: user.numero,
          cidade: user.cidade,
          estado: user.estado,
          peso: user.peso,
          altura: user.altura,
        });

        if (user.imagem_perfil) {
          setAvatarUrl(`/api${user.imagem_perfil}`);
        }

        localStorage.setItem("user_photo", user.imagem_perfil);
      } catch (err: any) {
        showMessage("Erro ao carregar dados pessoais.", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Card styles={{ body: { padding: 20 } }}>
        <Flex align="center" gap={30} wrap="wrap">
          <div style={{ position: "relative", width: 96, height: 96 }}>
            <Avatar
              src={avatarUrl}
              size={96}
              style={{ backgroundColor: "#e6f4ff", color: "#1677ff" }}
            >
              {avatarUrl
                ? null
                : `${primeiroNomeUsuario?.[0]?.toUpperCase() ?? ""}${
                    ultimoNomeUsuario?.[0]?.toUpperCase() ?? ""
                  }`}
            </Avatar>

            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleAvatarBeforeUpload}
            >
              <Button
                type="default"
                shape="circle"
                icon={<CameraOutlined />}
                style={{
                  position: "absolute",
                  right: -6,
                  bottom: -6,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}
              />
            </Upload>
          </div>

          <div>
            <Title level={3} style={{ marginBottom: 2 }}>
              Meu Perfil
            </Title>
            <Paragraph style={{ margin: 0 }} className="descricao-pages">
              Aqui você pode visualizar e editar seus dados pessoais e
              opcionais.
            </Paragraph>
          </div>
        </Flex>
      </Card>

      <Card
        styles={{ body: { padding: 20, overflow: "hidden" } }}
        style={{ borderRadius: 12 }}
      >
        <DesativarContaModal
          open={openModalDesativarConta}
          onClose={() => setOpenModalDesativarConta(false)}
        />
        <AlterarSenha
          open={openModalAlterarSenha}
          onClose={() => setOpenModalAlterarSenha(false)}
        />

        <Form
          layout="vertical"
          labelWrap
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={[24, 24]}>
            {/* DADOS PESSOAIS */}
            <Col xs={24} lg={14}>
              <Title level={4} style={{ marginBottom: 12 }}>
                Dados básicos
              </Title>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Nome"
                    name="nome"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Ex.: João" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Sobrenome"
                    name="sobrenome"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Ex.: Silva" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Data de nascimento"
                    name="nascimento"
                    rules={[{ required: true }]}
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
                    label="Celular"
                    name="celular"
                    normalize={maskPhoneBR}
                    validateTrigger={["onBlur", "onSubmit"]}
                    rules={[
                      { required: true, message: "Informe o celular" },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          if (
                            !isValidPhoneBR(value, { allowLandline: false })
                          ) {
                            return Promise.reject(
                              "Celular inválido. Use DDD + 9xxxx-xxxx."
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="(45) 99999-9999" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[{ type: "email", required: true }]}
                  >
                    {/* RN04 PARA DEIXAR O CAMPO DESABILIDADE PARA EDITAR, PARAMETRO disabled={true} */}
                    <Input placeholder="email@exemplo.com" disabled={true} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
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
                            return Promise.reject(
                              "CPF deve conter 11 dígitos."
                            );
                          }
                          if (!isValidCPF(digits)) {
                            return Promise.reject("CPF inválido.");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    {/* RN04 PARA DEIXAR O CAMPO DESABILIDADE PARA EDITAR, PARAMETRO disabled={true} */}
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    label="Gênero"
                    name="genero"
                    rules={[{ required: true, message: "Selecione o gênero" }]}
                  >
                    <Select options={GENEROS} />
                  </Form.Item>
                </Col>

                {/* ENDEREÇO */}
                <Col xs={24} sm={12} md={6}>
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
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Logradouro"
                    name="logradouro"
                    rules={[
                      { required: true, message: "Informe o logradouro" },
                    ]}
                  >
                    <Input placeholder="Ex.: Rua das Flores" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Complemento" name="complemento">
                    <Input placeholder="Apto, bloco, ref." />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Bairro"
                    name="bairro"
                    rules={[{ required: true, message: "Informe o bairro" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Form.Item
                    label="Número"
                    name="numero"
                    rules={[{ required: true, message: "Informe o número" }]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label="Cidade"
                    name="cidade"
                    rules={[{ required: true, message: "Informe a cidade" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Form.Item
                    label="Estado"
                    name="estado"
                    rules={[{ required: true, message: "Informe a UF" }]}
                  >
                    <Select options={toOptions(ESTADOS_BR)} />
                  </Form.Item>
                </Col>
                {tipoUsuario === "medico" && (
                  <>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="CRM"
                        name="crm"
                        rules={[{ required: true, message: "Informe seu CRM" }]}
                      >
                        <Input placeholder="Digite seu CRM" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
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
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="Especialidade médica"
                        name="especialidade"
                        normalize={(arr) =>
                          Array.from(
                            new Set((arr ?? []).map((s: any) => s.trim()))
                          )
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
            </Col>
            {/* DADOS OPCIONAIS */}
            {/* RN20 CASO NÃO SEJA USUÁRIO MÉDICO É EXIBIDO AS OPÇÕES DE DADOS OPCIONAIS*/}
            {tipoUsuario === "medico" ? (
              ""
            ) : (
              <Col xs={24} lg={10}>
                <Title level={4} style={{ marginBottom: 12 }}>
                  Dados opcionais
                </Title>

                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Form.Item
                      label="Doenças já diagnosticadas"
                      name="doencas"
                      normalize={(arr) =>
                        Array.from(
                          new Set((arr ?? []).map((s: any) => s.trim()))
                        )
                      }
                    >
                      <Select
                        mode="tags"
                        placeholder="Ex: Diabetes tipo 2, Hipertensão"
                        tokenSeparators={[","]}
                        showSearch
                        optionFilterProp="label"
                        options={toOptions(doencasDiagnosticadas)}
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

                  <Col xs={24}>
                    <Form.Item
                      label="Alergias"
                      name="alergias"
                      normalize={(arr) =>
                        Array.from(
                          new Set((arr ?? []).map((s: any) => s.trim()))
                        )
                      }
                    >
                      <Select
                        mode="tags"
                        placeholder="Ex: Amendoim, Dipirona"
                        tokenSeparators={[","]}
                        showSearch
                        optionFilterProp="label"
                        options={toOptions(alergias)}
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

                  <Col xs={24}>
                    <Form.Item
                      label="Medicação"
                      name="medicacao"
                      normalize={(arr) =>
                        Array.from(
                          new Set((arr ?? []).map((s: any) => s.trim()))
                        )
                      }
                    >
                      <Select
                        mode="tags"
                        placeholder="Ex: Losartana 50mg, uso contínuo"
                        tokenSeparators={[","]}
                        showSearch
                        optionFilterProp="label"
                        options={toOptions(medicacoes)}
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
                  <Col xs={24} sm={8}>
                    <Form.Item
                      label="Altura (m)"
                      name="altura"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const num = parseFloat(value);
                            if (num < 0.5 || num > 2.5)
                              return Promise.reject(
                                "Informe uma altura entre 0.50 e 2.50 m"
                              );
                            return Promise.resolve();
                          },
                        },
                      ]}
                      getValueFromEvent={(e) => maskAltura(e.target.value)}
                    >
                      <Input placeholder="Ex.: 1.75" inputMode="numeric" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="Peso (kg)" name="peso">
                      <Input placeholder="Ex.: 70" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="Tipo sanguíneo" name="tipoSanguineo">
                      <Select
                        options={TIPOS_SANGUINEOS.map((t) => ({
                          label: t,
                          value: t,
                        }))}
                        placeholder="Ex.: O+"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Descrição de deficiências"
                      name="deficiencias"
                      normalize={(arr) =>
                        Array.from(
                          new Set((arr ?? []).map((s: any) => s.trim()))
                        )
                      }
                    >
                      <Select
                        mode="tags"
                        placeholder="Ex: Deficiência visual parcial, mobilidade reduzida"
                        tokenSeparators={[","]}
                        showSearch
                        optionFilterProp="label"
                        options={toOptions(deficiencias)}
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

                  {/* <Col xs={24}>
                    <Form.Item
                      label="Descrição de deficiências"
                      name="deficiencias"
                    >
                      <TextArea
                        placeholder="Ex: Deficiência visual parcial, mobilidade reduzida"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    </Form.Item>
                  </Col> */}
                </Row>
              </Col>
            )}
            <Col
              xs={24}
              lg={tipoUsuario === "medico" ? 14 : 24}
              style={{ marginTop: 16 }}
            >
              <div className="container-button-perfil">
                <div className="container-salvar-alterar">
                  <Button
                    className="salvar-dados-button"
                    type="primary"
                    loading={loading}
                    htmlType="submit"
                  >
                    Salvar dados
                  </Button>

                  <Button
                    className="alterar-senha-button"
                    type="default"
                    htmlType="button"
                    onClick={() => setOpenModalAlterarSenha(true)}
                  >
                    Alterar senha
                  </Button>
                </div>
                <div>
                  <Button
                    className="desativar-conta-senha-button"
                    type="primary"
                    htmlType="button"
                    onClick={() => setOpenModalDesativarConta(true)}
                  >
                    Desativar conta
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          {/* <div className="container-button-perfil">
            <div className="container-salvar-alterar">
              <Button
                className="salvar-dados-button"
                type="primary"
                loading={loading}
                htmlType="submit"
              >
                Salvar dados
              </Button>

              <Button
                className="alterar-senha-button"
                type="default"
                htmlType="button"
                onClick={() => setOpenModalAlterarSenha(true)}
              >
                Alterar senha
              </Button>
            </div>
            <div>
              <Button
                className="desativar-conta-senha-button"
                type="primary"
                htmlType="button"
                onClick={() => setOpenModalDesativarConta(true)}
              >
                Desativar conta
              </Button>
            </div>
          </div> */}
        </Form>
      </Card>
    </Space>
  );
}
