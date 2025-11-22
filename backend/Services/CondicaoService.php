<?php

namespace Services;

use Models\CondicaoModel;

class CondicaoService
{
    public function getCondicoes()
    {
        return [
            "message" => "Condicoes Registradas",
            "data" => (new CondicaoModel())->getCondicoes(),
            'code' => 200
        ];
    }
}
