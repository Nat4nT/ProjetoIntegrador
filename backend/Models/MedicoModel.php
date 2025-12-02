<?php

namespace Models;

use PDO;

class MedicoModel extends Model
{
    public $table = "medico";
    public $id_column_name = 'medico_id';

    public function buscarPacientes()
    {
        $sql = "SELECT p.*,u.*,ac.data_atualizacao, ac.`status`, ac.autorizacao_acesso_id  FROM autorizacao_acesso ac
        INNER JOIN paciente p USING(paciente_id)
        INNER JOIN usuario u ON p.paciente_id = u.usuario_id
        WHERE {$this->id_column_name} = {$this->id}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function buscarPaciente($paciente_id): mixed
    {
        $sql = "SELECT * FROM autorizacao_acesso 
        INNER JOIN paciente USING(paciente_id)
        INNER JOIN medico USING({$this->id_column_name})
        WHERE {$this->id_column_name} = {$this->id}
        AND paciente_id = :paciente_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":paciente_id", $paciente_id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }
}
