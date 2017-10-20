<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	require_once('include/utils.php');
	
	class Mail extends RESTItem{

		private $query_carriere = '	SELECT	ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente, 
											ca.Professione as ca_professione, ca.Matricola as ca_matricola, 
											ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome
									FROM Carriera as ca LEFT JOIN CdL as c on c.ID = ca.CdL ';
		
		private $query_tessere = '	SELECT	t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero, 
											a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto
									FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID ';

		private $EMAIL_OPTIONS = array('TITLE' => 'StudentIngegneria', 'URL' => 'http://www.Studentingegneria.it', 'FROM' => 'info@studentingegneria.it', 'CHARSET' => 'utf-8', 'TYPE' => 'text/html');
		
		protected function do_get(){
			throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
		}
		
		protected function do_post($data) {
			if(isset($data['subject']) && isset($data['emailmess'])) {
				$user_header = $this->create_header();
				$subject_tmp = $data['subject'];
				$subject = str_replace("\\","",$subject_tmp);
				$email_body_tmp = nl2br($data['emailmess']);
				$email_body = str_replace("\\","",$email_body_tmp);
				if (isset($data['admin_mail'])) {
					$admin_mail = $data['admin_mail'];
				} else {
					$admin_mail = "c.digruttola1@gmail.com";
				}
				$admin_subject = "[admin] ".$subject;
				mail($admin_mail,$admin_subject,$email_body,$user_header);
				$users = $this->get_users($data);
				return $this->send_mails($users, $subject, $email_body, $user_header);
			} else {
				throw new RESTException(HttpStatusCode::$BAD_REQUEST);
			}
		}
		
		protected function do_del() {
			throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
		}

		protected function is_session_authorized() {
			return $this->session->is_valid();
		}

		private function create_header() {
			$user_header = "Return-Path: ".$this->EMAIL_OPTIONS['TITLE']." <".$this->EMAIL_OPTIONS['FROM'].">\r\n"; 
			$user_header .= "From: ".$this->EMAIL_OPTIONS['TITLE']." <".$this->EMAIL_OPTIONS['FROM'].">\r\n";
			$user_header .= "Content-Type: ".$this->EMAIL_OPTIONS['TYPE']."; charset=".$this->EMAIL_OPTIONS['CHARSET'].";\n\n\r\n";
			return $user_header;
		}

		private function get_users($data) {
			$query_carriere_attive = $this->query_carriere.'WHERE ca.Attiva = 1';
			$query_tessere_attive = $this->query_tessere.'WHERE a.Aperto = 1';
			$query = "	SELECT	s.Email as s_email 
						FROM Socio as s	LEFT JOIN ( $query_carriere_attive ) as c on ca_socio = s.ID
										JOIN ( $query_tessere_attive ) as t on t_socio = s.ID
						WHERE s.Blacklist != 1 ";
			if(isset($data['CdL'])) {
				$query .= "AND c_id IN ( $data[CdL] )";
			}
			$stmt = $this->db->prepare($query);
			if( ! $stmt->execute() ) {
				throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
			}
			$results = fetch_results($stmt);
			return $results;
		}

		private function send_mails($users, $subject, $email_body, $user_header) {
			$count_ok = 0;
			$count_nok = 0;
			foreach( $users as $user ) {
				 if (mail($user['s_email'], $subject, $email_body, $user_header)) {
				 	$count_ok = $count_ok + 1;
				 } else {
				 	$count_nok = $count_nok + 1;
				 }
			}
			return array('ok' => $count_ok, 'nok' => $count_nok);
		}

	}
	
	// $db ho dovuto portarla dentro col costruttore di RESTItem
	// è definita in config.php
	$temp = new Mail($db);
	$temp->dispatch();
?>
