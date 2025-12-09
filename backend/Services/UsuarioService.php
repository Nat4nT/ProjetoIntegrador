<?php

namespace Services;

use Helpers\Criptografia;
use Models\AutorizacaoAcessoModel;
use Models\EnderecoModel;
use Models\MedicoModel;
use Models\PacienteModel;
use Models\UsuarioModel;
use Services\AutenticacaoService;


class UsuarioService
{
    public function alterarSenha($dados_usuario, $camposFormulario)
    {
        $usuarioModel = new UsuarioModel($dados_usuario->usuario_id);
        $usuarioData = $usuarioModel->getInfo();

        if (!$usuarioData) return null;

        if ($camposFormulario['nova_senha'] !== $camposFormulario['confirmacao_senha']) {
            return ['message' => "Senhas diferentes", 'code' => 400];
        }

        if (isset($camposFormulario['senha'])) {
            if (!password_verify($camposFormulario['senha'], $usuarioData['senha'])) {
                return ['message' => "Senha incorreta.", 'code' => 400];
            }
        }

        // RN21
        if (password_verify($camposFormulario['nova_senha'], $usuarioData['senha'])) {
            return ['message' => "A Senha deve ser diferente da anterior.", 'code' => 400];
        }

        $usuarioModel->editData(['status' => 1, 'senha' => password_hash($camposFormulario['nova_senha'], PASSWORD_DEFAULT)]);

        return ['code' => 200, 'message' => "Senha alterada com sucesso"];
    }

    private function validarCamposUsuario(array $usuario)
    {
        $erro = 0;
        $mensagem = [];
        if (!isset($usuario["tipo_usuario"]) || is_null($usuario["tipo_usuario"])) {
            $erro = 1;
            $mensagem["tipo_usuaario"] = "Tipo Usuario Invalido";
        }

        if (!isset($usuario["primeiro_nome"]) || is_null($usuario["primeiro_nome"])) {
            $erro = 1;
            $mensagem["primeiro_nome"] = "Campo Primeiro Nome Invalido";
        }

        if (!isset($usuario["ultimo_nome"]) || is_null($usuario["ultimo_nome"])) {
            $erro = 1;
            $mensagem["ultimo_nome"] = "Campo Ultimo Nome Invalido";
        }

        if (!isset($usuario["email"]) || is_null($usuario['email'])) {
            $erro = 1;
            $mensagem['email'] = 'Campo Email Invalido';
        }

        return ["erro" => $erro, "mensagem" => $mensagem];
    }

