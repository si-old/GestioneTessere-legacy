<?php
    require_once('include/config.php');
    require_once('include/lib.php');
    require_once('include/utils.php');
    
class ImportData extends RESTItem {

    private $query_carriere = '    SELECT  ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente, 
                                            ca.Professione as ca_professione, ca.Matricola as ca_matricola, 
                                            ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome
                                    FROM Carriera as ca LEFT JOIN CdL as c on c.ID = ca.CdL ';
        
    private $query_tessere = '  SELECT  t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero, 
                                            a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto
                                    FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID ';

    function __construct($db, $old_db) {
        parent::__construct($db);
        $this->old_db = $old_db;
    }
        
    protected function do_get() {
        $db_names = array('2010', '2011', '2012', '2013', '2014', '2015', '2016');
            foreach ($db_names as $db_name) {
                $id_tesseramento = $this->get_tesseramento($db_name);
    
                $stmt = $this->old_db->prepare('SELECT * FROM '.'soci_'.$db_name);
                if (! $stmt->execute()) {
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->old_db->error);
                }
                $results = fetch_results($stmt);
                $users = array();
            foreach ($results as $user) {
                $id_socio = $this->is_socio_exist($user['user_email']);
                $id_cdl = $this->get_cdl($user['cdl']);
                $studente = true;
                $professione = "";
                if (strcasecmp('Laureato', $user['cdl'])==0) {
                    $studente = false;
                    $professione = "Laureato";
                }
                if($id_socio == 0) {
                    $tessera = array(array('numero' => $user['tid'], 'anno' => $id_tesseramento));
                    $carriera = array(array('studente' => $studente, 'professione' => $professione, 'corso' => $id_cdl, 'matricola' => $user['matricola'], 'attiva' => false));
                    $new_socio = array('nome' => $user['nome'], 'cognome' => $user['cognome'], 'email' => $user['user_email'], 'cellulare' => $user['cell'], 'tessere' => $tessera, 'carriere' => $carriera);
                    $this->add_socio($new_socio);
                    $users[] = $new_socio;
        
                } else {
                    $socio = $this->get_full_socio($id_socio);
                    $tessera = array('numero' => $user['tid'], 'anno' => $id_tesseramento);
                    $carriera = array('studente' => $studente, 'professione' => $professione, 'corso' => $id_cdl, 'matricola' => $user['matricola'], 'attiva' => false);
                    if(!$this->is_carriera_exist($socio['carriere'], $carriera)) {
                        array_push($socio['carriere'], $carriera);
                    }
                    array_push($socio['tessere'], $tessera);
                    $this->edit_socio($socio);
                    $users[] = $socio;
                }
            }
        }
        return $users;
    }

    private function is_carriera_exist($carriere, $new_carriera) {
        foreach ($carriere as $carriera) {
            if($carriera['studente'] && $new_carriera['studente'] && $carriera['corso']==$new_carriera['corso'] && $carriera['matricola']==$new_carriera['matricola'] && $carriera['professione']==$new_carriera['professione']) {
                return true;
            }
        }
        return false;
    }

    private function is_socio_exist($email) {
        $stmt_socio = $this->db->prepare('SELECT ID FROM Socio WHERE Email = ?');
        $stmt_socio->bind_param('s', $email);
        if (! $stmt_socio->execute()) {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $stmt_socio->bind_result($id);
        $res_socio = array();
        while ($stmt_socio->fetch()) {
            $res_socio = array('id' => $id);
        }
        if (count($res_socio) == 0) {
            return 0;
        } elseif (count($res_socio) == 1) {
            return $res_socio['id'];
        } else {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, "More than one socio with the same email: ".$email);
        }
    }

    private function edit_socio($new_socio)
    {
        $this->db->begin_transaction();

        $stmt_socio = $this->db->prepare('UPDATE Socio SET Nome=?,Cognome=?,Email=?,Cellulare=?,Facebook=? WHERE ID=?');
        $stmt_socio->bind_param('sssssi', $new_socio['nome'], $new_socio['cognome'], $new_socio['email'],
                                          $new_socio['cellulare'], $new_socio['facebook'], $new_socio['id']);
        if (! $stmt_socio->execute()) {
            $this->db->rollback();

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }

        $carriere_ids = '';
        $stmt_carriera_upd = $this->db->prepare('UPDATE Carriera SET Studente=?,Professione=?,CdL=?,Matricola=?,Attiva=? WHERE ID=?');
        $stmt_carriera_ins = $this->db->prepare('INSERT INTO Carriera (Studente, Professione, CdL, Matricola, Attiva, Socio) VALUES (?, ?, ?, ?, ?, ?)');
        foreach ($new_socio['carriere'] as $carriera) {
            if (isset($carriera['id'])) {
                $stmt_carriera_upd->bind_param('isisii', $carriera['studente'], $carriera['professione'], $carriera['corso']['id'], $carriera['matricola'], $carriera['attiva'], $carriera['id']);
                if (! $stmt_carriera_upd->execute()) {
                    $this->db->rollback();
        
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
                $carriere_ids = $carriere_ids.intval($carriera['id']).', ';
            } else {
                $stmt_carriera_ins->bind_param('isisii', $carriera['studente'], $carriera['professione'], $carriera['corso']['id'], $carriera['matricola'], $carriera['attiva'], $new_socio['id']);
                if (! $stmt_carriera_ins->execute()) {
                    $this->db->rollback();
        
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
                $carriere_ids = $carriere_ids.$this->db->insert_id.', ';
            }
        }
        $carriere_ids = substr($carriere_ids, 0, -2);
        $stmt_carriere_del = $this->db->prepare('DELETE FROM Carriera WHERE ID NOT IN ('.$carriere_ids.') AND Socio = ?');
        $stmt_carriere_del->bind_param('i', $new_socio['id']);
        if (! $stmt_carriere_del->execute()) {
            $this->db->rollback();

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }

        $tessere_ids = '';
        $stmt_tessera_upd = $this->db->prepare('UPDATE Tessera SET Anno=?,Numero=? WHERE ID=?');
        $stmt_tessera_ins = $this->db->prepare('INSERT INTO Tessera (Anno, Numero, Socio) VALUES (?, ?, ?)');
        foreach ($new_socio['tessere'] as $tessera) {
            if (isset($tessera['id'])) {
                $stmt_tessera_upd->bind_param('iii', $tessera['anno']['id'], $tessera['numero'], $tessera['id']);
                if (! $stmt_tessera_upd->execute()) {
                    $this->db->rollback();
        
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
                $tessere_ids = $tessere_ids.intval($tessera['id']).', ';
            } else {
                $stmt_tessera_ins->bind_param('iii', $tessera['anno']['id'], $tessera['numero'], $new_socio['id']);
                if (! $stmt_tessera_ins->execute()) {
                    $this->db->rollback();
        
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
                $tessere_ids = $tessere_ids.$this->db->insert_id.', ';
            }
        }
        $tessere_ids = substr($tessere_ids, 0, -2);
        $stmt_tessere_del = $this->db->prepare('DELETE FROM Tessera WHERE ID NOT IN ('.$tessere_ids.') AND Socio = ?');
        $stmt_tessere_del->bind_param('i', $new_socio['id']);
        if (! $stmt_tessere_del->execute()) {
            $this->db->rollback();

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }

        $this->db->commit();
    }

        private function add_socio($new_socio)
    {
        $this->db->begin_transaction();

        $stmt_socio = $this->db->prepare('INSERT INTO Socio(Nome, Cognome, Email, Cellulare, Facebook) VALUES (?, ?, ?, ?, ?)');
        $stmt_socio->bind_param('sssss', $new_socio['nome'], $new_socio['cognome'], $new_socio['email'], $new_socio['cellulare'], $new_socio['email']);
        if (! $stmt_socio->execute()) {
            $this->db->rollback();

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $socio_id = $this->db->insert_id;
            
        $tessera = $new_socio['tessere'][0];
        $stmt_tessera = $this->db->prepare('INSERT INTO Tessera(Socio, Anno, Numero) VALUES (?, ?, ?)');
        $stmt_tessera->bind_param('iii', $socio_id, $tessera['anno']['id'], $tessera['numero']);
        if (! $stmt_tessera->execute()) {
            $this->db->rollback();

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }

        $carriera = $new_socio['carriere'][0];
        $stmt_carriera = $this->db->prepare('INSERT INTO Carriera(Socio, Studente, Professione, CdL, Matricola, Attiva) VALUES (?, ?, ?, ?, ?, 1)');
        $stmt_carriera->bind_param('iisis', $socio_id, $carriera['studente'], $carriera['professione'], $carriera['corso']['id'], $carriera['matricola']);
        if (! $stmt_carriera->execute()) {
            $this->db->rollback();

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }

        $this->db->commit();
    }

    private function get_tesseramento($anno) {
        $stmt = $this->db->prepare('SELECT ID FROM Tesseramento WHERE Anno = ?');
        $stmt->bind_param('s', $anno);
        if (! $stmt->execute()) {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $stmt->bind_result($id);
        $res = array();
        while ($stmt->fetch()) {
            $res = array('id' => $id);
        }
        return $res;
    }

    private function get_cdl($nome) {
        $stmt = $this->db->prepare('SELECT ID FROM CdL WHERE Nome = ?');
        $stmt->bind_param('s',$nome);
        if (! $stmt->execute()) {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $stmt->bind_result($id);
        $res = array();
        while ($stmt->fetch()) {
            $res = array('id' => $id);
        }
        return $res;
    }

    private function get_full_socio($id)
    {
        $query_socio = 'SELECT * FROM Socio WHERE ID = ?';
        $query_tessere_socio = $this->query_tessere.'WHERE t.Socio = ? ORDER BY a.Aperto DESC';
        $query_carriere_socio = $this->query_carriere.'WHERE ca.Socio = ? ORDER BY ca.Attiva DESC';
            
        $stmt_socio = $this->db->prepare($query_socio);
        $stmt_socio->bind_param('i', $id);
        if (! $stmt_socio->execute()) {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $res_socio = fetch_results($stmt_socio);
        if (count($res_socio) > 1) {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, "More than one socio with the same ID: ".$id);
        } elseif (count($res_socio) == 0) {

            throw new RESTException(HttpStatusCode::$NOT_FOUND);
        }

        $stmt_tessere = $this->db->prepare($query_tessere_socio);
        $stmt_tessere->bind_param('i', $id);
        if (! $stmt_tessere->execute()) {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $res_tessere = fetch_results($stmt_tessere);
            
        $stmt_carriere = $this->db->prepare($query_carriere_socio);
        $stmt_carriere->bind_param('i', $id);
        if (! $stmt_carriere->execute()) {

            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $res_carriere = fetch_results($stmt_carriere);

        $carriere = [];
        foreach ($res_carriere as $carriera) {
            $corso = array('id' => $carriera['c_id'], 'nome'=> $carriera['c_nome']);
            $carriere[] = array('id' => $carriera['ca_id'], 'studente' => $carriera['ca_studente'], 'professione' => $carriera['ca_professione'],
                                'matricola' => $carriera['ca_matricola'], 'corso' => $corso, 'attiva' => $carriera['ca_attiva']);
        }

        $tessere = [];
        foreach ($res_tessere as $tessera) {
            $tesseramento = array('id' => $tessera['a_id'], 'anno' => $tessera['a_anno'], 'aperto' => $tessera['a_aperto']);
            $tessere[] = array('id' => $tessera['t_id'], 'anno' => $tesseramento, 'numero' => $tessera['t_numero']);
        }
        $user = $res_socio[0];
        $toReturn = array(  'id' => $user['ID'], 'nome' => $user['Nome'], 'cognome' => $user['Cognome'],
                            'email' => $user['Email'], 'cellulare' => $user['Cellulare'], 'facebook' => $user['Facebook'],
                            'carriere' => $carriere, 'tessere' => $tessere);
        return $toReturn;
    }
        
    protected function do_post($data) {
    }

    protected function do_del() {
    }

    protected function is_session_authorized() {
        return $this->session->is_valid();
    }
}
    
    // $db ho dovuto portarla dentro col costruttore di RESTItem
    // è definita in config.php
    $temp = new ImportData($db, $old_db);
    $temp->dispatch();
