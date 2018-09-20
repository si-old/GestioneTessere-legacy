<?php

    require_once('include/config.php');
    require_once('include/lib.php');
    require_once('include/utils.php');

class Socio extends RESTItem
{

    function __construct($db)
    {
        parent::__construct($db);
        $this->has_tesserati = isset($_GET['tesserati']) && strlen($_GET['tesserati']) > 0;
        $this->tesserati = filter_var($_GET['tesserati'], FILTER_VALIDATE_BOOLEAN);
    }

    private $query_carriere = '	SELECT	ca.Socio as ca_socio, ca.ID as ca_id, ca.Studente as ca_studente, 
											ca.Professione as ca_professione, ca.Matricola as ca_matricola, 
											ca.Attiva as ca_attiva, c.ID as c_id, c.Nome as c_nome
									FROM Carriera as ca LEFT JOIN Corso as c on c.ID = ca.Corso ';
        
    private $query_tessere = '	SELECT	t.Socio as t_socio, t.ID as t_id, t.Numero as t_numero, 
											a.ID as a_id, a.Anno as a_anno, a.Aperto as a_aperto
									FROM Tessera as t JOIN Tesseramento as a on t.Anno = a.ID ';

    private function get_list($paginate = false, $offset = 0, $limit = 10)
    {
        $query_carriere_attive = $this->query_carriere.'WHERE ca.Attiva = 1';
        $query_tessere_attive = $this->query_tessere.'WHERE a.Aperto = 1';
        $select_data = '	SELECT	s.ID as s_id, s.Nome as s_nome, s.Cognome as s_cognome, 
								s.Email as s_email, s.Cellulare as s_cellulare, s.Facebook as s_facebook,
								ca_id, ca_studente, ca_professione, ca_matricola, ca_attiva, c_id, 
								c_nome, t_id, t_numero, a_id, a_anno, a_aperto';
        $from_where =" FROM Socio as s	LEFT JOIN ( $query_carriere_attive ) as c on ca_socio = s.ID
										LEFT JOIN ( $query_tessere_attive ) as t on t_socio = s.ID";
        if ($this->has_tesserati) {
            if ($this->tesserati) {
                $from_where = $from_where.' WHERE t_numero IS NOT NULL';
            } else {
                $from_where = $from_where.' WHERE t_numero IS NULL';
            }
        }
        $query = $select_data.$from_where;
        if ($this->has_order) {
            $query = $query." ORDER BY $this->orderby";
            if ($this->orderasc) {
                $query = $query.' ASC';
            } else {
                $query = $query.' DESC';
            }
        }
        if ($paginate) {
            $query = $query.' LIMIT ? OFFSET ?';
        }
        $stmt = $this->db->prepare($query);
        if ($paginate) {
            $stmt->bind_param('ii', $limit, $offset);
        }
        if (! $stmt->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }
        $results = fetch_results($stmt);
        $users = array();
        foreach ($results as $user) {
            $tesseramento = array('id' => $user['a_id'], 'anno' => $user['a_anno'], 'aperto' => $user['a_aperto']);
            $tessera = array('id' => $user['t_id'], 'anno' => $tesseramento, 'numero' => $user['t_numero']);
            $corso = array('id' => $user['c_id'], 'nome' => $user['c_nome']);
            $carriera = array('id' => $user['ca_id'], 'studente' => $user['ca_studente'], 'professione' => $user['ca_professione'],
                                                'matricola' => $user['ca_matricola'], 'corso' => $corso, 'attiva' => $user['ca_attiva']);
            $users[] = array('id' => $user['s_id'], 'nome' => $user['s_nome'], 'cognome' => $user['s_cognome'],
                                                        'email' => $user['s_email'], 'cellulare' => $user['s_cellulare'], 'facebook' => $user['s_facebook'],
                                                        'carriere' => array($carriera), 'tessere' => array($tessera));
        }
        if ($paginate) {
            $res = $this->db->query('SELECT COUNT(*)'.$from_where);
            while ($row = $res->fetch_row()) {
                $size = $row[0];
            }
            $to_return2 = array(
                                'totale' => $size,
                                'offset' => $offset,
                                'limit' => $limit,
                                'results' => $users );
            return $to_return2;
        } else {
            return $users;
        }
    }

