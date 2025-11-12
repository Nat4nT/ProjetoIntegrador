<?php

namespace Api\Services;

use Api\Helpers\Criptografia;
use Api\Models\AutorizacaoAcessoModel;
use Api\Models\ExameModel;
use Api\Models\MedicoModel;
use Api\Models\UsuarioModel;

class MedicoService
{

    public function solicitar_acesso($medico_id, $paciente_id)
    {
        $data = [
            "medico_id" => $medico_id,
            "paciente_id" => $paciente_id
        ];

        $acessoModel = new AutorizacaoAcessoModel();


        if (!is_null($medico_id) && !is_null($paciente_id)) {
            if (!$acessoModel->buscarSolicitacao($paciente_id, $medico_id)) {
                (new AutorizacaoAcessoModel())->AddData($data);
                return ['code' => 200, 'message' => 'Solicitação enviada!'];
            } else {
                return ['code' => 200, 'message' => 'Solicitação já envida'];
            }
        } else {
            return ['code' => 400, 'message' => "Dados Invalidos"];
        }
    }

    public function buscar_usuario($dado)
    {
        $usuario = (new UsuarioModel())->buscarUsuarioPorPerfil((new Criptografia())->encriptarDado($dado));
        $criptar = new Criptografia();
        // var_dump($usuario);
        $dados = [];

        $dados['paciente_id'] = $usuario['paciente_id'];
        $dados['cpf'] = $criptar->decriptarDado($usuario['cpf']);
        $dados['telefone'] = $criptar->decriptarDado($usuario['telefone']);
        $dados['tipo_sanguineo'] = $criptar->decriptarDado($usuario['tipo_sanguineo'] ?? "");
        $dados['desc_deficiencia'] = $criptar->decriptarDado($usuario['desc_deficiencia'] );
        $dados['primeiro_nome'] = $usuario['primeiro_nome'];
        $dados['ultimo_nome'] = $usuario['ultimo_nome'];
        $dados['email'] = $usuario['email'];
        $dados['imagem_perfil'] = $usuario['imagem_perfil'];
        $dados['medicacao'] = $criptar->decriptarDado($usuario['medicacao'] ?? "");
        $dados['altura'] = $criptar->decriptarDado($usuario['altura'] ?? "");
        $dados['peso'] = $criptar->decriptarDado($usuario['peso'] ?? "");
        $dados['alergias'] = $criptar->decriptarDado($usuario['alergias'] ?? "");
        $dados['doencas_diagnosticadas'] = $criptar->decriptarDado(@$usuario['doencas_diagnosticadas'] ?? "");

        if ($usuario) {
            return ["code" => 200, "message" => "Perfil Encontrado", "data" => $dados];
        } else {
            return ["code" => 400, "message" => "Perfil não encontrado", "data" => []];
        }
    }

    public function buscar_exames($medico, $paciente_id)
    {
        $medicoModel = new MedicoModel($medico);
        if ($medicoModel->buscarPaciente($paciente_id)->status) {
            return ["code" => 200, "message" => "Exames encontrados", "data" => (new ExameModel())->getUserExames($paciente_id)];
        } else {
            return ["code" => 400, "message" => "Não ha permissão de acesso", "data" => []];
        }
    }
}
