<?php
require_once 'include/config.php';
require_once 'include/lib.php';
require_once 'include/utils.php';
require_once 'include/mailFacade.php';

class Mail extends RESTItem
{

    private $query_carriere = '	SELECT	ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente,
											ca.Professione as ca_professione, ca.Matricola as ca_matricola,
											ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome
									FROM Carriera as ca LEFT JOIN Corso as c on c.ID = ca.Corso ';

    private $query_tessere = '	SELECT	t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero,
											a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto
									FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID ';

    private $TMP_ATTACH_DIR = './tmp_attachments';

    protected function do_get()
    {
        throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
    }
    /*
    {
    oggetto: oggetto dell'email, stringa
    corpo: corpo dell'email, stringa
    email_feedback: ulteriore indirizzo a cui inviare l'email, per controllo
    blacklist: flag per indicare se vanno esclusi i membri della blacklist, bool
    tutti: flag per indicare se filtrare per carriera, bool
    corsi: array di id dei corsi a cui inviare la mail
    lavoratori: flag per inviare la mail a chi ha come ultima carriera studente = false, bool
    }
     */
    protected function do_post($data)
    {
        $valid = isset($data['oggetto']) && isset($data['corpo']) && isset($data['email_feedback']);
        $valid = $valid && isset($data['blacklist']) && isset($data['tutti']) && isset($data['lavoratori']);
        $valid = ($valid && $data['tutti']) || ($valid && !$data['tutti'] && isset($data['corsi']));
        if ($valid) {
            $mail = new MailFacade();

            $mail->set_body($data["corpo"]);
            if (isset($data['files'])) {
                $mail->add_attachments($data['files']);
            }
            
            $mail->set_subject("[admin] " . $data['oggetto']);
            try {
                $mail->send_one($data['email_feedback'], "Admin email");
                $this->log_info("Invio e-mail all'indirizzo di feedback.");
            } catch (Exception $e) {
                throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $mail->ErrorInfo);
            }

            if (isset($data['corsi'])) {
                $corsi = $data['corsi'];
            } else {
                $corsi = '';
            }
            $this->log_info("Invio e-mail con i parametri: " .
                            "oggetto->" . $data['oggetto'] . 
                            ", blacklist->" . $data['blacklist'] . 
                            ", tutti->" . $data['tutti'] . 
                            ", lavoratori->" . $data['lavoratori']
                        );
            $users = $this->get_users($data['blacklist'], $data['tutti'], $corsi, $data['lavoratori']);
            $mail->set_subject($data['oggetto']);
            $return_value = $mail->send_list($users);

            $this->clear_tmp_dir();
            
            return $return_value;
        } else {
            throw new RESTException(HttpStatusCode::$BAD_REQUEST, "Request JSON object is missing or has a wrong format");
        }
    }

    protected function do_del()
    {
        throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
    }

    protected function is_session_authorized()
    {
        return $this->session->is_valid();
    }

    protected function get_post_request_body()
    {
        $headers = apache_request_headers();
        $content_type = strstr($headers['Content-Type'], ';', true);
        $content = [];
        if (isset($headers['Content-Type']) && strcmp($content_type, 'multipart/form-data') == 0) {
            $content = json_decode($_POST['content'], true);
            if (isset($_POST['files'])) {
                if (!file_exists($this->TMP_ATTACH_DIR)) {
                    mkdir($this->TMP_ATTACH_DIR);
                }
                $files = json_decode($_POST['files'], true);
                foreach ($files as $index => $file) {
                    $new_path = $this->TMP_ATTACH_DIR . '/' . $_FILES[$file]['name'];
                    move_uploaded_file($_FILES[$file]['tmp_name'], $new_path);
                    $content['files'][$index] = $new_path;
                }
            }
        } else {
            $content = json_decode(file_get_contents('php://input'), true);
        }
        return $content;
    }

    private function clear_tmp_dir()
    {
        $files = glob($this->TMP_ATTACH_DIR . '/*'); // get all file names
        foreach ($files as $file) { // iterate files
            if (is_file($file)) {
                unlink($file);
            } // delete file
        }
    }

    private function get_users($blacklist, $all, $cdl_whitelist, $workers)
    {
        $query_carriere_attive = $this->query_carriere . 'WHERE ca.Attiva = 1';
        $query_tessere_attive = $this->query_tessere . 'WHERE a.Aperto = 1';
        $query = "	SELECT	s.Email as s_email
						FROM Socio as s	LEFT JOIN ( $query_carriere_attive ) as c on ca_socio = s.ID
										JOIN ( $query_tessere_attive ) as t on t_socio = s.ID WHERE 1 = 1";
        $conditions = "";
        if ($blacklist) {
            $conditions = " AND s.Blacklist != 1";
        }
        if (!$all) {
            $corsi = $this->get_list($cdl_whitelist);
            if ($workers) {
                $conditions = $conditions . " AND (c_id IN ( $corsi ) AND ca_studente = 1) OR ca_studente != 1";
            } else {
                $conditions = $conditions . " AND c_id IN ( $corsi ) AND ca_studente = 1";
            }
        } else {
            if (!$workers) {
                $conditions = $conditions . " AND ca_studente = 1";
            }
        }
        $query = $query . $conditions;
        $stmt = $this->db->prepare($query);
        if (!$stmt->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $results = fetch_results($stmt);
        return array_map(function ($user) {
                            return $user['s_email'];
                        }, $results);
    }

    private function get_list($corsi)
    {
        $corsi_int = array_map(function ($corso) {
            return intval($corso);
        }, $corsi);
        return implode(', ', $corsi_int);
    }
}

// $db ho dovuto portarla dentro col costruttore di RESTItem
// è definita in config.php
$temp = new Mail($db);
$temp->dispatch();
