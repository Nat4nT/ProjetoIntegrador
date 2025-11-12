<?php

namespace Api\Controllers;

use Api\Helpers\JsonResponse;
use Api\Services\CategoriaService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CategoriaController
{

    public function index(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $dadosUsuario = $request->getAttribute('usuario');
        $resposta = (new CategoriaService())->getCategorias($dadosUsuario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], "data" => $resposta['data'], 'code' => 200], $resposta['code']);
    }

    public function create(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $dadosUsuario = $request->getAttribute('usuario');
        $dadosFormulario = $request->getParsedBody();

        $resposta = (new CategoriaService())->addCategoria($dadosUsuario, $dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function delete(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $dadosUsuario = $request->getAttribute('usuario');
        $dadosFormulario = $request->getParsedBody();

  

        $resposta = (new CategoriaService())->deletarCategoria($dadosFormulario['categoria_id']);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }
}
