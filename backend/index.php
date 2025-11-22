<?php
require __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

// Middleware de erro
$app->addErrorMiddleware(true, true, true);

// Carregar rotas de outro arquivo
(require __DIR__ . '/routes.php')($app);

$app->run();
