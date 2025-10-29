<?php

namespace App\Models;

use PDO;
use PDOException;

class DB
{
    private $host;
    private $db;
    private $user;
    private $pass;


    /**
     * Atrelando valores através de variaveis setadas em
     * docker-composer.yml
     */
    public function __construct()
    {
        $this->host = getenv('MYSQL_HOST');
        $this->db   = getenv('MYSQL_DATABASE');
        $this->user = getenv('MYSQL_USER');
        $this->pass = getenv('MYSQL_PASSWORD');
    }


    public function conn(): PDO
    {
        $conn = null;
        try {
            $conn = new PDO("mysql:host=$this->host;dbname=$this->db", $this->user, $this->pass, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);

            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (PDOException $e) {
            die("Erro de conexão: " . $e->getMessage());
        }
    }
}
