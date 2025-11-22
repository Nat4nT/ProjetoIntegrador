<?php

namespace Helpers;

class Criptografia
{
    // A chave DEVE ser binária, por isso, a decodificamos no construtor
    private string $key;
    private string $cipher = 'aes-256-cbc';

    public function __construct()
    {
        $base64Key = getenv('CHAVE_CRIPTOGRAFIA');
        $this->key = base64_decode($base64Key);
    }

    // Função de Criptografia
    public function encriptarDado(string $data): string
    {
        $ivlen = openssl_cipher_iv_length($this->cipher);

        // Gera um IV fixo (determinístico) com base no valor original
        $iv = substr(hash('sha256', $data), 0, $ivlen);

        $encrypted = openssl_encrypt($data, $this->cipher, $this->key, 0, $iv);
        return base64_encode($iv . $encrypted);
    }


    public function decriptarDado($encrypted_data = ""): string
    {
        if ($encrypted_data !== null && trim($encrypted_data) !== "") {
            $data = base64_decode($encrypted_data);
            $ivlen = openssl_cipher_iv_length($this->cipher);
            $iv = substr($data, 0, $ivlen);
            $encrypted = substr($data, $ivlen);

            $decrypted = openssl_decrypt($encrypted, $this->cipher, $this->key, 0, $iv);
            return $decrypted;
        }
        return "";
    }
}
