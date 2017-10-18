<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	
	class CdL extends RESTItem{
		
		protected function do_get(){
			$stmt = $this->db->prepare('SELECT * FROM CdL ORDER BY ID ASC');
			if( ! $stmt->execute() ){
				throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
			}
			$stmt->bind_result($id, $nome);
			$res = array();
			while($stmt->fetch()){
				$res[] = array('id' => $id, 'nome' => $nome);
			}
			return $res;
		}
		
		protected function do_post($data){
			$valid = isset($data['nome']);
			$update = isset($data['id']);
			if($valid){
				if($update){
					$stmt = $this->db->prepare('UPDATE CdL SET Nome = ? WHERE ID = ?');
					$stmt->bind_param('si', $data['nome'], $data['id']);
				}else{
					$stmt = $this->db->prepare('INSERT INTO CdL (Nome) VALUES (?)');	
					$stmt->bind_param('s', $data['nome']);
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
			if($this->has_id){
				$stmt = $this->db->prepare('DELETE FROM CdL WHERE ID=?');
				$stmt->bind_param('i', $this->id);
				if( ! $stmt->execute() ){
					throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
				}
				return $this->do_get();
			}else{
				throw new RESTException(HttpStatusCode::$NOT_FOUND);
			}
		}

		protected function is_session_authorized() {
			return $this->session->is_valid();
		}
	}
	
	$temp = new CdL($db);
	$temp->dispatch();
?>
