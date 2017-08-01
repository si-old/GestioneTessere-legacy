<?php

	abstract class RESTItem{

		

		public static $ERROR_NODATA = array('errno' => 1, 'errdesc' => 'Dati insufficienti');

		

		function __construct($db){

			$this->db = $db;

		}

		

		public function dispatch(){
			$body = json_decode(file_get_contents('php://input'), true);

			switch($_SERVER['REQUEST_METHOD']){

			case 'GET': 

				$this->do_get($body);

				break;

			case 'POST':

				$this->do_post($body);

				break;

			case 'DELETE':

				$this->do_del($body);

				break;

			}

		}		

		abstract protected function do_get($body);

		abstract protected function do_post($body);

		abstract protected function do_del($body);

		

	};

?>
