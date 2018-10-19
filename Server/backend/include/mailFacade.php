<?php

require_once 'vendor/autoload.php';

if (!file_exists('is_iterable')) {
	function is_iterable($obj)
	{
		return is_array($obj) || $obj instanceof \Traversable;
	}
} 

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class MailFacade
{

    private $EMAIL_OPTIONS = array(
        'TITLE' => 'StudentIngegneria',
        'URL' => 'http://www.Studentingegneria.it',
        'FROM' => 'info@studentingegneria.it',
        'CHARSET_UTF8' => 'utf-8',
        'TYPE' => 'text/html',
        'MULTIPART_TYPE' => 'multipart/mixed',
    );

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
        $this->mailer->setFrom($this->EMAIL_OPTIONS['FROM'], $this->EMAIL_OPTIONS['TITLE']);
        $this->mailer->IsHTML(true);
        $this->mailer->CharSet = "UTF-8";
    }

    public function set_body($body)
    {
        $email_body = str_replace("\\", "", nl2br($body));
        $this->mailer->Body = $email_body;
    }

    public function add_attachments($attachments)
    {
        if (!is_iterable($attachments)) {
            throw new InvalidArgumentException();
        }
        foreach ($attachments as $file) {
            $this->mailer->addAttachment($file, basename($file));
        }
    }

    public function set_subject($subject)
    {
        $subject_tmp = str_replace("\\", "", $subject);
        $this->mailer->Subject = $subject_tmp;
    }

    public function send_one($to, $display_name = null)
    {
        if (is_null($display_name)) {
            $display_name = $to;
        }
        $this->mailer->addAddress($to, $display_name);
        $result = $this->mailer->send();
        $this->mailer->clearAddresses();
        return $result;
    }

    public function send_list($to_list)
    {
        $count_ok = 0;
        $count_nok = 0;
        foreach ($to_list as $user) {
            try {
                $this->mailer->addAddress($user);
                if ($this->mailer->send()) {
                    $count_ok = $count_ok + 1;
                } else {
                    $count_nok = $count_nok + 1;
                }
                $this->mailer->clearAddresses();
            } catch (Exception $e) {
                $count_nok = $count_nok + 1;
            }

        }
        return array('ok' => $count_ok, 'nok' => $count_nok);
    }
}
