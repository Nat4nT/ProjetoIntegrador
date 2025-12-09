<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

class CategoriaSeeder extends AbstractSeed
{
    // RN11
    public function run(): void
    {

        $data = [
            [
                'nome' => "Laboratorial",
                'sis_cat' => 1
            ],
            [
                'nome' => "Imagem",
                'sis_cat' => 1
            ],
            [
                'nome' => "Laudo",
                'sis_cat' => 1
            ],

        ];

        $this->table('categoria')->insert($data)->saveData();
    }
}
