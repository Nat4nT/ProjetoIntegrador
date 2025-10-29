<?php

namespace App\Controllers;

use App\Helpers\Token;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class AutenticacaoController
{
    public function login(Request $request, Response $response, $args): Response
    {
        $body = $request->getParsedBody();
        $usuario = $body['usuario'] ?? '';
        $senha = $body['senha'] ?? '';

        // Exemplo fixo — substitua por consulta no banco
        if ($usuario === 'admin' && $senha === '123') {
            $token = Token::gerarToken(['user' => $usuario]);

            $response->getBody()->write(json_encode(['token' => $token]));
            return $response->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(['error' => 'Credenciais inválidas']));
        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    }
}
