<?php

declare(strict_types=1);

use Phinx\Db\Adapter\MysqlAdapter;
use Phinx\Migration\AbstractMigration;

final class CreatePacienteTable extends AbstractMigration
{

    public function change(): void
    {
        $tableName = "paciente";
        if ($this->hasTable($tableName)) {
            $this->table($tableName)->drop()->save();
        }
        $table = $this->table($tableName, [
            "id" => false,
            "primary_key" => ['paciente_id']
        ]);
        $table->addColumn('paciente_id', 'integer', ['signed' => false, 'null' => false])
            ->AddColumn('peso', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            ->AddColumn('altura', 'text', ['limit' => MysqlAdapter::TEXT_LONG])
            // ->AddColumn('peso', 'decimal', ['precision' => 5, 'scale' => 2, 'null' => true, 'default' => null])
            // ->AddColumn('altura', 'decimal', ['precision' => 3, 'scale' => 2, 'null' => true, 'default' => null])
            ->addColumn('desc_deficiencia', 'text', ['limit' => MysqlAdapter::TEXT_LONG, 'default' => null])
            // ->addColumn('tipo_sanguineo', 'enum', ['values' => ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], 'default' => null])
            ->addColumn('tipo_sanguineo', 'text', ['limit' => MysqlAdapter::TEXT_LONG, 'default' => null])
            ->addColumn('alergias', 'text', ['limit' => MysqlAdapter::TEXT_LONG, 'default' => null])
            ->addColumn('doencas_diagnosticadas', 'text', ['limit' => MysqlAdapter::TEXT_LONG, 'default' => null])
            ->addColumn('medicacao', 'text', ['limit' => MysqlAdapter::TEXT_LONG,'default'=> null])

            ->addForeignKey('paciente_id', 'usuario', 'usuario_id', [
                'delete' => 'CASCADE',
                'update' => 'NO_ACTION'
            ])
            ->create();
    }
}
