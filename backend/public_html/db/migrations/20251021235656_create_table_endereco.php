<?php

use Phinx\Migration\AbstractMigration;
use Phinx\Db\Adapter\MysqlAdapter;

class CreateTableEndereco extends AbstractMigration
{
    public function change()
    {

        $tableName = "endereco";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        
        $table = $this->table($tableName, ['id' => 'endereco_id']);
        $table
            ->addColumn('usuario_id', 'integer', ['limit' => 11, 'signed' => false])
            ->addColumn('cep', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('rua', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('numero', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('complemento', 'text', ['limit' => MysqlAdapter::TEXT_LONG, 'default' => ''])
            ->addColumn('bairro', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('cidade', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->addColumn('estado', 'enum', [
                'values' => [
                    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
                    'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
                ]
            ])
            ->addTimestamps('data_criacao', 'data_atualizacao')
            ->addForeignKey('usuario_id', 'usuario', 'usuario_id', [
                'delete' => 'CASCADE',
                'update' => 'CASCADE'
            ])
            ->create();
    }
}