    private function get_full_socio($id)
    {
        $query_socio = 'SELECT * FROM Socio WHERE ID = ?';
        $query_tessere_socio = $this->query_tessere.'WHERE t.Socio = ? ORDER BY a.Aperto DESC';
        $query_carriere_socio = $this->query_carriere.'WHERE ca.Socio = ? ORDER BY ca.Attiva DESC';
            
        $stmt_socio = $this->db->prepare($query_socio);
        $stmt_socio->bind_param('i', $id);
        if (! $stmt_socio->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
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
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }
        $res_tessere = fetch_results($stmt_tessere);
            
        $stmt_carriere = $this->db->prepare($query_carriere_socio);
        $stmt_carriere->bind_param('i', $id);
        if (! $stmt_carriere->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
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

    protected function do_get()
    {
        if ($this->has_id) {
            $this->log_debug( "Ricerca socio con id $this->id.");
            return $this->get_full_socio($this->id);
        } else {
            $this->log_debug('Ricerca tutti i soci.');
            return $this->get_list($this->paginate, $this->offset, $this->limit);
        }
    }

    private function validate_socio($new_socio)
    {
        $valid_nome = isset($new_socio['nome']) && strlen($new_socio['nome']) > 0;
        $valid_cognome = isset($new_socio['cognome']) && strlen($new_socio['cognome']) > 0;
        $valid_email = isset($new_socio['email']) && strlen($new_socio['email']) > 0;
        $valid_socio = $valid_nome && $valid_cognome && $valid_email;
            
        $valid_tessere = isset($new_socio['tessere']) && count($new_socio['tessere']) > 0;
        $valid_tesseramento =  $valid_tessere && isset($new_socio['tessere'][0]['anno']) && isset($new_socio['tessere'][0]['anno']['id']);
        $valid_tessera = $valid_tesseramento && isset($new_socio['tessere'][0]['numero']) && isset($new_socio['tessere'][0]['quota']);

        $valid_carriere = isset($new_socio['carriere']) && count($new_socio['carriere']) > 0;
        $valid_carriera_base = $valid_carriere && isset($new_socio['carriere'][0]['studente']);
        $valid_carriera_prof = $valid_carriera_base && !$new_socio['carriere'][0]['studente'] && isset($new_socio['carriere'][0]['professione'])
                                && strlen($new_socio['carriere'][0]['professione']) > 0;
        $valid_carriera_stud = $valid_carriera_base && $new_socio['carriere'][0]['studente'] && isset($new_socio['carriere'][0]['matricola'])
                                && isset($new_socio['carriere'][0]['corso']) && isset($new_socio['carriere'][0]['corso']['id']);
        $valid_carriera = $valid_carriera_stud || $valid_carriera_prof;

        $toReturn = $valid_socio && $valid_tessera && $valid_carriera;
        if (!$toReturn) {
            var_dump(get_defined_vars());
        }
        return $valid_socio && $valid_tessera && $valid_carriera;
    }

    private function add_socio($new_socio)
    {
        $this->db->begin_transaction();

        $stmt_socio = $this->db->prepare('INSERT INTO Socio(Nome, Cognome, Email, Cellulare, Facebook, Blacklist) VALUES (?, ?, ?, ?, ?, false)');
        $stmt_socio->bind_param('sssss', $new_socio['nome'], $new_socio['cognome'], $new_socio['email'], $new_socio['cellulare'], $new_socio['email']);
        if (! $stmt_socio->execute()) {
            $this->db->rollback();
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }
        $socio_id = $this->db->insert_id;
            
        $tessera = $new_socio['tessere'][0];
        $stmt_tessera = $this->db->prepare('INSERT INTO Tessera(Socio, Anno, Numero) VALUES (?, ?, ?)');
        $stmt_tessera->bind_param('iii', $socio_id, $tessera['anno']['id'], $tessera['numero']);
        if (! $stmt_tessera->execute()) {
            $this->db->rollback();
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }
        $id_tessera = $this->db->insert_id;

        $carriera = $new_socio['carriere'][0];
        $stmt_carriera = $this->db->prepare('INSERT INTO Carriera(Socio, Studente, Professione, Corso, Matricola, Attiva) VALUES (?, ?, ?, ?, ?, 1)');
        $stmt_carriera->bind_param('iisis', $socio_id, $carriera['studente'], $carriera['professione'], $carriera['corso']['id'], $carriera['matricola']);
        if (! $stmt_carriera->execute()) {
            $this->db->rollback();
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }
        $id_carriera = $this->db->insert_id;

        $stmt_statino = $this->db->prepare('INSERT INTO Statino (Tessera, Nome, Cognome, Email, Cellulare, Quota, Data, Carriera) VALUES (?, ?, ?, ?, ?, ?, curdate(), ?)');
        $stmt_statino->bind_param('issssii', $id_tessera, $new_socio['nome'], $new_socio['cognome'], $new_socio['email'], $new_socio['cellulare'], $tessera['quota'], $id_carriera);
        if (! $stmt_statino->execute()) {
            $this->db->rollback();
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }

        $this->log_info( "Aggiunta di un nuovo socio con id $socio_id.");
        $this->db->commit();
    }

    private function edit_socio($new_socio)
    {
        $this->db->begin_transaction();

        $stmt_socio = $this->db->prepare('UPDATE Socio SET Nome=?,Cognome=?,Email=?,Cellulare=?,Facebook=? WHERE ID=?');
        $stmt_socio->bind_param('sssssi', $new_socio['nome'], $new_socio['cognome'], $new_socio['email'],
                                          $new_socio['cellulare'], $new_socio['facebook'], $new_socio['id']);
        if (! $stmt_socio->execute()) {
            $this->db->rollback();
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }

        $carriere_ids = '';
        $stmt_carriera_upd = $this->db->prepare('UPDATE Carriera SET Studente=?,Professione=?,Corso=?,Matricola=?,Attiva=? WHERE ID=?');
        $stmt_carriera_ins = $this->db->prepare('INSERT INTO Carriera (Studente, Professione, Corso, Matricola, Attiva, Socio) VALUES (?, ?, ?, ?, ?, ?)');
        foreach ($new_socio['carriere'] as $carriera) {
            if($carriera['attiva']){
               $id_carriera_attiva = intval($carriera['id']);
            }
            if (isset($carriera['id'])) {
                $stmt_carriera_upd->bind_param('isisii', $carriera['studente'], $carriera['professione'], $carriera['corso']['id'], $carriera['matricola'], $carriera['attiva'], $carriera['id']);
                if (! $stmt_carriera_upd->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
                }
                $carriere_ids = $carriere_ids.intval($carriera['id']).', ';
            } else {
                $stmt_carriera_ins->bind_param('isisii', $carriera['studente'], $carriera['professione'], $carriera['corso']['id'], $carriera['matricola'], $carriera['attiva'], $new_socio['id']);
                if (! $stmt_carriera_ins->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
                }
                $carriere_ids = $carriere_ids.$this->db->insert_id.', ';
            }
        }
        $carriere_ids = substr($carriere_ids, 0, -2);
        $stmt_carriere_del = $this->db->prepare('DELETE FROM Carriera WHERE ID NOT IN ('.$carriere_ids.') AND Socio = ?');
        $stmt_carriere_del->bind_param('i', $new_socio['id']);
        if (! $stmt_carriere_del->execute()) {
            $this->db->rollback();
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }

        $tessere_ids = '';
        $stmt_tessera_upd = $this->db->prepare('UPDATE Tessera SET Anno=?,Numero=? WHERE ID=?');
        $stmt_tessera_ins = $this->db->prepare('INSERT INTO Tessera (Anno, Numero, Socio) VALUES (?, ?, ?)');
        $stmt_statino = $this->db->prepare('INSERT INTO Statino (Tessera, Nome, Cognome, Email, Cellulare, Quota, Data, Carriera) VALUES (?, ?, ?, ?, ?, ?, curdate(), ?)');
        foreach ($new_socio['tessere'] as $tessera) {
            if (isset($tessera['id'])) {
                $stmt_tessera_upd->bind_param('iii', $tessera['anno']['id'], $tessera['numero'], $tessera['id']);
                if (! $stmt_tessera_upd->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
                }
                $tessere_ids = $tessere_ids.intval($tessera['id']).', ';
            } else {
                $stmt_tessera_ins->bind_param('iii', $tessera['anno']['id'], $tessera['numero'], $new_socio['id']);
                if (! $stmt_tessera_ins->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
                }
                $id_tessera = $this->db->insert_id;
                $tessere_ids = $tessere_ids.$id_tessera.', ';
                
                // aggiunta statino
                $stmt_statino->bind_param('issssii', $id_tessera, $new_socio['nome'], $new_socio['cognome'], $new_socio['email'], $new_socio['cellulare'], $tessera['quota'], $id_carriera_attiva);
                if(! $stmt_statino->execute() ){
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
                }
            }
        }
        $tessere_ids = substr($tessere_ids, 0, -2);
        $stmt_tessere_del = $this->db->prepare('DELETE FROM Tessera WHERE ID NOT IN ('.$tessere_ids.') AND Socio = ?');
        $stmt_tessere_del->bind_param('i', $new_socio['id']);
        if (! $stmt_tessere_del->execute()) {
            $this->db->rollback();
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, __FILE__.':'.__LINE__.'-'.$this->db->error);
        }
        $this->log_info( "Modifica socio con id ".$new_socio['id'].".");
        $this->db->commit();
    }

    /*
    {
        nome: nome del socio, obbligatorio e non vuoto
        cognome: cognome del socio, obbligatorio e non vuoto
		email: email del socio, obbligatorio e non vuoto
		cellulare: facoltativo, stringa
		facebook: facoltativo, stringa
        tessere: array con almeno un elemento di
            {
                anno: {
                    id: numero, id del tessermento a cui si riferisce la tessera
                }
                numero: numero della tessera
                quota: numero
                id_statino: numero
            }
        carriere: array con almeno un elemento di
            {
                studente: booleano
                professione: stringa, obbligatoria e non vuota se studente è false
                matricola: stringa, obbligatoria e non vuota se studente è true
                corso:{
                    id: numero, obbligatorio se studente è true
                }
            }
    }
    */
    protected function do_post($data)
    {
        if (!$this->validate_socio($data)) {
            throw new RESTException(HttpStatusCode::$BAD_REQUEST);
        }
        if ($this->has_id) {
            $this->edit_socio($data);
        } else {
            $this->add_socio($data);
        }
        return $this->do_get();
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
    $temp = new Socio($db);
    $temp->dispatch();
