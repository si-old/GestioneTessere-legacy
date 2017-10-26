<?php

function fetch_results($stmt)
{
    $array = array();
    
    $data = array();
    $meta = $stmt->result_metadata();
    
    $variables = array();
    while ($field = $meta->fetch_field()) {
        $variables[] = &$data[$field->name]; // pass by reference
    }
    
    call_user_func_array(array($stmt, 'bind_result'), $variables);
    
    $i=0;
    while ($stmt->fetch()) {
        $array[$i] = array();
        foreach ($data as $k => $v) {
            $array[$i][$k] = $v;
        }
        $i++;
    }
    
    return $array;
}

function has_string_keys(array $array) {
    return count(array_filter(array_keys($array), 'is_string')) > 0;
}

function array_keys_recursive($input, $prefix = '')
{
    $output = [];
    foreach($input as $key => $val){
        if(is_array($val)){
            if(has_string_keys($val)){
                $output = array_merge($output, array_keys_recursive($val, $prefix.$key.'_'));
            }elseif(count($val) > 0){
                $output = array_merge($output, array_keys_recursive($val[0], $prefix.$key.'_'));
            }
        }else{
            array_push($output, $prefix.$key);
        }
    }
    return $output;
}
