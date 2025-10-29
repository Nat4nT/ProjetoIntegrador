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
            ->addColumn('cep', 'string', ['limit' => 9])
            ->addColumn('rua', 'string', ['limit' => 100])
            ->addColumn('numero', 'string', ['limit' => 10])
            ->addColumn('complemento', 'string', ['limit' => 150, 'default' => ''])
            ->addColumn('bairro', 'string', ['limit' => 50])
            ->addColumn('cidade', 'string', ['limit' => 50])
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
