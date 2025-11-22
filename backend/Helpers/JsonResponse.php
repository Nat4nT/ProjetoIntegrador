<?php

namespace Helpers;

use Psr\Http\Message\ResponseInterface as Response;

class JsonResponse
{
    function emitirResposta(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
