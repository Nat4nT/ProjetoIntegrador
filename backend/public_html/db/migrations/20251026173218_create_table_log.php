<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTableLog extends AbstractMigration
{
    public function change(): void
    {
        $tableName = "log";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }

        $table = $this->table($tableName, ['id' => 'log_id']);

        $table
            ->addColumn('acao', 'enum', [
                'values' => ['create', 'read', 'update', 'delete', 'login']
            ])
            ->addColumn('usuario_id', 'integer', ['limit' => 11, 'signed' => false, 'null' => true])
            ->addForeignKey('usuario_id', 'usuario', 'usuario_id')
            ->addColumn('ip', 'string', ['limit' => 60, 'null' => true])
            ->addColumn('metodo_http', 'string', ['limit' => 10, 'null' => true])
            ->addColumn('rota', 'string', ['limit' => 255])
            ->addColumn('status', 'integer', ['null' => true])
            ->addColumn('user_agent', 'string', ['limit' => 255, 'null' => true])
            ->addColumn('resposta', 'text', ['null' => true])
            ->addColumn('data_criacao', 'timestamp', [
                'default' => 'CURRENT_TIMESTAMP',
                'null' => false
            ])

            ->create();
    }
}
