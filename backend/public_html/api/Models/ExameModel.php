<?php

namespace Api\Models;

use PDO;

class ExameModel extends Model
{
    public $table = "exame";
    public $id_column_name = "exame_id";
    public $column_reference = "usuario_id";

    public function getUserExames($id_usuario)
    {
        $sql = "SELECT * FROM {$this->table} 
        INNER JOIN categoria_exame USING({$this->id_column_name}) 
        INNER JOIN categoria USING(categoria_id)
        WHERE {$this->table}.{$this->column_reference} = :id_usuario ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id_usuario", $id_usuario);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getExame()
    {
        $sql = "SELECT * FROM {$this->table}
        WHERE {$this->table}.{$this->id_column_name} = :exame_id ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":exame_id", $this->id);
        $stmt->execute();
        $exame = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT comentario_exame.*,u.primeiro_nome,u.ultimo_nome,u.imagem_perfil FROM comentario_exame
        INNER JOIN usuario u USING(usuario_id)
        WHERE {$this->id_column_name} = :exame_id ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":exame_id", $this->id);
        $stmt->execute();
        $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "exame"=> $exame,
            "comentarios"=>$comentarios
        ];
    }
}
