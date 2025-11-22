<?php

namespace Models;

class CategoriaModel extends Model
{
    public $table = "categoria";
    public $id_column_name = "categoria_id";
    public $column_reference = "usuario_id";


}
