<?php

namespace Models;

use PDO;

class PacienteModel extends Model
{
    public  $table = "paciente";
    public $id_column_name = 'paciente_id';

    public function buscarSolicitacoes()
    {
        $sql = "SELECT *, ac.`status` as status_solicitacao, ac.data_criacao as data_solicitacao  FROM autorizacao_acesso ac
        INNER JOIN medico USING(medico_id)
        INNER JOIN usuario ON usuario_id = medico_id
        WHERE {$this->id_column_name} = {$this->id}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
