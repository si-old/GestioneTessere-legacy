<?php

require_once('config.php');

class LoggerFacade {

    function __construct($class) {
        $this->logger = Logger::getLogger($class);
    }

    public function log($message, $level) {
        $this->logger->log($level, $message);
    }

    public static function prepare_message($user, $message) {
        $array = array("Utente" => $user, "Messaggio" => $message);
        return json_encode($array, JSON_UNESCAPED_UNICODE);
    }

}

?>