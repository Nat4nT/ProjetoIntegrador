<?php

namespace Api\Controllers;

use Api\Helpers\JsonResponse;
use Api\Services\AutenticacaoService;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class LoginController
{
    public function realizarLogin(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $email = @$data['email'];
        $password = @$data['senha'];

        $data = (new AutenticacaoService())->realizarLogin($email,  $password);
        $json = new JsonResponse();

        if (!isset($data['token'])) {
            return $json->emitirResposta($response, ['message' => 'Login inválido', 'data' => [], 'code' => 401], 401);
        }

        if ($data['status'] == 0) {
            return $json->emitirResposta($response, ['message' => 'Conta Inativa', 'data' => [], 'code' => 401], 401);
        }


        $data = [
            'message' => 'Login realizado com sucesso',
            'data' => [
                'token' => $data['token'],
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                "user_photo" => $data["imagem_perfil"],
            ],
            'code' => 200
        ];
        return $json->emitirResposta($response, $data, 200);
    }
}
