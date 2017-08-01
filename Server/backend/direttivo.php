<?php
	require_once('include/config.php');
	
	//contiene RESTItem, base per le richieste
	require_once('include/lib.php');
	
	class Direttivo extends RESTItem{
		
		private function get_data($id){
			$stmt = $this->db->prepare('SELECT * FROM Direttivo WHERE ID=?');
			$stmt->bind_param('i', $id);
			$stmt->execute();
			$stmt->bind_result($idr, $user, $pass, $socio);
			if($stmt->fetch()){
				return array('id' => $idr, 'user' => $user, 'pass' => $pass, 'id_socio' => $socio);
			}else{
				return array();
			}
		}
		
		protected function do_get($data){
			$id = isset($_GET['id']) ? $_GET['id'] : -1;
			if($id > 0){
				echo json_encode($this->get_data($id));
			}else{
				$stmt = $this->db->prepare('SELECT * FROM Direttivo');
				$stmt->execute();
				$stmt->bind_result($idr, $user, $pass, $socio);
				$i = 0;
				$res = array();
				while($stmt->fetch()){
					$res[$i] = array('id' => $idr, 'user' => $user, 'pass' => $pass, 'id_socio' => $socio);
					$i++;
				}
				echo json_encode($res);
			}
		}
		
		protected function do_post($new_data){
			//validation dell'input, o c'è un id e almeno uno degli altri campi 
			//o ci sono tutti e tre gli altri campi
			$flag_id = isset($new_data['id']);
			$flag_wid = ( isset($new_data['user']) or isset($new_data['pass']) or isset($new_data['id_socio']) );
			$flag_noid = ( isset($new_data['user']) and isset($new_data['pass']) and isset($new_data['id_socio']) );
			if( ( $flag_id and $flag_wid ) or ( ! $flag_id and $flag_noid )){
				if($flag_id){
					//se c'è l'id, fai un update
					$old_data = $this->get_data($new_data['id']);
					$stmt = $this->db->prepare('UPDATE Direttivo SET User=?, Password=?, Socio=? WHERE ID=?');
					$stmt->bind_param('ssii', $user, $pass, $socio, $new_data['id']);
					$user = (isset($new_data['user'])) ? $new_data['user'] : $old_data['user'];
					$pass = (isset($new_data['pass'])) ? $new_data['pass'] : $old_data['pass'];
					$socio = (isset($new_data['id_socio'])) ? $new_data['id_socio'] : $old_data['id_socio'];
					echo json_encode($stmt->execute());
				}else{
					//senno fai un insert
					$stmt = $this->db->prepare('INSERT INTO Direttivo (User, Password, Socio) VALUES (?, ?, ?)');
					$stmt->bind_param('ssi', $new_data['user'], $new_data['pass'], $new_data['id_socio']);
					echo json_encode($stmt->execute());
				}
			}else{
				echo json_encode(RESTItem::$ERROR_NODATA);
			}
		}
		
		protected function do_del($data){
			if(isset($data['id'])){
				$stmt = $this->db->prepare('DELETE FROM Direttivo WHERE ID=?');
				$stmt->bind_param('i', $data['id']);
				echo json_encode($stmt->execute());
			}else{
				echo json_encode(RESTItem::$ERROR_NODATA);
			}
		}
	}
	
	//crea un oggetto direttivo e esegue la richiesta
	//$_GET è global, non c'è bisogno di fare nulla
	//$db ho dovuto portarla dentro col costruttore di RESTItem
	$temp = new Direttivo($db);
	$temp->dispatch();
?>
