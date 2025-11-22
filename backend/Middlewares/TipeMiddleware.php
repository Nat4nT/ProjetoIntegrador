<?php

namespace Middlewares;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as SlimResponse;

class TipeMiddleware implements MiddlewareInterface
{
    public function process(Request $request, Handler $handler): Response
    {
        $usuario = $request->getAttribute('usuario');
        
        if (!$usuario) {
            return $this->unauthorized('Token não encontrado');
        }

        if ($usuario->tipo_usuario == 'medico') {
            return $handler->handle($request);
        } else {
            return $this->unauthorized();
        }
    }

    private function unauthorized(string $msg = 'Não autorizado'): Response
    {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode(['error' => $msg]));
        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    }
}
