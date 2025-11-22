<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTableExame extends AbstractMigration
{

    public function change(): void
    {
        $tableName = "exame";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName, ["id" => 'exame_id']);
        $table->addColumn('usuario_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addColumn('nome_exame', 'string', ['limit' => 255])
            ->addColumn('data_realizacao', 'date')
            ->addColumn('arquivo_exame', 'string', ['limit' => 500])
            ->addColumn('nome_lab', 'string', ['limit' => 100])
            ->addTimestamps('data_criacao', 'data_atualizacao')
            ->addForeignKey('usuario_id', 'usuario', 'usuario_id', [
                'delete' => 'CASCADE',
                'update' => 'CASCADE'
            ])
            ->create();
    }
}
