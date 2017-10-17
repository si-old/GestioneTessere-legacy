<?php

	class Session{

		function __construct(){
			this->isAdmin = "isAdmin";
			this->time = "time";
			this->duration = 20 * 60 * 1000;
		}

		// inizializza la sessione
		void create(boolean isAdmin) {
			$_SESSION[this->isAdmin] = isAdmin;
			$_SESSION[this->time] = time();
		}

		// distrugge la sessione
		void destroy() {
			session_unset();
			session_destroy();
		}

		//true se l'utente loggato è admin
		boolean isAdmin() {
			return $_SESSION[this->isAdmin];
		}

		// true se l'utente è loggato
		boolean isLogged() {
		}

		//true se la sessione non è scaduta. Se è OK fa il refresh e riparte da 0, altrimenti distrugge la sessione
		boolean isValid() {
			new_time = time();
			old_time = $_SESSION[this->time];
			if (old_time && (new_time - old_time) > this->duration) {
				this->destroy();
				return false;
			} else {
				$_SESSION[this->time] = new_time;
				return true;
			}
		}

	}

?>