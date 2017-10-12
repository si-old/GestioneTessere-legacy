<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	
	class CdL extends RESTItem{
		
		protected function do_get($data){
			$stmt = $this->db->prepare('SELECT * FROM CdL ORDER BY ID ASC');
			$stmt->execute();
			$stmt->bind_result($id, $nome);
			$res = array();
			$i = 0;
			while($stmt->fetch()){
				$res[$i] = array('id' => $id, 'nome' => $nome);
				$i++;
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
				$stmt->execute();
				return $this->do_get("");
			}else{
				throw new RESTException(HttpStatusCode::$BAD_REQUEST);
			}
		}
		
		protected function do_del($data){
			if(isset($_GET['id'])){
				$stmt = $this->db->prepare('DELETE FROM CdL WHERE ID=?');
				$stmt->bind_param('i', $_GET['id']);
				$stmt->execute();
				return $this->do_get("");
			}else{
				throw new RESTException(HttpStatusCode::$NOT_FOUND);
			}
		}
	}
	
	$temp = new CdL($db);
	$temp->dispatch();
?>
