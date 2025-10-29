<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use DateTimeImmutable;

class Token
{
    private static  $secret;
    private static function getSecret(): string
    {
        if (!self::$secret) {
            self::$secret = getenv('CHAVE_CRIPTOGRAFIA');
        }

        return self::$secret;
    }


    public static function gerarToken(array $payload): string
    {
        $secret = self::getSecret();
        $agora = new DateTimeImmutable();
        $expira = $agora->modify('+1 hour')->getTimestamp();

        $dados = array_merge($payload, [
            'iat' => $agora->getTimestamp(),
            'exp' => $expira,
        ]);
        

        return JWT::encode($dados, $secret, 'HS256');
    }

    public static function validarToken(string $token): object
    {
        $secret = self::getSecret();

        return JWT::decode($token, new Key($secret, 'HS256'));
    }
}
