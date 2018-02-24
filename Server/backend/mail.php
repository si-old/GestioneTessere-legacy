<?php
    require_once('include/config.php');
    require_once('include/lib.php');
    require_once('include/utils.php');
    
class Mail extends RESTItem
{

    private $query_carriere = '	SELECT	ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente, 
											ca.Professione as ca_professione, ca.Matricola as ca_matricola, 
											ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome
									FROM Carriera as ca LEFT JOIN Corso as c on c.ID = ca.Corso ';
        
    private $query_tessere = '	SELECT	t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero, 
											a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto
									FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID ';

    private $EMAIL_OPTIONS = array('TITLE' => 'StudentIngegneria', 'URL' => 'http://www.Studentingegneria.it', 'FROM' => 'info@studentingegneria.it', 'CHARSET_UTF8' => 'utf-8', 'TYPE' => 'text/html', 'MULTIPART_TYPE' => 'multipart/mixed');
        
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
        	$uid = md5(uniqid(time()));
            $user_header = $this->create_header(false);
            $subject_tmp = $data['oggetto'];
            $subject = str_replace("\\", "", $subject_tmp);
            $email_body_tmp = nl2br($data['corpo']);
            $email_body = str_replace("\\", "", $email_body_tmp);
            $admin_mail = $data['email_feedback'];
            $admin_subject = "[admin] ".$subject;
			mail($admin_mail, $admin_subject, $email_body, $user_header);
			$this->log_info( "Invio e-mail all'indirizzo di feedback.");
			if(isset($data['corsi'])){
				$corsi = $data['corsi'];
			}else{
				$corsi = '';
			}
			$this->log_info( "Invio e-mail con i parametri: oggetto->".$data['oggetto'].", blacklist->".$data['blacklist'].", tutti->".$data['tutti'].", lavoratori->".$data['lavoratori'].".");
            $users = $this->get_users($data['blacklist'], $data['tutti'], $corsi, $data['lavoratori']);
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

    private function create_header($withAttachment, $uid = "")
    {
        $user_header = "Return-Path: ".$this->EMAIL_OPTIONS['TITLE']." <".$this->EMAIL_OPTIONS['FROM'].">\r\n";
        $user_header .= "From: ".$this->EMAIL_OPTIONS['TITLE']." <".$this->EMAIL_OPTIONS['FROM'].">\r\n";
        if ($withAttachment) {
        	$user_header .= "Content-Type: ".$this->EMAIL_OPTIONS['MULTIPART_TYPE']."; boundary = $uid\r\n\r\n";
        } else {
        	$user_header .= "Content-Type: ".$this->EMAIL_OPTIONS['TYPE']."; charset=".$this->EMAIL_OPTIONS['CHARSET_UTF8'].";\n\n\r\n";
        }
        return $user_header;
    }

    private function create_body_for_attachment($message, $filepath, $uid)
    {
    	$ftype = file_type($filepath);	
        $data = file_get_contents($filepath);
        // split the file into chunks for attaching
        $content = chunk_split(base64_encode($data));
    	$body = "--$uid\r\n";
        $body .= "Content-Type: ".$this->EMAIL_OPTIONS['TYPE']."; charset=".$this->EMAIL_OPTIONS['CHARSET_UTF8']."\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= chunk_split($message)."\r\n\r\n";
        $body .= "--$uid\r\n";
        $body .= "Content-Type: ".$ftype."; name=\"".basename($filepath)."\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= "Content-Disposition: attachment; filename=\"".basename($filepath)."\"\r\n";    
        $body .= $content."\r\n\r\n";
        return $body;
    }

    private function file_type($file) 
    {
    	$ext = strrchr( $file , '.');
        $ftype = "";
        if ($ext == ".doc") {
        	$ftype = "application/msword";
        }
        if ($ext == ".jpg") {
        	$ftype = "image/jpeg";
        }
        if ($ext == ".gif") {
        	$ftype = "image/gif";
        }
        if ($ext == ".zip") {
        	$ftype = "application/zip";
        }
        if ($ext == ".pdf") {
        	$ftype = "application/pdf";
        }
        if ($ftype=="") {
        	$ftype = "application/octet-stream";
        }
        return $ftype;
    }

	// usiamo solo cdl, perchè farci passare tutto?
	// meglio un booleano che ci dice se escludere la blacklist
	// uno che ci dice se vuole tutti i corsi di laurea e la lista di cdl già pronta
    private function get_users($blacklist, $all, $cdl_whitelist, $workers)
    {
        $query_carriere_attive = $this->query_carriere.'WHERE ca.Attiva = 1';
        $query_tessere_attive = $this->query_tessere.'WHERE a.Aperto = 1';
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
				$conditions = $conditions." AND (c_id IN ( $corsi ) AND ca_studente = 1) OR ca_studente != 1";
			} else {
				$conditions = $conditions." AND c_id IN ( $corsi ) AND ca_studente = 1";
			}
		} else {
			if (!$workers) {
				$conditions = $conditions." AND ca_studente = 1";
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
        $this->log_info( "Inviata e-mail a $count_ok soci.");
        return array('ok' => $count_ok, 'nok' => $count_nok);
    }
}
    
    // $db ho dovuto portarla dentro col costruttore di RESTItem
    // è definita in config.php
    $temp = new Mail($db);
    $temp->dispatch();
