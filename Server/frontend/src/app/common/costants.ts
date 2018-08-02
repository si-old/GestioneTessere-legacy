
import { environment } from '../../environments/environment';

// matricola: 9 cifre, con uno zero opzionale all'inizio
export const PATTERN_MATRICOLA: string = "0?\\d{9}";

// cellulare: eventualmente codice +ddd con eventualmente uno spazio e dieci cifre attaccate
export const PATTERN_CELLULARE: string = "(\\+\\d{2,3})? ?\\d{10}";

// numero tessera: un numero arbitrario di cifre, almeno una, con eventualmente un meno all'inizio
export const PATTERN_NUMERO_TESSERA: string = "-?\\d+";

// anno: 4 cifre con eventualente uno slash e altre 2 o 4 cifre
//  (tecnicamente anche tre, solo 2 o 4 preciso è più complicato, mi scoccio)
export const PATTERN_ANNO_TESSERAMENTO: string = "\\d{4}((\\\\|\\/)\\d{2,4})?";

// password: almeno 6 caratteri, tutto tranne spazi e affini
export const PATTERN_PASSWORD: string = "[\\S]{6,}";

// user: almeno 3 tra caratteri e cifre
export const PATTERN_USER: string = "[\\S]{3,}";

// options object for every http request
export const HTTP_GLOBAL_OPTIONS = { withCredentials: true };

// url del backend a seconda dell'environment, contiene lo slash finale
export const BACKEND_SERVER = environment.backend;

// app version number
export const VERSION = environment.version