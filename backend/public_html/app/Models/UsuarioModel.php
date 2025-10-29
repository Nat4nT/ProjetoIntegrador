<?php

namespace App\Models;

use PDO;

class UsuarioModel extends Model
{
    public $table = 'usuario';
    public $id_column_name = 'usuario_id';

    public function buscarPorEmail($email)
    {
        $sql = "SELECT usuario_id, senha, tipo_usuario,primeiro_nome,ultimo_nome FROM {$this->table} WHERE email = :email AND `status` = 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":email", $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function buscarUsuario(string $tabela_append){
        $sql = "SELECT * FROM {$this->table} INNER JOIN {$tabela_append}  ON {$tabela_append}_id = {$this->id_column_name} INNER JOIN endereco USING({$this->id_column_name}) WHERE {$this->id_column_name} = {$this->id} AND status = 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function desativarPerfil(){
        $sql = "UPDATE {$this->table} SET `status` = 0 WHERE {$this->id_column_name} = {$this->id} ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->rowCount();
    }
}
