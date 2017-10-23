<?php
    require_once('include/config.php');
    
    //contiene RESTItem, base per le richieste
    require_once('include/lib.php');
    
class Login extends RESTItem
{

    function __construct($db, $admin_user, $admin_password)
    {
        parent::__construct($db);
        $this->admin_user = $admin_user;
        $this->admin_password = $admin_password;
    }
        
    private function check_login($user, $password)
    {
        if (strcasecmp($user, $this->admin_user)==0 && strcmp($password, $this->admin_user)==0) {
            return true;
        }
        $stmt = $this->db->prepare('SELECT * FROM Direttivo WHERE User=? and Password=? ');
        $stmt->bind_param('ss', $user, $password);
        if (! $stmt->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $stmt->bind_result($idr, $user, $pass, $socio);
        if ($stmt->fetch()) {
            return true;
        } else {
            return false;
        }
    }
        
    protected function do_get()
    {
        throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
    }
        
    /*
    {
        user: username dell'utente che vuole loggarsi
        password: password dell'utente che vuole loggarsi
    }
    */
    protected function do_post($data)
    {
        if (isset($data['user']) && isset($data['password'])) {
            $user = $data['user'];
            $password = $data['password'];
            $is_admin = strcasecmp($user, $this->admin_user)==0;
            $successful = $this->check_login($user, $password);
            if ($successful) {
                $this->session->create($is_admin, $user);
                $this->logger->info("Utente ".$user." si è loggato. Sessione creata.");
            }
            return array('login' => $successful, 'admin' => $is_admin);
        } else {
            throw new RESTException(HttpStatusCode::$BAD_REQUEST, "Request JSON object is missing or has a wrong format");
        }
    }
        
    protected function do_del()
    {
        $res = $this->session->destroy();
        $this->logger->info("Logout dell'utente ".$this->session->get_user().".");
        return array('login' => !$res, 'admin' => false);
    }

    protected function is_session_authorized()
    {
        return true;
    }
}
    
    // $db ho dovuto portarla dentro col costruttore di RESTItem
    // user e password per l'admin sono iniettate col costruttore locale.
    // tutte e tre sono definite in config.php
    $temp = new Login($db, $ADMIN_USER, $ADMIN_PSW);
    $temp->dispatch();
