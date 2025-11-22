<?php 
namespace Controllers;

use Helpers\JsonResponse;
use Services\CondicaoService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CondicaoController{
 public function index(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $resposta = (new CondicaoService())->getCondicoes();
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], "data" => $resposta['data'], 'code' => 200], $resposta['code']);
    }

}