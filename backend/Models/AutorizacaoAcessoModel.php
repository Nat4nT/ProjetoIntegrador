<?php

namespace Models;

use PDO;

class AutorizacaoAcessoModel extends Model
{
    public $table = "autorizacao_acesso";
    public $id_column_name = "autorizacao_acesso_id";


    public function buscarSolicitacao($paciente_id, $medico_id)
    {
        $sql = "SELECT {$this->id_column_name},`status` FROM {$this->table} WHERE paciente_id = :paciente_id AND medico_id = :medico_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":paciente_id", $paciente_id);
        $stmt->bindParam(":medico_id", $medico_id);
        $stmt->execute();
        
        $solicitacao = $stmt->fetch(PDO::FETCH_ASSOC);

        return $solicitacao;
    }
}
