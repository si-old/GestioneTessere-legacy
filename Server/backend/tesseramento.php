<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	
	class Tesseramento extends RESTItem{
		
		protected function do_get(){
			$stmt = $this->db->prepare('SELECT * FROM Tesseramento');
			if( ! $stmt->execute() ){
				throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
			}
			$stmt->bind_result($id, $anno, $aperto);
			$res = array();
			while($stmt->fetch()){
				$res[] = array('id' => $id, 'anno' => $anno, 'aperto' => $aperto);
			}
			return $res;
		}
		
		protected function do_post($data){
			/*
				request: {
					action: 'open', 'close', 'edit'
					anno: se 'open' o 'edit', stringa con il nuovo anno, da aprire o modificare
					id: solo se 'edit', numero del tesseramento da modificare
				}
			*/
			$valid_open = isset($data['action']) && strcasecmp($data['action'], 'open') == 0 && isset($data['anno']);
			$valid_close = isset($data['action']) && strcasecmp($data['action'], 'close') == 0;
			$valid_edit = isset($data['action']) &&  strcasecmp($data['action'], 'edit') == 0 && isset($data['anno']) && isset($data['id']);
			$valid_format = $valid_open || $valid_close || $valid_edit;
			if($valid_format){
				if($valid_edit){
					$stmt = $this->db->prepare('UPDATE Tesseramento SET Anno = ? WHERE ID = ?');
					$stmt->bind_param('si', $data['anno'], $data['id']);
					if( ! $stmt->execute() ){
						throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
					}
				}else{
					$stmt = $this->db->prepare('UPDATE Tesseramento SET Aperto = 0 WHERE Aperto = 1');
					if( ! $stmt->execute() ){
						throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
					}
					if($valid_open){
						$stmt3 = $this->db->prepare("INSERT INTO Tesseramento(Anno, Aperto) VALUES ( ?, 1)");
						$stmt3->bind_param('s', $data['anno']);
						if( ! $stmt3->execute() ){
							throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
						}
					}
				}
				return $this->do_get();
			}else{
				throw new RESTException(HttpStatusCode::$BAD_REQUEST, "Request JSON object is missing or has a wrong format");
			}
		}

		protected function do_del(){
			throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
		}

		protected function is_session_authorized() {
			return $this->session->is_valid();
		}

	}
	
	// $db ho dovuto portarla dentro col costruttore di RESTItem
	// è definita in config.php
	$temp = new Tesseramento($db);
	$temp->dispatch();
?>
