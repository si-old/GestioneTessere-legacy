<?php

require_once('include/include.php');

use \setasign\Fpdi\Fpdi;

$query = "SELECT t.Numero as t_numero, te.Anno as te_anno, ca.Studente as ca_studente,
                ca.Professione as ca_professione, ca.Matricola as ca_matricola,
                c.Nome as c_nome, st.Nome as st_nome, st.Cognome as st_cognome, 
                st.Email as st_email, st.Cellulare as st_cellulare,
                st.Quota as st_quota, DATE_FORMAT(st.Data, '%d/%m/%Y') as st_data
            FROM Statino as st JOIN Tessera as t on st.Tessera = t.ID
                               JOIN Tesseramento as te on t.Anno = te.ID
                               JOIN Carriera as ca on st.Carriera = ca.ID
                               JOIN Corso as c on ca.Corso = c.ID";

if(isset($_GET['id']) && strlen($_GET['id']) > 0){
    $query = $query.' WHERE st.ID = ?';
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $_GET['id']);
}else{
    $stmt = $db->prepare($query);
}

$stmt->execute();

$res = fetch_results($stmt);

$pdf = new Fpdi();

foreach ($res as $statino){
    $pdf->AddPage();
    $pdf->setSourceFile("res/template_statino.pdf");
    $tplIdx = $pdf->importPage(1);
    $pdf->useTemplate($tplIdx, ['adjustPageSize' => true]);
    $pdf->SetFont('Helvetica');
    
    $pdf->SetXY(31, 26); // tutte i numeri sono mm a partire dall'angolo in alto a sinistra
    $pdf->Write(0, $statino['t_numero']);

    $pdf->SetXY(45, 33);
    $pdf->Write(0, $statino['te_anno']);

    if($statino['ca_studente']){
        $pdf->SetXY(13, 41);
        $pdf->Write(0, 'x');

        $pdf->SetXY(45, 40);
        $pdf->Write(0, $statino['c_nome']);

        $pdf->SetXY(30, 65);
        $pdf->Write(0, $statino['ca_matricola']);
    }else{
        $pdf->SetXY(13, 47);
        $pdf->Write(0, 'x');

        $pdf->SetXY(55, 46);
        $pdf->Write(0, $statino['ca_professione']);
    }
    
    $pdf->SetXY(34, 57);
    $pdf->Write(0, $statino['st_nome']);

    $pdf->SetXY(82, 57);
    $pdf->Write(0, $statino['st_cognome']);

    $pdf->SetXY(25, 79);
    $pdf->Write(0, $statino['st_email']);

    $pdf->SetXY(28, 72);
    $pdf->Write(0, $statino['st_cellulare']);

    $pdf->SetXY(85, 118);
    $pdf->Write(0, $statino['st_quota']);

    $pdf->SetXY(26, 140);
    $pdf->Write(0, $statino['st_data']);
    
}

$pdf->Output();            
