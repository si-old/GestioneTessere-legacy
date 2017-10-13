<?php

function fetch_results($stmt){
    $array = array();
    
    $data = array();
    $meta = $stmt->result_metadata();
    
    $variables = array();    
    while($field = $meta->fetch_field())
        $variables[] = &$data[$field->name]; // pass by reference
    
    call_user_func_array(array($stmt, 'bind_result'), $variables);
    
    $i=0;
    while($stmt->fetch())
    {
        $array[$i] = array();
        foreach($data as $k => $v)
            $array[$i][$k] = $v;
        $i++;
    }
    
    return $array;
}

?>