<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTableCondicao extends AbstractMigration
{

    public function change(): void
    {
        $tableName = "condicao";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName,['id'=>'condicao_id']);
        $table->addColumn('nome','string',['limit'=> 255,'null'=> false])
        ->addColumn('tipo','enum',['values'=>['alergia','doenca','deficiencia','medicacao']])
        ->addTimestamps('data_criacao', 'data_atualizacao')
        ->create();

    }
}
