<?php
	abstract class RESTItem{
		
		public static $ERROR_NODATA = array('errno' => 1, 'errdesc' => 'Dati insufficienti');
		
		function __construct($db){
			$this->db = $db;
		}
		
		public function dispatch(){
			switch($_SERVER['REQUEST_METHOD']){
			case 'GET': 
				$this->do_get();
				break;
			case 'POST':
				$this->do_post();
				break;
			case 'DELETE':
				$this->do_del();
				break;
			}
		}
		
		protected function get_body(){
			return json_decode(file_get_contents('php://input'), true);
		}
		
		abstract protected function do_get();
		abstract protected function do_post();
		abstract protected function do_del();
		
	};
?>