<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTableCategoriaExame extends AbstractMigration
{
    public function change(): void
    {
        $tableName = "categoria_exame";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName, ['id' => 'categoria_exame_id']);
        $table->addColumn("categoria_id", "integer", ["limit" => 11, "signed" => false])
            ->addColumn("exame_id", "integer", ["limit" => 11, "signed" => false])
            ->addForeignKey('categoria_id', 'categoria', 'categoria_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])
            ->addForeignKey('exame_id', 'exame', 'exame_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])
            ->addTimestamps('data_criacao', 'data_atualizacao')->create();
    }
}
