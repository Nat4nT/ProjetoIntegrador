<?php

namespace Api\Services;

use Api\Models\AutorizacaoAcessoModel;
use Api\Models\PacienteModel;

class PacienteService
{
    public function buscarSolicitacoes($paciente_id)
    {

        $solicitacoes = (new PacienteModel($paciente_id))->buscarSolicitacoes();

        foreach ($solicitacoes as $solicitacao) {

            $data[] = [
                'solcitacao_id' => $solicitacao['autorizacao_acesso_id'],
                'primeiro_nome' => $solicitacao['primeiro_nome'],
                'ultimo_nome' => $solicitacao['ultimo_nome'],
                'imagem_perfil' => $solicitacao['imagem_perfil'],
                'especialidade' => $solicitacao['especialidade'],
                'crm' => $solicitacao['crm'],
                'status' => $solicitacao['status_solicitacao'],
                'estado_atuacao' => $solicitacao['estado_atuacao'],
                'genero' => $solicitacao['genero'],
                'data_criacao' => $solicitacao['data_solicitacao'],
            ];
        }



        if ($solicitacoes) {
            return ["code" => 200, "message" => "Solicitações encontradas", "data" => $data];
        } else {
            return ["code" => 200, "message" => "Não há Solicitações", "data" => []];
        }
    }

    public function revogarSolicitacao($solicitacao_id)
    {
        $data['status'] = "REVOGADO";
        (new AutorizacaoAcessoModel($solicitacao_id))->editData($data);
        return ["code" => 200, "message" => "Solicitação negada!"];
    }
    public function negarSolicitacao($solicitacao_id)
    {
        $data['status'] = "NEGADO";
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
