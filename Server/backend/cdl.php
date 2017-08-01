<?php
	require_once('include/config.php');
	require_once('include/lib.php');
	
	class CdL extends RESTItem{
		
		protected function do_get($data){
			$flag_id = isset($_GET['id']);
			if($flag_id){
				$stmt = $this->db->prepare('SELECT * FROM CdL WHERE ID=?');
				$stmt->bind_param('i', $_GET['id']);
			}else{
				$stmt = $this->db->prepare('SELECT * FROM CdL');
			}
			$stmt->execute();
			$stmt->bind_result($id, $nome);
			$res = array();
			$i = 0;
			while($stmt->fetch()){
				$res[$i] = array('id' => $id, 'nome' => $nome);
				$i++;
			}
			//se abbiamo id, c'è un solo elemento, mandiamo solo quello
			if($flag_id){
				echo json_encode($res[0]);
			}else{
				echo json_encode($res);
			}
		}
		
		protected function do_post($data){
			$valid = isset($data['nome']);
			if($valid){
				//dovremmo controllare se il nome c'è già?
				$stmt = $this->db->prepare('INSERT INTO CdL (Nome) VALUES (?)');
				$stmt->bind_param('s', $data['nome']);
				echo json_encode($stmt->execute());
			}else{
				echo json_encode(RESTItem::$ERROR_NODATA);
			}
		}
		
		protected function do_del($data){
			if(isset($data['id'])){
				$stmt = $this->db->prepare('DELETE FROM CdL WHERE ID=?');
				$stmt->bind_param('i', $data['id']);
				echo json_encode($stmt->execute());
			}else{
				echo json_encode(RESTItem::$ERROR_NODATA);
			}
		}
	}
	
	$temp = new CdL($db);
	$temp->dispatch();
?>
