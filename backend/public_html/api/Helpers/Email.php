<?php

namespace Api\Helpers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Email
{
    private function prepare()
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'live.smtp.mailtrap.io';
            $mail->SMTPAuth = true;
            $mail->Port = 587;
            $mail->Username = 'api';
            $mail->Password = '36c88cc6f824011381e0679d8d61a0a9';
            $mail->setFrom('mailtrap@demomailtrap.com', 'Sistema MedExame');
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
