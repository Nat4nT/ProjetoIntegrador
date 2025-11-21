<?php

namespace Api\Services;

use Api\Helpers\Email;
use Api\Models\UsuarioModel;
use Predis\Client;

class EmailService
{
    public function generateRedis()
    {
        $redis = new Client([
            "host" => "redis",
            "port" => 6379
        ]);

        return $redis;
    }

    public function genereteRecupCode($email_user)
    {
        $usuario = (new UsuarioModel())->buscarPorEmail($email_user);

        if (!$usuario) {
            return [
                'message' => "Usuario não encontrado",
                'code' => 400
            ];
        }

        $redis = $this->generateRedis();
        $codigoRecup = bin2hex(random_bytes(4));


        $bodyEmail = [
            '{{titulo}}'      => 'Solicitação de Alteração de Senha',
            '{{nome}}'        => "{$usuario->primeiro_nome} {$usuario->ultimo_nome}",
            '{{mensagem}}'    => 'Recebemos seu pedido de reativação de conta, este codigo vale por 5 minutos.',
            '{{texto_botao}}' => "{$codigoRecup}",
            '{{observacao}}'  => 'Se você não solicitou a recuperação de conta, ignore este e-mail.',
        ];


        $redis->setex("code:{$email_user}", 300, $codigoRecup);
        (new Email())->send($email_user, "Codigo Recuperação MedExame", $bodyEmail,'email_code.html');

        return [
            'message' => "E-mail enviado com sucesso!",
            'code' => 200
        ];
    }
}
