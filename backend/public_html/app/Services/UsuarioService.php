<?php

namespace App\Services;

use App\Helpers\Criptografia;
use App\Models\EnderecoModel;
use App\Models\MedicoModel;
use App\Models\PacienteModel;
use App\Models\UsuarioModel;
use App\Services\AutenticacaoService;


class UsuarioService
{

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

    private function prepareUserData(array $dados): array
    {

        $validacao = $this->validarCamposUsuario($dados);

        if ($validacao['erro']) {
            return ["message" => $validacao['mensagem'], 'error' => 1];
        }

        $dadosUsuario = [
            'tipo_usuario' => $dados['tipo_usuario'],
            "primeiro_nome" => $dados["primeiro_nome"],
            'ultimo_nome' => $dados['ultimo_nome'],
            'genero' => $dados['genero'] ?? 3,
            'cpf' => (new Criptografia())->encriptarDado($dados['cpf']),
            'telefone' => $dados['telefone'] ?? null,
            'email' => $dados['email'],
            'consentimento_lgpd' => $dados['consentimento_lgpd'] ?? 0
        ];

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
        return [
            'usuario_id' => $usuarioId,
            'rua' => $dadosEnderecoForm['rua'],
            'bairro' => $dadosEnderecoForm['bairro'],
            'numero' => $dadosEnderecoForm['numero'],
            'cep' => $dadosEnderecoForm['cep'],
            'cidade' => $dadosEnderecoForm['cidade'],
            'estado' => $dadosEnderecoForm['estado'],
            'complemento' => $dadosEnderecoForm['complemento'] ?? ''
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
            'especialidade' => $dados['especialidade'] ?? null,
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

        $dados_usuario = [
            'paciente_id' => $usuarioId,
            'data_nascimento' => $dados['data_nascimento'],
            'peso' => @$dados['peso'],
            'altura' => @$dados['altura'],
            'doencas_diagnosticadas' => isset($dados['doencas_diagnosticadas']) ? json_encode(@$dados['doencas_diagnosticadas']) : null,
            'desc_deficiencia' => @$dados['desc_deficiencia'],
            'tipo_sanguineo' => @$dados['tipo_sanguineo'],
            'alergias' => isset($dados['alergias']) ? json_encode(@$dados['alergias']) : null,
            'medicacao' => isset($dados['medicacao']) ? json_encode(@$dados['medicacao']) : null,
        ];

        return $dados_usuario;
    }

    public function realizarCadastro(array $dados = []): array
    {
        $usuarioModel = new UsuarioModel();
        $retonro_erro = [];

        if (empty($dados)) {
            return ['code' => 401, 'message' => "Dados Inválidos"];
        }

        if ($usuarioModel->buscarPorEmail($dados["email"] ?? '')) {
            return ['code' => 401, 'message' => "Email já cadastrado!"];
        }

        $senhaLogin = $dados['senha'] ?? null;

        $dadosUsuario = $this->prepareUserData($dados);
        if (isset($dadosUsuario['error'])) {
            $retonro_erro[] = ['code' => 400, 'message' => $dadosUsuario['message']];
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

        $data = (new AutenticacaoService())->realizarLogin($dados['email'], $senhaLogin);
        return ['code' => 200, 'message' => "Cadastro realizado com sucesso", "token" => $data['token'], 'firstname' => $data['firstname'], 'lastname' => $data['lastname']];
    }


    public function buscarDados($dadosUsuario): array
    {
        $dados = (new UsuarioModel($dadosUsuario->usuario_id))->buscarUsuario($dadosUsuario->tipo_usuario);

        if ($dados && $dados['status'] == 1) {
            $coluna = $dadosUsuario->tipo_usuario . '_id';
            unset($dados['usuario_id'], $dados[$coluna], $dados['endereco_id']);

            $dados['cpf'] = (new Criptografia())->decriptarDado($dados['cpf']);

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

        $dadosUsuario = $this->prepareUserData($dadosFormulario);

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
                'code' => 200
            ];
        }
    }
}
