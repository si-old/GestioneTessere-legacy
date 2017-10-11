<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	
	class Tesseramento extends RESTItem{
		
		protected function do_get($body){
			$stmt = $this->db->prepare('SELECT * FROM Tesseramento');
			$stmt->execute();
			$stmt->bind_result($id, $anno, $attivo);
			$res = array();
			$i = 0;
			while($stmt->fetch()){
				$res[$i] = array('id' => $id, 'anno' => $anno, 'attivo' => $attivo);
				$i++;
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
				$stmt->execute();
				if($valid_open){
					//check if anno already exists, to ensure idempotence
					$stmt2 = $this->db->prepare('SELECT * FROM Tesseramento WHERE Anno = ?');
					$stmt2->bind_param('s', $data['anno']);
					$stmt2->execute();
					$check = $stmt2->num_rows <= 0;
					$stmt2->close();
					if( $check ){
						$stmt3 = $this->db->prepare("INSERT INTO Tesseramento(Anno, Aperto) VALUES ( ?, 1)");
						$stmt3->bind_param('s', $data['anno']);
						$stmt3->execute();
					}
				}
				return $this->do_get();
			}else{
				throw new RESTException(HttpStatusCode::$BAD_REQUEST);
			}
		}

		protected function do_del($data){
			throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
		}
	}
	
	$temp = new Tesseramento($db);
	$temp->dispatch();
?>
