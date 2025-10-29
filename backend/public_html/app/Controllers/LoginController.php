<?php

namespace App\Controllers;

use App\Helpers\JsonResponse;
use App\Models\UsuarioModel;
use App\Services\AutenticacaoService;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class LoginController
{
    public function realizarLogin(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $email = @$data['email'];
        $password = @$data['senha'];

        $data = (new AutenticacaoService())->realizarLogin($email, senha: $password);
        $json = new JsonResponse();

        if (!isset($data['token'])) {
            return $json->emitirResposta($response, ['message' => 'Login inválido', 'data' => [], 'code' => 401], 401);
        }


        $data = [
            'message' => 'Login realizado com sucesso',
            'data' => [
                'token' => $data['token'],
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname']
            ],
            'code' => 200
        ];
        return $json->emitirResposta($response, $data, 200);
    }
}
