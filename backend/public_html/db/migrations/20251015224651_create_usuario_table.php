<?php

declare(strict_types=1);

use Phinx\Db\Adapter\MysqlAdapter;
use Phinx\Migration\AbstractMigration;

final class CreateUsuarioTable extends AbstractMigration
{
    public function change(): void
    {
        $tableName = "usuario";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName, ['id' => 'usuario_id']);

        $table->addColumn('tipo_usuario', 'enum', ['values' => ['paciente', 'medico']])
            ->addColumn('primeiro_nome', 'string', ['limit' => 100])
            ->addColumn('ultimo_nome', 'string', ['limit' => 100])
            ->addColumn('genero', 'integer', ['limit' => 11, 'default' => 0])
            ->addColumn('imagem_perfil', 'text', ['null' => true, 'limit' => 300])
            ->addColumn('cpf', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('telefone', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('email', 'string', ['limit' => 500])
            ->addColumn('senha', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('consentimento_lgpd', 'boolean', ['default' => false])
            ->addColumn('status', 'boolean', ['default' => true])
            ->addColumn('data_nascimento', 'date', ['null' => false])
            ->addIndex(['email'], ['unique' => true])
            ->addTimestamps('data_criacao', 'data_atualizacao')->create();
    }
}
