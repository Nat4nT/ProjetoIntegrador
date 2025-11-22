<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTablePacienteCodicao extends AbstractMigration
{

    public function change(): void
    {
        $tableName = "paciente_condicao";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName, ["id" => 'paciente_condicao_id']);
        $table->addColumn('paciente_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addColumn('condicao_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addForeignKey('paciente_id', 'paciente', 'paciente_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])
            ->addForeignKey('condicao_id', 'condicao', 'condicao_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])->addTimestamps('data_criacao', 'data_atualizacao')->create();
    }
}
