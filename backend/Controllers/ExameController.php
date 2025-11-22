<?php

namespace Controllers;

use Helpers\JsonResponse;
use Services\ExameService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ExameController
{

    public function index(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $dadosUsuario = $request->getAttribute('usuario');
        $resposta = (new ExameService())->getExames($dadosUsuario->usuario_id);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], "data" => $resposta['data'], 'code' => 200], $resposta['code']);
    }
    public function create(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $dadosUsuario = $request->getAttribute('usuario');
        $dadosFormulario = $request->getParsedBody();
        $uploadedFiles = $request->getUploadedFiles();
        $dadosFormulario['files'] = $uploadedFiles;


        $resposta = (new ExameService())->addExame($dadosUsuario, $dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }
    public function edit(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $dadosUsuario = $request->getAttribute('usuario');
        $dadosFormulario = $request->getParsedBody();
        $uploadedFiles = $request->getUploadedFiles();
        $dadosFormulario['files'] = $uploadedFiles;


        $resposta = (new ExameService())->editExame($dadosUsuario, $dadosFormulario);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }
    public function delete(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $body = $request->getParsedBody();
        $id_exame = $body['exame_id'] ?? null;
        if ($id_exame === null) {
            return $jsonResponse->emitirResposta($response, ["message" => "Id invalido", 'code' => 400], 400);
        }
        $resposta = (new ExameService())->deleteExame($id_exame);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }
    public function getExame(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $body = $request->getParsedBody();
        $id_exame = $body['exame_id'] ?? null;
        if ($id_exame === null) {
            return $jsonResponse->emitirResposta($response, ["message" => "Id invalido", 'code' => 400], 400);
        }

        $resposta = (new ExameService())->getExame($id_exame);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code'], "data" => [$resposta['data']]], $resposta['code']);
    }

    public function criarComentario(Request $request, Response $response)
    {
        $medico = $request->getAttribute('usuario');
        $comentario = $request->getParsedBody();
        $resposta = (new ExameService())->criarComentario($medico,$comentario);

        return (new JsonResponse())->emitirResposta($response, ["message" => $resposta['message'],'data'=>$resposta['data'], 'code' => $resposta['code']], $resposta['code']);
    }
    public function editarComentario(Request $request, Response $response)
    {
        $medico = $request->getAttribute('usuario');
        $comentario = $request->getParsedBody();
        $resposta = (new ExameService())->editarComentario($medico,$comentario);

        return (new JsonResponse())->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }
    public function deletarComentario(Request $request, Response $response)
    {
        $medico = $request->getAttribute('usuario');
        $comentario = $request->getParsedBody();
        $resposta = (new ExameService())->deletarComentario($medico,$comentario);

        return (new JsonResponse())->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }
}
