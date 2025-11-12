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
        ];

        $this->table('condicao')
            ->insert($data)
            ->saveData();
    }
}
