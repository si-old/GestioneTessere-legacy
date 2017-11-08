<?php
    require_once('include/config.php');
    require_once('include/lib.php');
    require_once('include/utils.php');
    
class RemoveDuplicate extends RESTItem {

    protected function do_get() {
        $duplicates = $this->get_all_duplicates();
        foreach ($duplicates as $duplicate) {
            $ids = $duplicate['ids'];
            $max_id = $this->compare_ids($ids);
            $this->update_tessere($ids, $max_id);
            $this->update_carriere($ids, $max_id);
            $this->delete_socio($ids, $max_id);
        }
        return $duplicates;
    }

    private function get_all_duplicates() {
        $query_duplicati = 'SELECT Nome, Cognome, GROUP_CONCAT( CONVERT( ID, CHAR ) ) AS IDs FROM  Socio GROUP BY Nome, Cognome HAVING COUNT( * ) >1';
        $stmt_duplicati = $this->db->prepare($query_duplicati);
        if (! $stmt_duplicati->execute()) {
            throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
        }
        $stmt_duplicati->bind_result($nome, $cognome, $ids);
        $res_duplicati = array();
        while ($stmt_duplicati->fetch()) {
            $res_duplicati[] = array('nome' => $nome, 'cognome' => $cognome, 'ids' => explode(',', $ids));
        }
        return $res_duplicati;
    }

    private function compare_ids($ids) {
        $max_id = intval($ids[0]);
        for ($i=1; $i < count($ids); $i++) { 
            if(intval($ids[$i]) > $max_id) {
                $max_id = intval($ids[$i]);
            }
        }
        return $max_id;
    }

    private function update_tessere($old_ids, $new_id) {
        $this->db->begin_transaction();
        $query_tessere = 'UPDATE Tessera SET Socio=? WHERE Socio=?';
        $stmt_tessera = $this->db->prepare($query_tessere);
        foreach ($old_ids as $old_id) {
            $id = intval($old_id);
            if($new_id != $id) {
                $stmt_tessera->bind_param('ii', $new_id, $id);
                if (! $stmt_tessera->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
            }
        }
        $this->db->commit();
    }

    private function update_carriere($old_ids, $new_id) {
        $this->db->begin_transaction();
        $query_carriere = 'UPDATE Carriera SET Socio=?, Attiva=0 WHERE Socio=?';
        $stmt_carriere = $this->db->prepare($query_carriere);
        foreach ($old_ids as $old_id) {
           $id = intval($old_id);
            if($new_id != $id) {
                $stmt_carriere->bind_param('ii', $new_id, $id);
                if (! $stmt_carriere->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
            }
        }
        $this->db->commit();
    }

    private function delete_socio($old_ids, $new_id) {
        $this->db->begin_transaction();
        $query_socio = 'DELETE FROM Socio WHERE ID=?';
        $stmt_socio = $this->db->prepare($query_socio);
        foreach ($old_ids as $old_id) {
           $id = intval($old_id);
            if($new_id != $id) {
                $stmt_socio->bind_param('i', $id);
                if (! $stmt_socio->execute()) {
                    $this->db->rollback();
                    throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
                }
            }
        }
        $this->db->commit();
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
    $temp = new RemoveDuplicate($db);
    $temp->dispatch();