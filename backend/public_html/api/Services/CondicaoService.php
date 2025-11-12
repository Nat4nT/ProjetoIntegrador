<?php

namespace Api\Services;

use Api\Models\CondicaoModel;

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
