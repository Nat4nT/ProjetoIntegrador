<?php 

namespace Api\Models;

class CategoriaExameModel extends Model{
    public $table = "categoria_exame";
    public $id_column_name = "categoria_exame_id";


    public function deleteAll($exame_id){
        $sql = "DELETE FROM {$this->table} WHERE exame_id = {$exame_id}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->rowCount();
    }   
}