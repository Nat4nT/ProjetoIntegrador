<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTableAutorizacaoAcesso extends AbstractMigration
{

    public function change(): void
    {
        $tableName = "autorizacao_acesso";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName, ['id' => 'autorizacao_acesso_id']);
        $table->addColumn('paciente_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addColumn('medico_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addColumn('status', 'enum',['values'=>['PENDENTE','REVOGADO','APROVADO'],'default'=> "PENDENTE"])
            ->addTimestamps('data_criacao', 'data_atualizacao')
            ->addForeignKey('paciente_id', 'paciente', 'paciente_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])
            ->addForeignKey('medico_id', 'medico', 'medico_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])->create();
    }
}
