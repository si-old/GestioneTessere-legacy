<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	
	class Tesseramento extends RESTItem{
		
		protected function do_get($body){
			$stmt = $this->db->prepare('SELECT * FROM Tesseramento');
			$stmt->execute();
			$stmt->bind_result($id, $nome, $attivo);
			$res = array();
			$i = 0;
			while($stmt->fetch()){
				$res[$i] = array('id' => $id, 'nome' => $nome, 'attivo' => $attivo);
				$i++;
			}
			echo json_encode($res);
		}
		
		protected function do_post($data){
			$valid = isset($data['anno']);
			if($valid){
				$stmt = $this->db->prepare('UPDATE Tesseramento SET attivo = 0 WHERE attivo = 1');
				$stmt->execute();
				$stmt = $this->db->prepare('INSERT INTO Tesseramento (anno, attivo) VALUES (?,1)');
				$stmt->bind_param('s', $data['anno']);
				echo json_encode($stmt->execute());
			}else{
				echo json_encode(RESTItem::$ERROR_NODATA);
			}
		}

		protected function do_del($data){
			echo json_encode(RESTItem::$ERROR_NODATA);
		}
	}
	
	$temp = new Tesseramento($db);
	$temp->dispatch();
?>
