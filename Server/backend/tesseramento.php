<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	
	class Tesseramento extends RESTItem{
		
		protected function do_get(){
			$stmt = $this->db->prepare('SELECT * FROM Tesseramento');
			if( ! $stmt->execute() ){
				throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR);
			}
			$stmt->bind_result($id, $anno, $attivo);
			$res = array();
			while($stmt->fetch()){
				$res[] = array('id' => $id, 'anno' => $anno, 'attivo' => $attivo);
			}
			return $res;
		}
		
		protected function do_post($data){
			/*
				request: {
					action: 'open' or 'close'
					anno: solo se 'open', stringa
				}
			*/
			$valid_open = isset($data['action']) && strcasecmp($data['action'], 'open') == 0 && isset($data['anno']);
			$valid_close = isset($data['action']) && strcasecmp($data['action'], 'close') == 0;
			$valid_format = $valid_open || $valid_close;
			if($valid_format){
				$stmt = $this->db->prepare('UPDATE Tesseramento SET Aperto = 0 WHERE Aperto = 1');
				if( ! $stmt->execute() ){
					throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR);
				}
				if($valid_open){
					$stmt3 = $this->db->prepare("INSERT INTO Tesseramento(Anno, Aperto) VALUES ( ?, 1)");
					$stmt3->bind_param('s', $data['anno']);
					if( ! $stmt3->execute() ){
						throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR);
					}
				}
				return $this->do_get();
			}else{
				throw new RESTException(HttpStatusCode::$BAD_REQUEST);
			}
		}

		protected function do_del(){
			throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
		}
	}
	
	$temp = new Tesseramento($db);
	$temp->dispatch();
?>
