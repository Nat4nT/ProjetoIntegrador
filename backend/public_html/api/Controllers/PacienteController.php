<?php

namespace Api\Controllers;

use Api\Helpers\JsonResponse;
use Api\Services\PacienteService;
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

    public function aceitarSolicitacao(Request $request, Response $response)
    {
        $dadosFormulario = $request->getParsedBody()['solicitacao_id'];
        $jsonResponse = new JsonResponse();
        $resposta = (new PacienteService())->aceitarSolicitacao($dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'],  'code' => $resposta['code']], $resposta['code']);

    }
    public function negarSolicitacao(Request $request, Response $response)
    {
        $dadosFormulario = $request->getParsedBody()['solicitacao_id'];
        $jsonResponse = new JsonResponse();
        $resposta = (new PacienteService())->negarSolicitacao($dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'],  'code' => $resposta['code']], $resposta['code']);
    }
}
