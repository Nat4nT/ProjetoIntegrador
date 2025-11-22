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
        $data = [];
        $sql = "SELECT {$this->table}.* FROM {$this->table} 
        WHERE {$this->table}.{$this->column_reference} = :id_usuario ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id_usuario", $id_usuario);
        $stmt->execute();
        $exames = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($exames as $exame) {

            $sql = "SELECT comentario_exame.*,u.primeiro_nome,u.ultimo_nome,u.imagem_perfil FROM comentario_exame
            INNER JOIN usuario u USING(usuario_id)
            WHERE {$this->id_column_name} = :exame_id ";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":exame_id", $exame[$this->id_column_name]);
            $stmt->execute();
            $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT categoria.nome,categoria.categoria_id FROM categoria_exame INNER JOIN categoria USING(categoria_id)  WHERE {$this->id_column_name}=:exame_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":exame_id", $exame[$this->id_column_name]);
            $stmt->execute();
            $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $exame['categoria']=$categorias;
            $exame['comentario']=$comentarios;
            $data[] = [
                'exame' => $exame,
            ];
        }

        return $data;
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
            "exame" => $exame,
            "comentarios" => $comentarios
        ];
    }
}
