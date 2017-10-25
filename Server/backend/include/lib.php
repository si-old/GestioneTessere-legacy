<?php

require_once('session.php');
require_once('config.php');
require_once('loggerFacade.php');

abstract class RESTItem
{
	private $CSV_DELIMITER = ';';

    function __construct($db)
    {
        $this->db = $db;
        $this->has_id = isset($_GET['id']) && strlen($_GET['id']) > 0;
        $this->id = $_GET['id'];
        $this->paginate = isset($_GET['paginate']) || isset($_GET['limit']) || isset($_GET['offset']);
        $this->limit = isset($_GET['limit']) ? $_GET['limit'] : 10;
        $this->offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
        $this->session = new Session();
        $this->logger = new LoggerFacade(get_class($this), $db);
        $this->is_csv = false;
    }

    public function dispatch()
    {
        //to avoid output
        // error_reporting(E_ALL);

        //to allow CORS
        $headers = apache_request_headers();
        if (isset($headers['Origin'])) {
            header("Access-Control-Allow-Origin: ".$headers['Origin']);
        } else {
            header("Access-Control-Allow-Origin: *");
        }
        header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type");
        try {
            if ($this->is_session_authorized() || true) {
            	$this->set_return_header($headers);
                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'GET':
                        $res = $this->do_get();
                        break;
                    case 'POST':
                        $body = json_decode(file_get_contents('php://input'), true);
                        if (is_null($body)) {
                            throw new RESTException(HttpStatusCode::$BAD_REQUEST, "The body must be valid JSON data, error: ".json_last_error_msg());
                        }
                        $res = $this->do_post($body);
                        break;
                    case 'DELETE':
                        $res = $this->do_del();
                        break;
                    case 'OPTIONS':
                        // return to send an empty body
                        // as OPTION should
                        return;
                }
                if(!$this->is_csv) {
                	echo json_encode($res, JSON_UNESCAPED_UNICODE);
                } else {
                	$this->write_csv($res);
                }
            } else {
                throw new RESTException(HttpStatusCode::$UNAUTHORIZED);
            }
        } catch (RESTException $ex) {
            http_response_code($ex->get_error_code());
            $this->log_error($ex->get_error_message());
            echo $ex->get_error_message();
        } catch (Exception $ex) {
            http_response_code(HttpStatusCode::$INTERNAL_SERVER_ERROR);
            $this->log_error($ex->get_error_message());
            echo $ex->getMessage();
        }
    }

    private function set_return_header($headers) {
    	if(isset($headers['Accept']) && strcasecmp($headers['Accept'], 'text/csv')==0) {
    		$this->is_csv = true;
			header('Content-Type: text/csv; charset=utf-8');
			$filename = get_class($this).date('_Y-m-d').'.csv';
    		header('Content-Disposition: attachment; filename='.$filename);
    	} else {
    		$this->is_csv = false;
    		header("Content-Type: application/json");
    	}
    }

    private function write_csv($content) {
		$fp=fopen('php://output', 'w');
		fputcsv($fp, array_keys($content[0]), $CSV_DELIMITER);
		foreach($content as $fields) {
			$result = [];
    		array_walk_recursive($fields, function($item) use (&$result) {
    			if(is_array($item)) {
    				$result[] = $item[0];
    			} else {
        			$result[] = $item;
        		}
    		});
    		fputcsv($fp, $result, $CSV_DELIMITER);
		}
		fclose($fp);
	}

    abstract protected function do_get();

    abstract protected function do_post($body);

    abstract protected function do_del();

    abstract protected function is_session_authorized();

    protected function log_info($message){
        $this->logger->info($this->session->get_user(), $message);
    }

    protected function log_error($message){
        $this->logger->error($this->session->get_user(), $message);
    }

    protected function log_debug($message){
        $this->logger->debug($this->session->get_user(), $message);
    }
};

class RESTException extends Exception
{

    function __construct($code, $error_message = "")
    {
        $this->code = $code;
        $this->error_message = $error_message;
    }

    function get_error_code()
    {
        return $this->code;
    }

    function get_error_message(){
        return $this->error_message;
    }
}

class HttpStatusCode
{
        
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
