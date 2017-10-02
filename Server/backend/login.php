<?php
	require_once('include/config.php');
	
	//contiene RESTItem, base per le richieste
	require_once('include/lib.php');
	
	class Login extends RESTItem{
		
		private function get_data($user, $password){
			$stmt = $this->db->prepare('SELECT * FROM Direttivo WHERE User=? and Password=? ');
			$stmt->bind_param('ss', $user, $password);
			$stmt->execute();
			$stmt->bind_result($idr, $user, $pass, $socio);
			if($stmt->fetch()){
				return true;
			}else{
				return false;
			}
		}
		
		protected function do_get($data){
			echo json_encode(RESTItem::$ERROR_NODATA);
		}
		
		protected function do_post($new_data){
			if(isset($_POST['user']) && isset($_POST['password'])){
				$user = $_POST['user'];
				$password = $_POST['password'];
				echo json_encode($this->get_data($user, $password));
			}else{
				echo json_encode(false);
			}
		}
		
		protected function do_del($data){
			echo json_encode(RESTItem::$ERROR_NODATA);
		}
	}
	
	//crea un oggetto direttivo e esegue la richiesta
	//$_GET è global, non c'è bisogno di fare nulla
	//$db ho dovuto portarla dentro col costruttore di RESTItem
	$temp = new Login($db);
	$temp->dispatch();
?>