<?php

require_once('config.php');

class LoggerFacade {

    function __construct($class, $db) {
        $this->logger = Logger::getLogger($class);
        $this->db = $db;
    }

    private function prepare_message($user, $message) {
        $array = array("Utente" => $user, "Messaggio" => $message);
        return json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    public function info($user, $message) {
        $log_message = $this->prepare_message($user, $message);
        $this->logger->info($log_message);
    }

    public function error($user, $message) {
        $log_message = $this->prepare_message($user, $message);
        $this->logger->error($log_message);
    }

    public function get_log_messages(){
        $results = $this->db->query('SELECT timestamp, logger, level, message FROM Log WHERE 1');
        $to_return = [];
        while($row = $results->fetch_assoc()){
            $decoded = json_decode($row['message'], true);
            $to_return[] = [
                            'orario' => $row['timestamp'],
                            'origine' => $row['logger'],
                            'livello' => $row['level'],
                            'utente' => $decoded['Utente'],
                            'messaggio' => $decoded['Messaggio']
                            ];
        }
    }

    public function clear_log(){
        // TODO far entrare la datetime nel modo giusto
        $stmt = $this->db->prepare('DELETE FROM Log WHERE timestamp < ?');
    }

}

?>