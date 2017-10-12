<?php

	abstract class RESTItem{

		function __construct($db){
			$this->db = $db;
		}

		public function dispatch(){
			//to avoid output
			error_reporting(E_ALL);

			//to allow CORS
			header("Access-Control-Allow-Origin: *");
			header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
			header("Access-Control-Allow-Headers: Content-Type");
			
			try{
				$body = json_decode(file_get_contents('php://input'), true);
				header("Content-Type: application/json");				
				switch($_SERVER['REQUEST_METHOD']){
				case 'GET': 
					$res = $this->do_get($body);
					break;
				case 'POST':
					$res = $this->do_post($body);
					break;
				case 'DELETE':
					$res = $this->do_del($body);
					break;
				case 'OPTIONS':
					break;
				}
				echo json_encode($res, JSON_UNESCAPED_UNICODE);
			}catch(RESTException $ex){
				http_response_code($ex->get_error_code());
			}catch(Exception $ex){
				http_response_code(HttpStatusCode::$INTERNAL_SERVER_ERROR);
			}
		}		

		abstract protected function do_get($body);

		abstract protected function do_post($body);

		abstract protected function do_del($body);

	};

	class RESTException extends Exception{

		function __construct($code){
			$this->code = $code;
		}

		function get_error_code(){
			return $this->code;
		}
	}

	class HttpStatusCode{
		
		public static $SWITCHING_PROTOCOLS = 101;
		public static $OK = 200;
		public static $CREATED = 201;
		public static $ACCEPTED = 202;
		public static $NONAUTHORITATIVE_INFORMATION = 203;
		public static $NO_CONTENT = 204;
		public static $RESET_CONTENT = 205;
		public static $PARTIAL_CONTENT = 206;
		public static $MULTIPLE_CHOICES = 300;
		public static $MOVED_PERMANENTLY = 301;
		public static $MOVED_TEMPORARILY = 302;
		public static $SEE_OTHER = 303;
		public static $NOT_MODIFIED = 304;
		public static $USE_PROXY = 305;
		public static $BAD_REQUEST = 400;
		public static $UNAUTHORIZED = 401;
		public static $PAYMENT_REQUIRED = 402;
		public static $FORBIDDEN = 403;
		public static $NOT_FOUND = 404;
		public static $METHOD_NOT_ALLOWED = 405;
		public static $NOT_ACCEPTABLE = 406;
		public static $PROXY_AUTHENTICATION_REQUIRED = 407;
		public static $REQUEST_TIMEOUT = 408;
		public static $CONFLICT = 408;
		public static $GONE = 410;
		public static $LENGTH_REQUIRED = 411;
		public static $PRECONDITION_FAILED = 412;
		public static $REQUEST_ENTITY_TOO_LARGE = 413;
		public static $REQUESTURI_TOO_LARGE = 414;
		public static $UNSUPPORTED_MEDIA_TYPE = 415;
		public static $REQUESTED_RANGE_NOT_SATISFIABLE = 416;
		public static $EXPECTATION_FAILED = 417;
		public static $IM_A_TEAPOT = 418;
		public static $INTERNAL_SERVER_ERROR = 500;
		public static $NOT_IMPLEMENTED = 501;
		public static $BAD_GATEWAY = 502;
		public static $SERVICE_UNAVAILABLE = 503;
		public static $GATEWAY_TIMEOUT = 504;
		public static $HTTP_VERSION_NOT_SUPPORTED = 505;
	}

?>
