<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

class CondicaoSeeder extends AbstractSeed
{
    public function run(): void
    {
        $data = [
            ['nome' => 'Hipertensão arterial', 'tipo' => 'doenca'],
            ['nome' => 'Diabetes mellitus tipo 2', 'tipo' => 'doenca'],
            ['nome' => 'Asma', 'tipo' => 'doenca'],
            ['nome' => 'DPOC (doença pulmonar obstrutiva crônica)', 'tipo' => 'doenca'],
            ['nome' => 'Doença cardíaca isquêmica', 'tipo' => 'doenca'],
            ['nome' => 'Insuficiência cardíaca', 'tipo' => 'doenca'],
            ['nome' => 'Dislipidemia (colesterol alto)', 'tipo' => 'doenca'],
            ['nome' => 'Hipotireoidismo', 'tipo' => 'doenca'],
            ['nome' => 'Artrite/Artrose (osteoartrite)', 'tipo' => 'doenca'],
            ['nome' => 'Enxaqueca', 'tipo' => 'doenca'],
            ['nome' => 'Doença renal crônica', 'tipo' => 'doenca'],
            ['nome' => 'Depressão', 'tipo' => 'doenca'],
            ['nome' => 'Transtorno de ansiedade', 'tipo' => 'doenca'],
            ['nome' => 'Apneia do sono', 'tipo' => 'doenca'],
            ['nome' => 'Penicilina', 'tipo' => 'alergia'],
            ['nome' => 'Amoxicilina', 'tipo' => 'alergia'],
            ['nome' => 'Cefalosporinas', 'tipo' => 'alergia'],
            ['nome' => 'Dipirona (metamizol)', 'tipo' => 'alergia'],
            ['nome' => 'AAS (aspirina)', 'tipo' => 'alergia'],
            ['nome' => 'Ibuprofeno', 'tipo' => 'alergia'],
            ['nome' => 'AINEs (anti-inflamatórios)', 'tipo' => 'alergia'],
            ['nome' => 'Iodo / contraste iodado', 'tipo' => 'alergia'],
            ['nome' => 'Látex', 'tipo' => 'alergia'],
            ['nome' => 'Frutos do mar / mariscos', 'tipo' => 'alergia'],
            ['nome' => 'Amendoim', 'tipo' => 'alergia'],
            ['nome' => 'Proteína do leite', 'tipo' => 'alergia'],
            ['nome' => 'Ovo', 'tipo' => 'alergia'],
            ['nome' => 'Picada de inseto', 'tipo' => 'alergia'],
            ["nome" => "Losartana 50 mg", 'tipo' => 'medicacao'],
            ["nome" => "Enalapril 10 mg", 'tipo' => 'medicacao'],
            ["nome" => "Hidroclorotiazida 25 mg", 'tipo' => 'medicacao'],
            ["nome" => "Metformina 850 mg", 'tipo' => 'medicacao'],
            ["nome" =>  "Insulina NPH", 'tipo' => 'medicacao'],
            ["nome" => "Atorvastatina 20 mg", 'tipo' => 'medicacao'],
            ["nome" => "Sinvastatina 20 mg", 'tipo' => 'medicacao'],
            ["nome" => "Levotiroxina 50 mcg", 'tipo' => 'medicacao'],
            ["nome" => "Omeprazol 20 mg", 'tipo' => 'medicacao'],
            ["nome" => "Sertralina 50 mg", 'tipo' => 'medicacao'],
            ["nome" => "Fluoxetina 20 mg", 'tipo' => 'medicacao'],
            ["nome" => "Paracetamol 750 mg", 'tipo' => 'medicacao'],
            ["nome" => "Dipirona 500 mg", 'tipo' => 'medicacao'],
            ["nome" => "Ibuprofeno 400 mg", 'tipo' => 'medicacao'],
            ["nome" => "Loratadina 10 mg", 'tipo' => 'medicacao'],
            ["nome" => "Cetirizina 10 mg", 'tipo' => 'medicacao'],
            ["nome" => "Salbutamol (spray)", 'tipo' => 'medicacao'],
            ["nome" => "Budesonida (inalatório)", "tipo" => "medicacao"],
            ["nome" => "Deficiência física/motora", "tipo" => "deficiencia"],
            ["nome" => "Deficiência auditiva", "tipo" => "deficiencia"],
            ["nome" => "Deficiência visual (cegueira)", "tipo" => "deficiencia"],
            ["nome" => "Deficiência visual (baixa visão)", "tipo" => "deficiencia"],
            ["nome" => "Deficiência visual (visão monocular)", "tipo" => "deficiencia"],
            ["nome" => "Deficiência intelectual", "tipo" => "deficiencia"],
            ["nome" => "Deficiência múltipla", "tipo" => "deficiencia"],
            ["nome" => "Deficiência psicossocial/saúde mental", "tipo" => "deficiencia"],
            ["nome" => "Síndrome de Down", "tipo" => "deficiencia"],
            ["nome" => "Transtorno do Espectro Autista (TEA)", "tipo" => "deficiencia"],
        ];

        



        $this->table('condicao')
            ->insert($data)
            ->saveData();
    }
}
