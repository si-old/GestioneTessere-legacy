<?php

  require_once('include/config.php');
	require_once('include/lib.php');
	
	class Socio extends RESTItem{
		
		protected function do_get($data){
			$flag_id = isset($_GET['id']);
      $query = 'SELECT s.id as id, s.nome as nome, s.cognome as cognome, s.email as email, s.cellulare as cellulare
                       s.studente as studente, s.professione as professione, s.facebook as facebook,
                       m.matricola as matricola, c.nome as cdl
                FROM Socio as s LEFT JOIN carriera as m ON s.id = m.socio 
                                JOIN CdL as c ON c.id = m.cdl
                WHERE m.attiva = true';
			if($flag_id){
        $query = $query.' AND s.id = ?';
				$stmt = $this->db->prepare($query);
				$stmt->bind_param('i', $_GET['id']);
			}else{
				$stmt = $this->db->prepare($query);
			}
			$stmt->execute();
			$stmt->bind_result($id, $nome, $cognome, $email, $cellulare, $studente, $professione, $facebook, $matricola, $cdl);
			$res = array();
			$i = 0;
			while($stmt->fetch()){
				$res[$i] = array('id' => $id, 'nome' => $nome, 'cognome' => $cognome, 'email' => $email,
                        'cellulare' => $cellulare, 'studente' => $studente, 'professione' => $professione, 'facebook' => $facebook, 
                         'matricola' => $matricola, 'cdl' => $cdl);
        $i++;
			}
			//se abbiamo id, c'è un solo elemento, mandiamo solo quello
			if($flag_id){
				echo json_encode($res[0]);
			}else{
				echo json_encode($res);
			}
		}
		
		protected function do_post($data){
      //TODO inserimento utenti, controlli su integrità vincoli
			//$data = $this->get_body();
			//$valid = isset($data['nome']);
			//if($valid){
				//dovremmo controllare se il nome c'è già?
				//$stmt = $this->db->prepare('INSERT INTO CdL (Nome) VALUES (?)');
				//$stmt->bind_param('s', $data['nome']);
				//echo json_encode($stmt->execute());
			//}else{
				echo json_encode(RESTItem::$ERROR_NODATA);
			//}
		}
		
		protected function do_del($data){
			if(isset($data['id'])){
        $this->db->begin_transaction();
				$stmt = $this->db->prepare('DELETE FROM Socio WHERE ID=?');
				$stmt->bind_param('i', $data['id']);
        $stmt->execute();
        $stmt = $this->db->prepare('DELETE FROM Carriera WHERE Socio=?');
				$stmt->bind_param('i', $data['id']);
        $stmt->execute();
				echo json_encode($this->db->commit());
			}else{
				echo json_encode(RESTItem::$ERROR_NODATA);
			}
		}
	}
	
	$temp = new Socio($db);
	$temp->dispatch();
?>
