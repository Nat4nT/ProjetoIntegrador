<?php

namespace Controllers;

use Helpers\JsonResponse;
use Services\PacienteService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class PacienteController
{

    public function buscarSolicitacoes(Request $request, Response $response)
    {
        $dadosUsuario = $request->getAttribute('usuario');
        $jsonResponse = new JsonResponse();

        $resposta = (new PacienteService())->buscarSolicitacoes($dadosUsuario->usuario_id);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'data' => $resposta['data'], 'code' => $resposta['code']], $resposta['code']);
    }

   
}