    private function prepareUserData(array $dados, $is_logged = 0): array
    {
        $cript = new Criptografia();

        $validacao = $this->validarCamposUsuario($dados);

        if ($validacao['erro']) {
            return ["message" => $validacao['mensagem'], 'error' => 1];
        }
        // RN 04
        if ($is_logged) {
            $dadosUsuario = [
                'data_nascimento' => $dados['data_nascimento'],
                "primeiro_nome" => $dados["primeiro_nome"],
                'ultimo_nome' => $dados['ultimo_nome'],
                'genero' => $dados['genero'] ?? 3,
                'telefone' => $dados['telefone'] ? $cript->encriptarDado($dados['telefone']) : null,
            ];
        } else {
            $dadosUsuario = [
                'data_nascimento' => $dados['data_nascimento'],
                'tipo_usuario' => $dados['tipo_usuario'],
                "primeiro_nome" => $dados["primeiro_nome"],
                'ultimo_nome' => $dados['ultimo_nome'],
                'genero' => $dados['genero'] ?? 3,
                'cpf' => $cript->encriptarDado($dados['cpf']),
                'telefone' => $dados['telefone'] ? $cript->encriptarDado($dados['telefone']) : null,
                'email' => $dados['email'],
                'consentimento_lgpd' => $dados['consentimento_lgpd'] ?? 0
            ];
        }




        if (isset($dados['imagem_perfil']) && !is_null($dados['imagem_perfil'])) {
            $dadosUsuario['files'] = $dados['imagem_perfil'];
        }
        if (isset($dados['senha']) && !empty($dados['senha'])) {
            $dadosUsuario['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
        }

        return $dadosUsuario;
    }

    private function validarCamposEndereco($dados)
    {
        $erro = 0;
        $mensagem = [];
        if (!isset($dados['rua']) || is_null($dados['rua'])) {
            $erro = 1;
            $mensagem['rua'] = 'Campo Rua Invalido';
        }
        if (!isset($dados['bairro']) || is_null($dados['bairro'])) {
            $erro = 1;
            $mensagem['bairro'] = 'Campo Bairro Invalido';
        }
        if (!isset($dados['numero']) || is_null($dados['numero'])) {
            $erro = 1;
            $mensagem['numero'] = 'Campo numero Invalido';
        }
        if (!isset($dados['cep']) || is_null($dados['cep'])) {
            $erro = 1;
            $mensagem['cep'] = 'Campo cep Invalido';
        }
        if (!isset($dados['cidade']) || is_null($dados['cidade'])) {
            $erro = 1;
            $mensagem['cidade'] = 'Campo cidade Invalido';
        }
        if (!isset($dados['estado']) || is_null($dados['estado'])) {
            $erro = 1;
            $mensagem['estado']  = "Campo estado Invalido";
        }

        return [
            'erro' => $erro,
            'mensagem' => $mensagem
        ];
    }
    private function prepareAddressData($usuarioId, array $dadosEnderecoForm): array
    {
        $validacao = $this->validarCamposEndereco($dadosEnderecoForm);

        if ($validacao['erro']) {
            return ["message" => $validacao['mensagem'], 'error' => 1];
        }
        $cript = new Criptografia();
        return [
            'usuario_id' => $usuarioId,
            'rua' => $cript->encriptarDado($dadosEnderecoForm['rua']),
            'bairro' => $cript->encriptarDado($dadosEnderecoForm['bairro']),
            'numero' => $cript->encriptarDado($dadosEnderecoForm['numero']),
            'cep' => $cript->encriptarDado($dadosEnderecoForm['cep']),
            'cidade' => $cript->encriptarDado($dadosEnderecoForm['cidade']),
            'estado' => $dadosEnderecoForm['estado'],
            'complemento' => $dadosEnderecoForm['complemento'] ? $cript->encriptarDado($dadosEnderecoForm['complemento']) :  ''
        ];
    }

    private function validarCamposMedico($dados)
    {
        $erro = 0;
        $mensagem = [];
        if (!isset($dados['crm']) || is_null($dados['crm'])) {
            $erro = 1;
            $mensagem['crm'] = 'Campo CRM Invalido';
        }
        if (!isset($dados['estado_atuacao']) || is_null($dados['estado_atuacao'])) {
            $erro = 1;
            $mensagem['estado_atuacao'] = 'Campo Estado de Atuação Invalido';
        }
        return [
            'erro' => $erro,
            'mensagem' => $mensagem
        ];
    }

    private function prepareMedicoData($usuarioId, array $dados): array
    {
        $validacao = $this->validarCamposMedico($dados);
        if ($validacao['erro']) {
            return ["message" => $validacao['mensagem'], 'error' => 1];
        }
        return [
            'medico_id' => $usuarioId,
            'especialidade' => json_encode($dados['especialidade']) ?? null,
            'crm' => $dados['crm'],
            'estado_atuacao' => $dados['estado_atuacao'],
        ];
    }

    private function validarCamposPaciente($dados)
    {
        $erro = 0;
        $mensagem = [];

        if (!isset($dados['data_nascimento']) || is_null($dados['data_nascimento'])) {
            $erro = 1;
            $mensagem['data_nascimento'] = "Campo Data de Nascimento Invalido";
        }

        return [
            'erro' => $erro,
            'mensagem' => $mensagem
        ];
    }

    private function preparePacienteData(int $usuarioId, array $dados): array
    {
        $validacao = $this->validarCamposPaciente($dados);
        if ($validacao['erro']) {
            return ["message" => $validacao['mensagem'], 'error' => 1];
        }
        $cript = new Criptografia();

        $dados_usuario = [
            'paciente_id' => $usuarioId,
            'peso' => isset($dados['peso']) ? $cript->encriptarDado($dados['peso']) : "",
            'altura' => isset($dados['altura']) ? $cript->encriptarDado($dados['altura']) : "",
            'doencas_diagnosticadas' => isset($dados['doencas_diagnosticadas']) ? $cript->encriptarDado(json_encode($dados['doencas_diagnosticadas'])) : "",
            'desc_deficiencia' => isset($dados['desc_deficiencia']) ? $cript->encriptarDado(json_encode($dados['desc_deficiencia'])) : "",
            'tipo_sanguineo' => isset($dados['tipo_sanguineo']) ? $cript->encriptarDado($dados['tipo_sanguineo']) : "",
            'alergias' => isset($dados['alergias']) ?  $cript->encriptarDado(json_encode($dados['alergias'])) : "",
            'medicacao' => isset($dados['medicacao']) ?  $cript->encriptarDado(json_encode($dados['medicacao'])) : "",
        ];

        return $dados_usuario;
    }

    // RN02
    private function verificarCPF($dados)
    {
        $usuarioModel = new UsuarioModel();
        $cpf = (new Criptografia())->encriptarDado($dados['cpf']);
        $usuario = $usuarioModel->getData(['where' => "cpf = '{$cpf}'"]);
        if ($usuario) {
            foreach ($usuario as $user) {
                if ($user['tipo_usuario'] === $dados['tipo_usuario'] && $user['cpf'] === $cpf)
                    return true;
            }
        }
        return false;
    }

    public function realizarCadastro(array $dados = []): array
    {
        $usuarioModel = new UsuarioModel();
        $retonro_erro = [];

        if (empty($dados)) {
            return ['code' => 401, 'message' => "Dados Inválidos"];
        }

        //RN 02
        if ($usuarioModel->buscarPorEmail($dados["email"] ?? '')) {
            return ['code' => 401, 'message' => "Email já cadastrado!"];
        }

        $senhaLogin = $dados['senha'] ?? null;

        $dadosUsuario = $this->prepareUserData($dados);
        if (isset($dadosUsuario['error'])) {
            $retonro_erro[] = ['code' => 400, 'message' => $dadosUsuario['message']];
        }

        if ($this->verificarCPF($dados)) {
            return ['code' => 401, 'message' => "CPF já cadastrado!"];
        }

        if (isset($dados['endereco'])) {
            $dadosEndereco = $this->prepareAddressData(0, $dados['endereco']);
            if (isset($dadosEndereco['error'])) {
                $retonro_erro[] = ['code' => 400, 'message' => $dadosEndereco['message']];
            }
        } else {
            $retonro_erro[] = ['code' => 400, 'message' => 'Endereço não declarado'];
        }

        if (($dados['tipo_usuario']) === 'medico') {
            $dadosTipoUsuario = $this->prepareMedicoData(0, $dados);
            if (isset($dadosTipoUsuario['error'])) {
                $retonro_erro[] = ['code' => 400, 'message' => $dadosTipoUsuario['message']];
            }
        } else {
            $dadosTipoUsuario = $this->preparePacienteData(0, $dados);
            if (isset($dadosTipoUsuario['error'])) {
                $retonro_erro[] = ['code' => 400, 'message' => $dadosTipoUsuario['message']];
            }
        }

        if (!empty($retonro_erro)) {
            return ['code' => 400, 'message' => json_encode($retonro_erro)];
        }

        $idNovoUsuario = $usuarioModel->AddData($dadosUsuario);
        if (!$idNovoUsuario) {
            return ["code" => 500, 'message' => 'Erro ao registrar usuário'];
        }

        $dadosEndereco = $this->prepareAddressData($idNovoUsuario, $dados['endereco']);
        (new EnderecoModel())->AddData($dadosEndereco);

        if (($dados['tipo_usuario']) === 'medico') {
            $dadosTipoUsuario = $this->prepareMedicoData($idNovoUsuario, $dados);
            (new MedicoModel())->AddData($dadosTipoUsuario);
        } else {
            $dadosTipoUsuario = $this->preparePacienteData($idNovoUsuario, $dados);
            (new PacienteModel())->addData($dadosTipoUsuario);
        }

        $data = (new AutenticacaoService())->realizarLogin(($dados['email']), $senhaLogin);
        return ['code' => 200, 'message' => "Cadastro realizado com sucesso", "token" => $data['token'], 'firstname' => $data['firstname'], 'lastname' => $data['lastname'], "user_photo" => $data['imagem_perfil']];
    }

    // RN 05
    public function buscarDados($dadosUsuario): array
    {
        $dados = (new UsuarioModel($dadosUsuario->usuario_id))->buscarUsuario($dadosUsuario->tipo_usuario);

        if ($dados && $dados['status'] == 1) {
            $coluna = $dadosUsuario->tipo_usuario . '_id';
            unset($dados['usuario_id'], $dados[$coluna], $dados['endereco_id']);
            $criptar = new Criptografia();

            $dados['cpf'] = $criptar->decriptarDado($dados['cpf']);
            $dados['telefone'] = $criptar->decriptarDado($dados['telefone']);

            if ($dadosUsuario->tipo_usuario == 'paciente') {
                $dados['tipo_sanguineo'] = $criptar->decriptarDado($dados['tipo_sanguineo'] ?? "");
                $dados['desc_deficiencia'] = $criptar->decriptarDado($dados['desc_deficiencia'] ?? "");
                $dados['medicacao'] = $criptar->decriptarDado($dados['medicacao'] ?? "");
                $dados['altura'] = $criptar->decriptarDado($dados['altura'] ?? "");
                $dados['peso'] = $criptar->decriptarDado($dados['peso'] ?? "");
                $dados['alergias'] = $criptar->decriptarDado($dados['alergias'] ?? "");
                $dados['doencas_diagnosticadas'] = $criptar->decriptarDado(@$dados['doencas_diagnosticadas'] ?? "");
            }
            $dados['cep'] = $criptar->decriptarDado($dados['cep']);
            $dados['rua'] = $criptar->decriptarDado($dados['rua']);
            $dados['numero'] = $criptar->decriptarDado($dados['numero']);
            $dados['bairro'] = $criptar->decriptarDado($dados['bairro']);
            $dados['cidade'] = $criptar->decriptarDado($dados['cidade']);
            $dados['complemento'] = $criptar->decriptarDado($dados['complemento']);

            return [
                "message" => 'Perfil encontrado',
                'data' => $dados,
                'code' => 200
            ];
        }

        return [
            "message" => 'Perfil não encontrado',
            'data' => [],
            'code' => 404
        ];
    }

    public function editarUsuario(object $dadosSessao, array $dadosFormulario): array
    {
        $usuarioId = $dadosSessao->usuario_id;
        $tipoUsuario = $dadosSessao->tipo_usuario;
        $retonro_erro = [];

        $dadosUsuario = $this->prepareUserData($dadosFormulario, $usuarioId);

        if (isset($dadosFormulario['senha']) && empty($dadosFormulario['senha'])) {
            unset($dadosUsuario['senha']);
        }
        if (isset($dadosUsuario['error'])) {
            $retonro_erro[] = ['code' => 400, 'message' => $dadosUsuario['message']];
        }
        if (isset($dadosFormulario['endereco'])) {
            $dadosEndereco = $this->prepareAddressData($usuarioId, $dadosFormulario['endereco']);
            if (isset($dadosEndereco['error'])) {
                $retonro_erro[] = ['code' => 400, 'message' => $dadosEndereco['message']];
            }
        } else {
            $retonro_erro[] = ['code' => 400, 'message' => 'Endereço não declarado'];
        }

        if (($dadosFormulario['tipo_usuario']) === 'medico') {
            $dadosTipoUsuario = $this->prepareMedicoData($usuarioId, $dadosFormulario);
            if (isset($dadosTipoUsuario['error'])) {
                $retonro_erro[] = ['code' => 400, 'message' => $dadosTipoUsuario['message']];
            }
        } else {
            $dadosTipoUsuario = $this->preparePacienteData($usuarioId, $dadosFormulario);
            if (isset($dadosTipoUsuario['error'])) {
                $retonro_erro[] = ['code' => 400, 'message' => $dadosTipoUsuario['message']];
            }
        }

        if (!empty($retonro_erro)) {
            return ['code' => 400, 'message' => json_encode($retonro_erro)];
        }

        (new UsuarioModel($usuarioId))->editData($dadosUsuario);
        (new EnderecoModel($usuarioId))->editData($dadosEndereco);


        if ($tipoUsuario === 'medico') {

            (new MedicoModel($usuarioId))->editData($dadosTipoUsuario);
        } else {
            (new PacienteModel($usuarioId))->editData($dadosTipoUsuario);
        }


        return [
            "message" => 'Perfil atualizado com sucesso',
            'code' => 200
        ];
    }

    // RN13
    public function desativar(int $idPerfil): array
    {
        if (empty($idPerfil)) {
            return [
                "message" => 'ID não informado',
                'code' => 400
            ];
        }
        $response = (new UsuarioModel($idPerfil))->desativarPerfil();
        if ($response) {
            return [
                "message" => 'Perfil desativado com sucesso',
                'code' => 200
            ];
        } else {
            return [
                "message" => 'Erro ao inativar perfil',
                'code' => 300
            ];
        }
    }

    public function revogarSolicitacao($solicitacao_id)
    {
        $data['status'] = "REVOGADO";
        (new AutorizacaoAcessoModel($solicitacao_id))->editData($data);
        return ["code" => 200, "message" => "Solicitação revogada!"];
    }
    public function negarSolicitacao($solicitacao_id)
    {
        $data['status'] = "RECUSADO";
        (new AutorizacaoAcessoModel($solicitacao_id))->editData($data);
        return ["code" => 200, "message" => "Solicitação negada!"];
    }
    public function aceitarSolicitacao($solicitacao_id)
    {
        $data['status'] = 'APROVADO';
        (new AutorizacaoAcessoModel($solicitacao_id))->editData($data);
        return ["code" => 200, "message" => "Solicitação aprovada!"];
    }
}
