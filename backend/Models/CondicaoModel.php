<?php

namespace Models;

use PDO;

class CondicaoModel extends Model
{
    public $table = 'condicao';
    public $id_column_name = "condicao_id";

    public function getCondicoes()
    {
        $sql = "SELECT * FROM {$this->table} WHERE tipo = 'doenca' ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $doenca = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $sql = "SELECT * FROM {$this->table} WHERE tipo = 'alergia' ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $alergias = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $sql = "SELECT * FROM {$this->table} WHERE tipo = 'deficiencia' ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $deficiencia = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $sql = "SELECT * FROM {$this->table} WHERE tipo = 'medicacao' ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $medicacao = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "medicacoes"=>$medicacao,
            "doencas" => $doenca,
            "deficiencia" => $deficiencia,
            "alergias" => $alergias
        ];
    }
}
