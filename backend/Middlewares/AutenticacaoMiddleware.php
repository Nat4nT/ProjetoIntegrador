<?php

namespace Middlewares;

use Helpers\Token;
use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as SlimResponse;

class AutenticacaoMiddleware implements MiddlewareInterface
{

    public function process(Request $request, Handler $handler): Response
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->unauthorized();
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = Token::validarToken($token);
            $request = $request->withAttribute('usuario', $decoded);
        } catch (Exception $e) {
            return $this->unauthorized('Token inválido ou expirado');
        }

        return $handler->handle($request);
    }

    private function unauthorized(string $msg = 'Não autorizado'): Response
    {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode(['error' => $msg]));
        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    }
}
