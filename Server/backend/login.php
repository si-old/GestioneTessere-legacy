<?php
	require_once('include/config.php');
	
	//contiene RESTItem, base per le richieste
	require_once('include/lib.php');
	
	class Login extends RESTItem{

		private static $ADMIN_USER = "admin";
		private static $ADMIN_PSW = "studentingegneria";
		
		private function check_login($user, $password){
			$stmt = $this->db->prepare('SELECT * FROM Direttivo WHERE User=? and Password=? ');
			$stmt->bind_param('ss', $user, $password);
			if( ! $stmt->execute() ){
				throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
			}
			$stmt->bind_result($idr, $user, $pass, $socio);
			if($stmt->fetch()){
				return true;
			}else{
				return false;
			}
		}
		
		protected function do_get(){
			throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
		}
		
		protected function do_post($data){
			if(isset($data['user']) && isset($data['password'])){
				$user = $data['user'];
				$password = $data['password'];
				$is_admin = strcasecmp($user, Login::$ADMIN_USER)==0 && strcmp($password, Login::$ADMIN_PSW)==0;
				$successful = $is_admin || $this->check_login($user, $password);
				if($successful){
					$this->session->create($is_admin);
				}
				return array('login' => $successful, 'admin' => $is_admin);
			}else{
				throw new RESTException(HttpStatusCode::$BAD_REQUEST);	
			}
		}
		
		protected function do_del(){
			$res = $this->session->destroy();
			return array('login' => !$res, 'admin' => false);
		}

		protected function is_session_authorized(){
			return true;
		}
	}
	
	//crea un oggetto direttivo e esegue la richiesta
	//$_GET è global, non c'è bisogno di fare nulla
	//$db ho dovuto portarla dentro col costruttore di RESTItem
	$temp = new Login($db);
	$temp->dispatch();
?>