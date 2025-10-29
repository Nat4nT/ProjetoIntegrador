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
        $table->addColumn('acao', 'enum', ['values' => ['create', 'read', 'update', 'delete', 'login']]);
        $table->addColumn('usuario_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addForeignKey('usuario_id', 'usuario', 'usuario_id')
            ->addColumn('ip', 'string', ['limit' => 60])
            ->addColumn('desc', 'string', ['limit' => 255])
            ->addTimestamps('created_at')
            ->create();
    }
}
