<?php

/* ----------------------- to debug frontend response to http errors ----------------------------- */
/*    //to avoid output
    error_reporting(E_ALL);
    //to allow CORS
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    if($_SERVER['REQUEST_METHOD']!='OPTIONS'){
        $body = json_decode(file_get_contents('php://input'), true);
        if(isset($body['code'])){
            http_response_code($body['code']);
        }else{
            http_response_code(400);

        }
        if(isset($body['message'])){
            echo $body['message'];
        }
    }
/**/
    /* ---------------------- to debug htaccess problems -------------------- */
    echo '<pre>';
    //echo "SERVER <br />";
    var_dump($_SERVER);
    //echo "GET <br />";
    var_dump($_GET);
    //echo "POST <br />";
    var_dump($_POST);
    echo '</pre>';
/**/