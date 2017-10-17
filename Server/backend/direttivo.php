<?php
	require_once('include/config.php');
	
	//contiene RESTItem, base per le richieste
	require_once('include/lib.php');
	
	class Direttivo extends RESTItem{
		
		private function get_data($id){
			$stmt = $this->db->prepare('SELECT * FROM Direttivo WHERE ID=?');
			$stmt->bind_param('i', $id);
			if( ! $stmt->execute() ){
				throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
			}
			$stmt->bind_result($idr, $user, $pass, $socio);
			if($stmt->fetch()){
				return array('id_direttivo' => $idr, 'user' => $user, 'password' => $pass, 'id' => $socio);
			}else{
				return array();
			}
		}
		
		protected function do_get(){
			$stmt = $this->db->prepare('SELECT * FROM Direttivo');
			if( ! $stmt->execute() ){
				throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
			}
			$stmt->bind_result($idr, $user, $pass, $socio);
			$res = array();
			while($stmt->fetch()){
				$res[] = array('id_direttivo' => $idr, 'user' => $user, 'password' => $pass, 'id' => $socio);
			}
			return $res;
		}
		
		protected function do_post($new_data){
			$flag_id = isset($new_data['id_direttivo']);
			$flag_wid = ( isset($new_data['user']) or isset($new_data['password']) or isset($new_data['id']) );
			$flag_noid = ( isset($new_data['user']) and isset($new_data['password']) and isset($new_data['id']) );
			if( ( $flag_id and $flag_wid ) or ( ! $flag_id and $flag_noid )){
				if($flag_id){
					//se c'è l'id, fai un update
					$old_data = $this->get_data($new_data['id_direttivo']);
					$stmt = $this->db->prepare('UPDATE Direttivo SET User=?, Password=?, Socio=? WHERE ID=?');
					$stmt->bind_param('ssii', $user, $pass, $socio, $new_data['id_direttivo']);
					$user = (isset($new_data['user'])) ? $new_data['user'] : $old_data['user'];
					$pass = (isset($new_data['password'])) ? $new_data['password'] : $old_data['password'];
					$socio = (isset($new_data['id'])) ? $new_data['id'] : $old_data['id'];
				}else{
					//senno fai un insert
					$stmt = $this->db->prepare('INSERT INTO Direttivo (User, Password, Socio) VALUES (?, ?, ?)');
					$stmt->bind_param('ssi', $new_data['user'], $new_data['password'], $new_data['id']);
				}
				if( ! $stmt->execute() ){
					throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
				}
				return $this->do_get();
			}else{
				throw new RESTException(HttpStatusCode::$BAD_REQUEST);
			}
		}
		
		protected function do_del(){
			if( $this->has_id ){
				$stmt = $this->db->prepare('DELETE FROM Direttivo WHERE ID=?');
				$stmt->bind_param('i', $this->id );
				if( ! $stmt->execute() ){
					throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
				}
				return $this->do_get();
			}else{
				throw new RESTException(HttpStatusCode::$NOT_FOUND);
			}
		}

		protected function isSessionAuthorized() {
			return this->session->isValid();
		}
		
	}
	
	//crea un oggetto direttivo e esegue la richiesta
	//$_GET è global, non c'è bisogno di fare nulla
	//$db ho dovuto portarla dentro col costruttore di RESTItem
	$temp = new Direttivo($db);
	$temp->dispatch();
?>
