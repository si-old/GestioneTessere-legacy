<?php
    require_once('include/config.php');
    require_once('include/lib.php');
    
class Corso extends RESTItem
{

    function __construct($db){
        parent::__construct($db);
        $this->has_sostituto = isset($_GET['sostituto']);
        $this->sostituto = $_GET['sostituto'];
    }
        
    protected function do_get()
    {
        $stmt = $this->db->prepare('SELECT * FROM Corso ORDER BY ID ASC');
        if (! $stmt->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $stmt->bind_result($id, $nome);
        $res = array();
        while ($stmt->fetch()) {
            $res[] = array('id' => $id, 'nome' => $nome);
        }
        $this->log_debug( 'Ricerca di tutti i Corsi di Laurea.');
        return $res;
    }
        
	/*
		{
			nome: nome del ccorso da modificare o creare
			id: presente se è una modifica, altrimenti si crea un nuovo corso
		}
	*/
    protected function do_post($data)
    {
        $valid = isset($data['nome']);
        $update = isset($data['id']);
        if ($valid) {
            if ($update) {
                $stmt = $this->db->prepare('UPDATE Corso SET Nome = ? WHERE ID = ?');
                $stmt->bind_param('si', $data['nome'], $data['id']);
            } else {
                $stmt = $this->db->prepare('INSERT INTO Corso (Nome) VALUES (?)');
                $stmt->bind_param('s', $data['nome']);
            }
            if (! $stmt->execute()) {
                throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
            }
            $this->log_info( 'Aggiornato/Aggiunto Corso di Laurea.');
            return $this->do_get();
        } else {
            throw new RESTException(HttpStatusCode::$BAD_REQUEST, "Request JSON object is missing or has a wrong format");
        }
    }
        
    protected function do_del()
    {
        if ($this->has_id && $this->has_sostituto) {
            $stmt = $this->db->prepare('UPDATE Carriera SET Corso = ? WHERE Corso = ?');
            $stmt->bind_param('ii', $this->sostituto, $this->id);
            if (! $stmt->execute()) {
                throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
            }
            $stmt = $this->db->prepare('DELETE FROM Corso WHERE ID=?');
            $stmt->bind_param('i', $this->id);
            if (! $stmt->execute()) {
                throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
            }
            $this->log_info("Rimosso $this->id e sostituito con $this->sostituto.");
            return $this->do_get();
        } else {
            throw new RESTException(HttpStatusCode::$NOT_FOUND);
        }
    }

    protected function is_session_authorized()
    {
        return $this->session->is_valid();
    }
}
    
    // $db ho dovuto portarla dentro col costruttore di RESTItem
    // è definita in config.php
    $temp = new Corso($db);
    $temp->dispatch();
