<?php

	require_once('include/config.php');
	require_once('include/lib.php');
	require_once('include/utils.php');

	class Socio extends RESTItem{
		private function get_list(){
			/*
			"SELECT s.ID as s_id, s.Nome as s_nome, s.Cognome as s_cognome,   s.Email as s_email, s.Cellulare as s_cellulare, s.Facebook as s_facebook,  ca_id, ca_studente, ca_professione, ca_matricola, ca_attiva, c_id,   c_nome, t_id, t_numero, a_id, a_anno, a_aperto FROM Socio as s LEFT JOIN ( SELECT ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente,  ca.Professione as ca_professione, ca.Matricola as ca_matricola,  ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome FROM Carriera as ca JOIN CdL as c on c.ID = ca.CdL WHERE ca.Attiva = 1 ) as c on ca_socio = s.ID LEFT JOIN (  SELECT t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero, a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID WHERE a.Aperto = 1 ) as t on t_socio = s.ID"

			*/
			$query_carriere = 'SELECT ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente, 
																ca.Professione as ca_professione, ca.Matricola as ca_matricola, 
																ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome
													FROM Carriera as ca JOIN CdL as c on c.ID = ca.CdL
													WHERE ca.Attiva = 1';
			$query_tessere = '	SELECT t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero, a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto
													FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID
													WHERE a.Aperto = 1';
			$query = "SELECT s.ID as s_id, s.Nome as s_nome, s.Cognome as s_cognome, 
											 s.Email as s_email, s.Cellulare as s_cellulare, s.Facebook as s_facebook,
											 ca_id, ca_studente, ca_professione, ca_matricola, ca_attiva, c_id, 
											 c_nome, t_id, t_numero, a_id, a_anno, a_aperto
								FROM Socio as s LEFT JOIN ( $query_carriere ) as c on ca_socio = s.ID
																LEFT JOIN ( $query_tessere ) as t on t_socio = s.ID";
			$stmt = $this->db->prepare($query);
			$stmt->execute();
			$results = fetch_results($stmt);
			$users = array();
			$i = 0;
			foreach( $results as $user ){
				$tesseramento = array('id' => $user['a_id'], 'anno' => $user['a_anno'], 'aperto' => $user['a_aperto']);
				$tessera = array('id' => $user['t_id'], 'anno' => $tesseramento, 'numero' => $user['t_numero']);
				$corso = array('id' => $user['c_id'], 'nome' => $user['c_nome']);
				$carriera = array('id' => $user['ca_id'], 'studente' => $user['ca_studente'], 'professione' => $user['ca_professione'],
													'matricola' => $user['ca_matricola'], 'corso' => $corso);
				$users[$i++] = array('id' => $user['s_id'], 'nome' => $user['s_nome'], 'cognome' => $user['s_cognome'],
															'email' => $user['s_email'], 'cellulare' => $user['s_cellulare'], 'facebook' => $user['s_facebook'], 
															'carriere' => array($carriera), 'tessere' => array($tessera));
			}
			return $users;
		}

		private function get_full_socio($id){
			throw new RESTException(HttpStatusCode::$NOT_IMPLEMENTED);
		}

		protected function do_get($data){
			$flag_id = isset($_GET['id']) && strlen($_GET['id']) > 0;
			if($flag_id){
				return $this->get_full_socio($_GET['id']);
			}else{
				return $this->get_list();
			}
		}

		protected function do_post($data){
			//TODO inserimento utenti, controlli su integrità vincoli
			//$data = $this->get_body();
			//$valid = isset($data['nome']);
			//if($valid){
				//dovremmo controllare se il nome c'è già?
				//$stmt = $this->db->prepare('INSERT INTO CdL (Nome) VALUES (?)');
				//$stmt->bind_param('s', $data['nome']);
				//return $stmt->execute();
			//}else{
				throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
				//}
		}

		protected function do_del($data){
			if(isset($data['id'])){
				$this->db->begin_transaction();
				$stmt = $this->db->prepare('DELETE FROM Socio WHERE ID=?');
				$stmt->bind_param('i', $data['id']);
				$stmt->execute();
				$stmt = $this->db->prepare('DELETE FROM Carriera WHERE Socio=?');
				$stmt->bind_param('i', $data['id']);
				$stmt->execute();
				return $this->db->commit();
			}else{
				throw new RESTException(HttpStatusCode::$BAD_REQUEST);
			}
		}
	}

	$temp = new Socio($db);
	$temp->dispatch();
?>
