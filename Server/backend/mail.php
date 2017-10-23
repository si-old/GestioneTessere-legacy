<?php
    require_once('include/config.php');
    require_once('include/lib.php');
    require_once('include/utils.php');
    
class Mail extends RESTItem
{

    private $query_carriere = '	SELECT	ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente, 
											ca.Professione as ca_professione, ca.Matricola as ca_matricola, 
											ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome
									FROM Carriera as ca LEFT JOIN CdL as c on c.ID = ca.CdL ';
        
    private $query_tessere = '	SELECT	t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero, 
											a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto
									FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID ';

    private $EMAIL_OPTIONS = array('TITLE' => 'StudentIngegneria', 'URL' => 'http://www.Studentingegneria.it', 'FROM' => 'info@studentingegneria.it', 'CHARSET' => 'utf-8', 'TYPE' => 'text/html');
        
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
			corsi: arrauy di id dei corsi a cui inviare la mail
		}
	*/
	protected function do_post($data)
    {
		$valid = isset($data['oggetto']) && isset($data['corpo']) && isset($data['email_feedback']);
		$valid = $valid && isset($data['blacklist']) && isset($data['tutti']);
		$valid = ($valid && $data['tutti']) || ($valid && !$data['tutti'] && isset($data['corsi']));
        if ($valid) {
            $user_header = $this->create_header();
            $subject_tmp = $data['oggetto'];
            $subject = str_replace("\\", "", $subject_tmp);
            $email_body_tmp = nl2br($data['corpo']);
            $email_body = str_replace("\\", "", $email_body_tmp);
            $admin_mail = $data['email_feedback'];
            $admin_subject = "[admin] ".$subject;
			mail($admin_mail, $admin_subject, $email_body, $user_header);
			$this->logger->info("Utente: ".$this->session->get_user().". Invio e-mail all'indirizzo di feedback.");
			if(isset($data['corsi'])){
				$corsi = $data['corsi'];
			}else{
				$corsi = '';
			}
			$this->logger->info("Utente: ".$this->session->get_user().". Invio e-mail con i parametri: oggetto->".$data['oggetto'].", blacklist->".$data['blacklist'].", tutti->".$data['tutti'].", lavoratori->".".");
            $users = $this->get_users($data['blacklist'], $data['tutti'], $corsi);
            return $this->send_mails($users, $subject, $email_body, $user_header);
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

    private function create_header()
    {
        $user_header = "Return-Path: ".$this->EMAIL_OPTIONS['TITLE']." <".$this->EMAIL_OPTIONS['FROM'].">\r\n";
        $user_header .= "From: ".$this->EMAIL_OPTIONS['TITLE']." <".$this->EMAIL_OPTIONS['FROM'].">\r\n";
        $user_header .= "Content-Type: ".$this->EMAIL_OPTIONS['TYPE']."; charset=".$this->EMAIL_OPTIONS['CHARSET'].";\n\n\r\n";
        return $user_header;
    }

	// usiamo solo cdl, perchè farci passare tutto?
	// meglio un booleano che ci dice se escludere la blacklist
	// uno che ci dice se vuole tutti i corsi di laurea e la lista di cdl già pronta
    private function get_users($blacklist, $all, $cdl_whitelist)
    {
        $query_carriere_attive = $this->query_carriere.'WHERE ca.Attiva = 1';
        $query_tessere_attive = $this->query_tessere.'WHERE a.Aperto = 1';
        $query = "	SELECT	s.Email as s_email 
						FROM Socio as s	LEFT JOIN ( $query_carriere_attive ) as c on ca_socio = s.ID
										JOIN ( $query_tessere_attive ) as t on t_socio = s.ID";
		if($blacklist){
			if($all){
				$conditions = " WHERE s.Blacklist != 1";
			}else{
				$corsi = $this->get_list($cdl_whitelist);
				$conditions = " WHERE s.Blacklist != 1 AND c_id IN ( $corsi )";
			}
		}else{
			if($all){
				$conditions = "";
			}else{
				$corsi = $this->get_list($cdl_whitelist);
				$conditions = " WHERE c_id IN ( $corsi )";
			}
		}
        $query = $query.$conditions;
		$stmt = $this->db->prepare($query);
        if (! $stmt->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $results = fetch_results($stmt);
        return $results;
    }

    private function get_list($corsi) {
    	$corsi_ids = '';
    	foreach ($corsi as $id) {
    		$corsi_ids = $corsi_ids.intval($id).', ';
    	}
    	$corsi_ids = substr($corsi_ids, 0, -2);
    	return $corsi_ids;
    }

    private function send_mails($users, $subject, $email_body, $user_header)
    {
        $count_ok = 0;
        $count_nok = 0;
        foreach ($users as $user) {
            if (mail($user['s_email'], $subject, $email_body, $user_header)) {
                $count_ok = $count_ok + 1;
            } else {
                $count_nok = $count_nok + 1;
            }
        }
        $this->logger->info("Utente: ".$this->session->get_user().". Inviata e-mail a ".$count_ok." soci.");
        return array('ok' => $count_ok, 'nok' => $count_nok);
    }
}
    
    // $db ho dovuto portarla dentro col costruttore di RESTItem
    // è definita in config.php
    $temp = new Mail($db);
    $temp->dispatch();
