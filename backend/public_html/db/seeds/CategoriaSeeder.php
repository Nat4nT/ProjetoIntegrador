<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

class CategoriaSeeder extends AbstractSeed
{

    public function run(): void
    {

        $data = [
            [
                'categoria_id' => 1,
                'nome' => "Laboratorial",
                'sis_cat' => 1
            ],
            [
                'categoria_id' => 2,
                'nome' => "Imagem",
                'sis_cat' => 1
            ],
            [
                'categoria_id' => 3,
                'nome' => "Laudo",
                'sis_cat' => 1
            ],

        ];

        $this->table('categoria')->insert($data)->saveData();
    }
}
