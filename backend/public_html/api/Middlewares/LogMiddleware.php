<?php

namespace Api\Middlewares;

use Api\Models\LogModel;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Psr\Http\Message\ResponseInterface as Response;

class LogMiddleware implements MiddlewareInterface
{
    public function process(Request $request, Handler $handler): Response
    {
        $log = new LogModel();

        $data = [
            'usuario_id'    => $request->getAttribute('usuario')->usuario_id ?? null,
            'ip'            => $request->getServerParams()['REMOTE_ADDR'] ?? null,
            'metodo_http'   => $request->getMethod(),
            'rota'          => $request->getUri()->getPath(),
            'acao'          => $this->detectarAcao($request->getMethod(), $request->getUri()->getPath()),
            'status'        => null,
            'user_agent'    => $request->getServerParams()['HTTP_USER_AGENT'] ?? null,
            'resposta'      => null
        ];

        $response = $handler->handle($request);

        $data['status'] = $response->getStatusCode();
        $data['resposta'] = json_decode((string) $response->getBody(), true)['message'] ;

        $log->AddData($data);

        return $response;
    }

    private function detectarAcao(string $metodo, string $rota): string
    {
        $rota = strtolower($rota);

        if ($metodo === 'GET') return 'read';
        if (str_contains($rota, 'login')) return 'login';
        if (
            str_contains($rota, 'editar') ||
            str_contains($rota, 'update') ||
            str_contains($rota, 'aprovar') ||
            str_contains($rota, 'negar') ||
            str_contains($rota, 'revogar') ||
            str_contains($rota, 'editar-comentario')
        ) return 'update';
        if (
            str_contains($rota, 'criar') ||
            str_contains($rota, 'adicionar') ||
            str_contains($rota, 'registrar')
        ) return 'create';
        if (
            str_contains($rota, 'deletar') ||
            str_contains($rota, 'delete') ||
            str_contains($rota, 'deletar-comentario')
        ) return 'delete';
        return 'create';
    }
}
