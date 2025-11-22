<?php

namespace Helpers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Email
{
    private function prepare()
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = getenv("EMAIL_HOST");
            $mail->SMTPAuth = true;
            $mail->Port = getenv("EMAIL_PORT");
            $mail->Username = getenv("EMAIL_USER");
            $mail->Password = getenv('EMAIL_TOKEN');
            $mail->setFrom('mediexame@demomailtrap.com', 'Sistema MedExame');
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';


            return $mail;
        } catch (Exception $e) {
            throw new \Exception("Erro ao preparar email: " . $e->getMessage());
        }
    }

    public function send($mail_to_send, $title, $body, $html)
    {
        try {

            $template = file_get_contents(__DIR__ . "/../HTML/{$html}");
            $mail = $this->prepare();
            $mail->addAddress($mail_to_send);
            $mail->Subject = $title;
            $body = str_replace(array_keys($body), array_values($body), $template);

            $mail->Body    = $body;

            if ($mail->send()) {
                $message = ['code' => 200, "message" => "Email Enviado"];
            } else {
                $message = ['code' => 400, "message" => "Erro ao enviar"];
            }
            return $message;
        } catch (Exception $e) {
            return ['message' => "E-mail invalido", 'code' => 400];
        }
    }
}
