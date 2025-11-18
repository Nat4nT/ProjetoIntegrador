<?php

namespace Api\Controllers;

use Api\Helpers\JsonResponse;
use Api\Services\MedicoService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class MedicoController
{
    public function solicitarAcesso(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $medico = $request->getAttribute('usuario');
        $paciente = $request->getParsedBody();

        if (!isset($paciente['paciente_id'])) {
            return $jsonResponse->emitirResposta($response, ['message' => "Dados Invalidos", "code" => 400]);
        }

        $resposta = (new MedicoService())->solicitar_acesso($medico->usuario_id, $paciente['paciente_id']);
        return $jsonResponse->emitirResposta($response, ["message" => $resposta['message'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function buscarPaciente(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $dado_pesquisa = $request->getParsedBody()['user'];

        $resposta = (new MedicoService())->buscar_usuario($dado_pesquisa);

        return $jsonResponse->emitirResposta($response, ['message' => $resposta['message'], 'code' => $resposta['code'], 'data' => $resposta['data']], $resposta['code']);
    }

    public function buscarPacientes(Request $request, Response $response)
    {
        $medico = $request->getAttribute('usuario');

        $resposta = (new MedicoService())->buscar_pacientes($medico->usuario_id);
        return (new JsonResponse())->emitirResposta($response, ['message' => $resposta['message'], 'data' => $resposta['data'], 'code' => $resposta['code']], $resposta['code']);
    }

    public function buscarExamesPaciente(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $medico = $request->getAttribute('usuario');

        $dado_pesquisa = $request->getParsedBody()['paciente_id'];
        $resposta = (new MedicoService())->buscar_exames($medico->usuario_id, $dado_pesquisa);
        return $jsonResponse->emitirResposta($response, ['message' => $resposta['message'], 'code' => $resposta['code'], 'data' => $resposta['data']], $resposta['code']);
    }

    public function buscarCategoriasPaciente(Request $request, Response $response)
    {
        $jsonResponse = new JsonResponse();
        $medico = $request->getAttribute('usuario');

        $dado_pesquisa = $request->getParsedBody()['paciente_id'];
        $resposta = (new MedicoService())->buscar_categorias($medico->usuario_id, $dado_pesquisa);
        return $jsonResponse->emitirResposta($response, ['message' => $resposta['message'], 'code' => $resposta['code'], 'data' => $resposta['data']], $resposta['code']);
    }
}
