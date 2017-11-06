<?php
    require_once('include/config.php');
    require_once('include/lib.php');
    
class Blacklist extends RESTItem
{        
    protected function do_get()
    {
        $stmt = $this->db->prepare('SELECT ID, Nome, Cognome, Email, Blacklist FROM Socio');
        if (! $stmt->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $stmt->bind_result($id, $nome,$cognome, $email, $blacklist_flag);
        $allowed = array();
        $blacklist = array();
        while ($stmt->fetch()) {
            if($blacklist_flag){
                $blacklist[] = array('id' => $id, 'nome' => $nome.' '.$cognome, 'email' => $email);
            }else{
                $allowed[] = array('id' => $id, 'nome' => $nome.' '.$cognome, 'email' => $email);
            }
        }
        return array('blacklist' => $blacklist, 'allowed' => $allowed);
    }

	/*
		{
            id: array, soci da aggiungere o togliere dalla blacklist
            blacklist: boolean, true se va aggiunto, false se va tolto
		}
	*/
    protected function do_post($data)
    {
        $valid = isset($data['id']) && is_array($data['id']) && isset($data['blacklist']);
        if ($valid) {
            $this->db->begin_transaction();
            $stmt = $this->db->prepare('UPDATE Socio SET Blacklist = ? WHERE ID = ?');
            foreach ($data['id'] as $id) {
                $stmt->bind_param('ii', $data['blacklist'], $id);                
                if ( ! $stmt->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
            }
            $this->db->commit();
            return $this->do_get();
        } else {
            throw new RESTException(HttpStatusCode::$BAD_REQUEST, "Request JSON object is missing or has a wrong format");
        }
    }
        
    protected function do_del()
    {
        throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
    }

    protected function is_session_authorized()
    {
        return $this->session->is_valid();
    }
}
    
    // $db ho dovuto portarla dentro col costruttore di RESTItem
    // è definita in config.php
    $temp = new Blacklist($db);
    $temp->dispatch();
