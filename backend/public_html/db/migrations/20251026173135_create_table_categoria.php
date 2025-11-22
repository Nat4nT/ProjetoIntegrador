<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTableCategoria extends AbstractMigration
{

    public function change(): void
    {
        $tableName = "categoria";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }

        $table = $this->table($tableName, ['id' => 'categoria_id']);
        $table->addColumn('nome', 'string', ['limit' => 255, 'null' => false])
            ->addColumn('usuario_id', 'integer', ['limit' => 11, 'signed' => false, 'null' => true])
            ->addColumn('sis_cat', 'boolean', ['default' => 0])
            ->addTimestamps('data_criacao', 'data_atualizacao')
            ->addForeignKey('usuario_id', 'usuario', 'usuario_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])
            ->create();
    }
}
