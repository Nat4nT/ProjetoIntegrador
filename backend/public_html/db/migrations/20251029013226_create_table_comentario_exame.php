<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;
use Phinx\Db\Adapter\MysqlAdapter;

final class CreateTableComentarioExame extends AbstractMigration
{

    public function change(): void
    {

        $tableName = "comentario_exame";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName, ['id' => 'comentario_exame_id']);
        $table->addColumn('exame_id', 'integer', ['limit'    => 11, 'signed'  => false])
            ->addColumn('usuario_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addColumn('comentario', 'string', ['limit'   => 500])
            ->addTimestamps('data_criacao', 'data_atualizacao')
            ->addForeignKey('exame_id', 'exame', 'exame_id', [
                'delete' => 'CASCADE',
                'update' => 'CASCADE'
            ])->addForeignKey('usuario_id', 'usuario', 'usuario_id', [
                'delete' => 'RESTRICT',
                'update' => 'CASCADE'
            ])->create();
    }
}
