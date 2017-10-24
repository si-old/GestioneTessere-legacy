<?php

require_once('config.php');

class LoggerFacade {

    function __construct($class, $db) {
        $this->logger = Logger::getLogger($class);
        $this->db = $db;
    }

    private function prepare_message($user, $message) {
        $array = array("Utente" => $user, "Messaggio" => $message);
        return json_encode($array);
    }

    public function info($user, $message) {
        $log_message = $this->prepare_message($user, $message);
        $this->logger->info($log_message);
    }

    public function error($user, $message) {
        $log_message = $this->prepare_message($user, $message);
        $this->logger->error($log_message);
    }

    public function debug($user, $message) {
        $log_message = $this->prepare_message($user, $message);
        $this->logger->debug($log_message);
    }

    public function get_log_messages($paginate = false, $offset = 0, $limit = 10) {
        if($paginate){
            $stmt = $this->db->prepare('SELECT timestamp, logger, level, message FROM Log ORDER BY timestamp DESC LIMIT ? OFFSET ?');
            $stmt->bind_param('ii', $limit, $offset);
        }else{
            $stmt = $this->db->prepare('SELECT timestamp, logger, level, message FROM Log ORDER BY timestamp DESC');
        }
        $stmt->execute();
        $stmt->bind_result($timestamp, $logger, $level, $message);
        $to_return = [];
        while($stmt->fetch()) {
            $decoded = json_decode($message, true);
            $to_return[] = [
                            'orario' => $timestamp,
                            'origine' => $logger,
                            'livello' => $level,
                            'utente' => $decoded['Utente'],
                            'messaggio' => $decoded['Messaggio']
                            ];
        }
        if($paginate){
            $res = $this->db->query('SELECT COUNT(*) FROM Log');
            while($row = $res->fetch_row()){
                $size = $row[0];
            }
            $to_return2 = array(
                                'totale' => $size,
                                'offset' => $offset,
                                'limit' => $limit,
                                'results' => $to_return );
            return $to_return2;
        }else{
            return $to_return;
        }
    }

    public function clear_log() {
        $starting_date = date("Y:m:d H:i:s", strtotime('-3 months'));
        $stmt = $this->db->prepare('DELETE FROM Log WHERE timestamp < ?');
        $stmt->bind_param('s', $starting_date);
        return $stmt->execute();
    }

}

?>