import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const data = {
  "equipos": {
    "estrella": [
      { "nombre_completo": "Jonathan Xavier Aldana Anago", "cedula": "172426519-2", "numero_camiseta": 1 },
      { "nombre_completo": "Christian Andres Cabascango Cabascango", "cedula": "175479363-4", "numero_camiseta": 2 },
      { "nombre_completo": "José Vinicio Sánchez Rivadeneira", "cedula": "172099622-0", "numero_camiseta": 3 },
      { "nombre_completo": "Stalyn David Almeida Toapanta", "cedula": "172627853-2", "numero_camiseta": 5 },
      { "nombre_completo": "Danny Marcelo Tigasi Mendez", "cedula": "175007879-0", "numero_camiseta": 6 },
      { "nombre_completo": "Eduardo Javier Carrera Cabascango", "cedula": "175479126-3", "numero_camiseta": 7 },
      { "nombre_completo": "Diego Mauricio Quiña Coyago", "cedula": "171729988-5", "numero_camiseta": 8 },
      { "nombre_completo": "Juan David Carrera Cabascango", "cedula": "175277809-0", "numero_camiseta": 9 },
      { "nombre_completo": "Bagnner Angelo Estupiña Ortiz", "cedula": "092962350-2", "numero_camiseta": 11 },
      { "nombre_completo": "Emerson Joel Cabascango Tibanta", "cedula": "172819971-0", "numero_camiseta": 12 },
      { "nombre_completo": "Fernando Rigoberto Guayanay Sanmartin", "cedula": "220011111-6", "numero_camiseta": 13 },
      { "nombre_completo": "Bryan Gerardo Pumacuro Quinchimbla", "cedula": "175311188-7", "numero_camiseta": 14 },
      { "nombre_completo": "Camilo Fernando Simbaña Ruiz", "cedula": "172389968-6", "numero_camiseta": 15 },
      { "nombre_completo": "Luis Fernando Mediavilla Cabascango", "cedula": "172866852-4", "numero_camiseta": 16 },
      { "nombre_completo": "Jonathan Mateo Cabascango Cabascango", "cedula": "175277907-2", "numero_camiseta": 18 },
      { "nombre_completo": "Cristian Marcelo Carrera Cabascango", "cedula": "175277805-8", "numero_camiseta": 19 },
      { "nombre_completo": "Alexander David Guambi Cabascango", "cedula": "171950704-0", "numero_camiseta": 20 },
      { "nombre_completo": "Carlos Manuel Collaguazo Tusa", "cedula": "172719276-5", "numero_camiseta": 21 },
      { "nombre_completo": "Guido Daniel Quiña Coyago", "cedula": "172162616-4", "numero_camiseta": 25 },
      { "nombre_completo": "Luis Armando Quiña Simbaña", "cedula": "172175260-6", "numero_camiseta": 28 },
      { "nombre_completo": "Kevin Alexander Aldana Anago", "cedula": "175302752-1", "numero_camiseta": 30 },
      { "nombre_completo": "Juan Diego Romero Perez", "cedula": "172106250-1", "numero_camiseta": 80 },
      { "nombre_completo": "Freddi Danilo Quiña Coyago", "cedula": "171596796-2", "numero_camiseta": 99 }
    ],
    "inter": [
      { "nombre_completo": "Azaña Cabascango Cristian Ricardo", "cedula": "1722596770", "numero_camiseta": 1 },
      { "nombre_completo": "Azaña Cabascango Alex Ivan", "cedula": "1726664137", "numero_camiseta": 2 },
      { "nombre_completo": "Yambay Cuichan Lenin Steve", "cedula": "1727896928", "numero_camiseta": 3 },
      { "nombre_completo": "Vizcaino Vizcaino Manuel Alejandro", "cedula": "245498908", "numero_camiseta": 4 },
      { "nombre_completo": "Condor Pumacuro Adolfo Alejandro", "cedula": "1722223390", "numero_camiseta": 5 },
      { "nombre_completo": "Cabascango Guambi Luis Rodolfo", "cedula": "1714881867", "numero_camiseta": 6 },
      { "nombre_completo": "Lomas Mites Sebastián Alexis", "cedula": "1751412881", "numero_camiseta": 7 },
      { "nombre_completo": "Cabascango Guambi Franklin Alonso", "cedula": "1722344239", "numero_camiseta": 8 },
      { "nombre_completo": "Quiña Toapanta Segundo Belisario", "cedula": "1727525626", "numero_camiseta": 9 },
      { "nombre_completo": "Cabascango Lomas Luis Felipe", "cedula": "1751464528", "numero_camiseta": 10 },
      { "nombre_completo": "Flores barrera Jaime Alfonso", "cedula": "1750051573", "numero_camiseta": 11 },
      { "nombre_completo": "Taipe Perez Diego Ivan", "cedula": "1717172736", "numero_camiseta": 12 },
      { "nombre_completo": "Chitupanta Tipantuña Juan Alexis", "cedula": "0504172172", "numero_camiseta": 13 },
      { "nombre_completo": "Haro Haro William Santiago", "cedula": "1720070141", "numero_camiseta": 14 },
      { "nombre_completo": "Escorza Escobar Carlos Julio", "cedula": "1719984261", "numero_camiseta": 15 },
      { "nombre_completo": "Avila Torres Danny Javier", "cedula": "1311240848", "numero_camiseta": 18 },
      { "nombre_completo": "Yasig Sangovalin Daniel Fabricio", "cedula": "1754349429", "numero_camiseta": 19 },
      { "nombre_completo": "Yambay Cuichan Eduardo Fabricio", "cedula": "1727144527", "numero_camiseta": 21 },
      { "nombre_completo": "Salas Villareal Jeferson Rolando", "cedula": "1723224521", "numero_camiseta": 22 },
      { "nombre_completo": "Guaña Simbaña Carlos Armando", "cedula": "1726337291", "numero_camiseta": 25 },
      { "nombre_completo": "Castillo Espinoza Nestor Eduardo", "cedula": "1728106533", "numero_camiseta": 26 },
      { "nombre_completo": "Quilumba Cabascango Segundo Hilario", "cedula": "1714002548", "numero_camiseta": 31 },
      { "nombre_completo": "Salas Villareal Luis David", "cedula": "1723224547", "numero_camiseta": 39 },
      { "nombre_completo": "Lomas Quiña Martin Emilio", "cedula": "1754925665", "numero_camiseta": 50 },
      { "nombre_completo": "Taipe Cabascango Diego Alexander", "cedula": "1751784065", "numero_camiseta": 60 },
      { "nombre_completo": "Sandoval Romero Mateo Sebastian", "cedula": "1720432158", "numero_camiseta": 67 },
      { "nombre_completo": "Escorza Escobar Alexis Paul", "cedula": "1753680220", "numero_camiseta": 70 },
      { "nombre_completo": "Ayala Maldonado Michael Javier", "cedula": "1722066782", "numero_camiseta": 71 },
      { "nombre_completo": "Iza Ruiz Jose Daniel", "cedula": "1726204611", "numero_camiseta": 88 },
      { "nombre_completo": "Bazaran Alvarado Diego Rodrigo", "cedula": "092717363", "numero_camiseta": null }
    ],
    "barcelona": [
      { "nombre_completo": "EDISON ALEXANDER CUTI QUILUMBA", "cedula": "1750992354", "numero_camiseta": 2 },
      { "nombre_completo": "HENRY DAVID QUILUMBA TOAPANTA", "cedula": "1720758224", "numero_camiseta": 3 },
      { "nombre_completo": "SEGUNDO MANUEL TOAPANTA ANAGO", "cedula": "1721483087", "numero_camiseta": 6 },
      { "nombre_completo": "FREDDY OSWALDO CUJÍ MULLO", "cedula": "1724384902", "numero_camiseta": 7 },
      { "nombre_completo": "LUIS JAVIER TOAPANTA ANAGO", "cedula": "1722952411", "numero_camiseta": 8 },
      { "nombre_completo": "JONATHAN ANDRÉS ULLAURI VERGARA", "cedula": "1723206825", "numero_camiseta": 9 },
      { "nombre_completo": "KEVIN ANDERSON PAVÓN TOAPANTA", "cedula": "1750973776", "numero_camiseta": 10 },
      { "nombre_completo": "ROBERTO RAFAEL TOAPANTA ANAGO", "cedula": "1715518674", "numero_camiseta": 11 },
      { "nombre_completo": "PAUL ALEJANDRO GUAMBI QUILUMBA", "cedula": "1722954425", "numero_camiseta": 12 },
      { "nombre_completo": "JEFFERSON PAUL CHUNTA TOAPANTA", "cedula": "1725664898", "numero_camiseta": 13 },
      { "nombre_completo": "ALEXANDER DAVID COLLAGUAZO GARCÍA", "cedula": "1753505377", "numero_camiseta": 14 },
      { "nombre_completo": "DANIEL ESTEBAN MOLINA SANDOVAL", "cedula": "1727207944", "numero_camiseta": 15 },
      { "nombre_completo": "BRYAN RICARDO SANCHEZ MONTALVO", "cedula": "1721848214", "numero_camiseta": 16 },
      { "nombre_completo": "CARLOS AUGUSTO TOAPANTA ANAGO", "cedula": "1720061561", "numero_camiseta": 17 },
      { "nombre_completo": "DILAN JOSUE TABANGO TOAPANTA", "cedula": "1728304880", "numero_camiseta": 19 },
      { "nombre_completo": "JHEYSON MEDARDO CHALA ARCE", "cedula": "1751093046", "numero_camiseta": 20 },
      { "nombre_completo": "WALTER DANIEL TELLO AYALA", "cedula": "1715753131", "numero_camiseta": 21 },
      { "nombre_completo": "LUIS STALIN CHANGOLUISA NAULA", "cedula": "1750416610", "numero_camiseta": 22 },
      { "nombre_completo": "ESTEBAN ANDRES MINA SALAS", "cedula": "1728541119", "numero_camiseta": 24 },
      { "nombre_completo": "KEVIN FABRICIO BAQUERO CALPA", "cedula": "1725041931", "numero_camiseta": 25 },
      { "nombre_completo": "ESTEBAN BENJAMIN TOAPANTA VEGA", "cedula": "1751689223", "numero_camiseta": 30 },
      { "nombre_completo": "LUIS SANTIAGO TORRES GUAÑA", "cedula": "1722597968", "numero_camiseta": 32 },
      { "nombre_completo": "EDISON JAVIER CUTI VILAÑA", "cedula": "1719351106", "numero_camiseta": 34 },
      { "nombre_completo": "RAFAEL DAVID TOAPANTA SANDOVAL", "cedula": "1727207936", "numero_camiseta": 50 },
      { "nombre_completo": "LUIS ADOLFO QUILUMBA TOAPANTA", "cedula": "1719507186", "numero_camiseta": 66 },
      { "nombre_completo": "DARLIN STALIN REINOSO CHALA", "cedula": "17500150540", "numero_camiseta": 99 }
    ],
    "real_madrid": [
      { "nombre_completo": "LUIS ALFREDO AZAÑA TOAPANTA", "cedula": "172259441-1", "numero_camiseta": 6 },
      { "nombre_completo": "BURNEO TOAPANTA JAIRO JOEL", "cedula": "175287040-0", "numero_camiseta": 10 },
      { "nombre_completo": "CAJAMARCA VERGARA JEAN CARLOS", "cedula": "175135432-3", "numero_camiseta": 4 },
      { "nombre_completo": "CARVAJAL LEDESMA DILAN ISRAEL", "cedula": "172790737-8", "numero_camiseta": 30 },
      { "nombre_completo": "ALEXANDER DUVAN ANGULO VARDALES", "cedula": "080370045-9", "numero_camiseta": 99 },
      { "nombre_completo": "DUARTE CHUQUIMARCA MARCO FABIAN", "cedula": "172019322-4", "numero_camiseta": 75 },
      { "nombre_completo": "GUAGALANGO TOAPANTA MIRCO DARÍO", "cedula": "172649363-6", "numero_camiseta": 8 },
      { "nombre_completo": "PÉREZ GUAGALANGO DIEGO ANTONIO", "cedula": "175398937-3", "numero_camiseta": 9 },
      { "nombre_completo": "PUMACURO CABASCANGO NELSON GABRIEL", "cedula": "172036816-4", "numero_camiseta": 20 },
      { "nombre_completo": "PUMACURO TOAPANTA MATEO ARIEL", "cedula": "175203201-9", "numero_camiseta": 15 },
      { "nombre_completo": "PUMACURO TOAPANTA ERICK ISMAEL", "cedula": "172798506-9", "numero_camiseta": 11 },
      { "nombre_completo": "QUILUMBA TOAPANTA OMAR DANILO", "cedula": "175263774-2", "numero_camiseta": 14 },
      { "nombre_completo": "TOAPANTA ABAD ALEXANDER ROBERTO", "cedula": "175430276-6", "numero_camiseta": 18 },
      { "nombre_completo": "TOAPANTA ABAD JOSER BRYAN", "cedula": "172857317-9", "numero_camiseta": 29 },
      { "nombre_completo": "TOAPANTA ABAD LUIS MIGUEL", "cedula": "175287020-2", "numero_camiseta": 27 },
      { "nombre_completo": "TOAPANTA ABAD WASHINGTON ARMANDO", "cedula": "175103020-4", "numero_camiseta": 28 },
      { "nombre_completo": "TOAPANTA ABAD KEVIN ADRIÁN", "cedula": "175031915-2", "numero_camiseta": 25 },
      { "nombre_completo": "TOAPANTA ABAD ERICK JOEL", "cedula": "175427137-5", "numero_camiseta": 5 },
      { "nombre_completo": "TOAPANTA COYAGO JHONY DAVID", "cedula": "172322189-9", "numero_camiseta": 19 },
      { "nombre_completo": "ULCO CABASCANGO VICTOR ALFONSO", "cedula": "171543959-0", "numero_camiseta": 16 },
      { "nombre_completo": "VALENCIA QUIÑONEZ JEAN PIER", "cedula": "220037436-7", "numero_camiseta": 13 },
      { "nombre_completo": "VALENCIA QUIÑONEZ ANDERSON JOEL", "cedula": "220037434-2", "numero_camiseta": 22 },
      { "nombre_completo": "MARLON FABIAN DUARTE TOAPANTA", "cedula": "172828015-5", "numero_camiseta": 7 },
      { "nombre_completo": "JAIRO VINICIO CASAGUALPA CAIZA", "cedula": "175122872-6", "numero_camiseta": 3 },
      { "nombre_completo": "GEOAVANNY RAMIRO VEGA CORREA", "cedula": "171779280-6", "numero_camiseta": 45 },
      { "nombre_completo": "JORGE SANTIAGO TOAPANTA MEJIA", "cedula": "172322130-3", "numero_camiseta": 40 },
      { "nombre_completo": "ALAN SEBASTIAN HERRERA DUMES", "cedula": "094366487-0", "numero_camiseta": 35 },
      { "nombre_completo": "OSCAR ANIBAL CONDOR CABACANGO", "cedula": "175432963-7", "numero_camiseta": 33 },
      { "nombre_completo": "MARCO DANIEL TIGASI VEGA", "cedula": "175092051-2", "numero_camiseta": 21 },
      { "nombre_completo": "KLEVER MAURICIO TOAPANTA ESPINOSA", "cedula": "171569119-0", "numero_camiseta": null },
      { "nombre_completo": "SALAS VIZCARRA MATEO JOSHUA", "cedula": "175578868-4", "numero_camiseta": 10 }
    ],
    "danubio": [
      { "nombre_completo": "Rafael Alberto Toapanta Viracocha", "cedula": "171607087-3", "numero_camiseta": 2 },
      { "nombre_completo": "Luis Geovanny Toapanta Viracocha", "cedula": "171939395-9", "numero_camiseta": 3 },
      { "nombre_completo": "Rolando Valdemar Cabascango", "cedula": "171475906-3", "numero_camiseta": 4 },
      { "nombre_completo": "Luis Enriques Lopez Conde", "cedula": "172675057-1", "numero_camiseta": 5 },
      { "nombre_completo": "Jonathan Daniel Cóndor Toapanta", "cedula": "172234606-9", "numero_camiseta": 7 },
      { "nombre_completo": "Brayan Santiago Escobar Toapanta", "cedula": "172502256-8", "numero_camiseta": 8 },
      { "nombre_completo": "Edison Fabian González Luje", "cedula": "172615929-4", "numero_camiseta": 10 },
      { "nombre_completo": "Marlon Aldair Escobar Toapanta", "cedula": "175049427-8", "numero_camiseta": 11 },
      { "nombre_completo": "Ruben Dario Lopez Espinel", "cedula": "172554337-3", "numero_camiseta": 12 },
      { "nombre_completo": "Nixon Leonel Nieves Vera", "cedula": "171947781-0", "numero_camiseta": 13 },
      { "nombre_completo": "Styven Leonel Cóndor Toapanta", "cedula": "175407273-2", "numero_camiseta": 14 },
      { "nombre_completo": "Jaime Mauricio Grefa Guatatoca", "cedula": "160082345-2", "numero_camiseta": 16 },
      { "nombre_completo": "Luis Hernan Pilaquinga Escobar", "cedula": "171998699-2", "numero_camiseta": 17 },
      { "nombre_completo": "Maycol Anthony Lara Arrieta", "cedula": "120766562-9", "numero_camiseta": 18 },
      { "nombre_completo": "Cristhian Rodrigo Betancourt Simbaña", "cedula": "172421924-9", "numero_camiseta": 19 },
      { "nombre_completo": "Juan Orlando Villa Troya", "cedula": "100338325-2", "numero_camiseta": 20 },
      { "nombre_completo": "Amable Rafael Cedeño Cruel", "cedula": "120382823-9", "numero_camiseta": 21 },
      { "nombre_completo": "Jorge Luis Cabascango Vinueza", "cedula": "172414941-2", "numero_camiseta": 22 },
      { "nombre_completo": "Edison Omar Pilaquinga Escobar", "cedula": "171998707-3", "numero_camiseta": 45 },
      { "nombre_completo": "Dario Jose Simbaña Quiña", "cedula": "172669047-0", "numero_camiseta": 25 },
      { "nombre_completo": "Jorge Gudiño Gudiño", "cedula": "175021739-8", "numero_camiseta": 31 },
      { "nombre_completo": "Anderson David Riera Tingo", "cedula": "172469035-7", "numero_camiseta": 38 },
      { "nombre_completo": "Anthony Danilo Suarez Tandazo", "cedula": "175349171-9", "numero_camiseta": 50 },
      { "nombre_completo": "Luis Alexander Pilaquinga Tonato", "cedula": "175384042-8", "numero_camiseta": 52 },
      { "nombre_completo": "Shaid Alexander Garcia Erazo", "cedula": "172904311-5", "numero_camiseta": 77 },
      { "nombre_completo": "Segundo Hilario Quilumba Cabascango", "cedula": "1714002548-8", "numero_camiseta": 9 },
      { "nombre_completo": "Jireh Raul Cedeño Montaño", "cedula": "172650027-3", "numero_camiseta": 24 },
      { "nombre_completo": "Diego Rodrigo Bazaran Alvarado", "cedula": "092717363-3", "numero_camiseta": 15 }
    ],
    "san_jose": [
      { "nombre_completo": "ELVIS SANTIAGO AZAÑA QUILUMBA", "cedula": "1723020580", "numero_camiseta": 3 },
      { "nombre_completo": "RICARDO JAVIER ULQUIANGO COLLAGUAZO", "cedula": "1716766413", "numero_camiseta": 35 },
      { "nombre_completo": "LUIS IGNACIO ANAGO CONDOR", "cedula": "1752803401", "numero_camiseta": 50 },
      { "nombre_completo": "JAMES DEARLEY QUINTERO MEJIA", "cedula": "0804086908", "numero_camiseta": 15 },
      { "nombre_completo": "JHONNY MAURICIO HERRERA ERASO", "cedula": "1726697251", "numero_camiseta": 6 },
      { "nombre_completo": "JORGE HUMBERTO CRUZ ESTUPIÑAN", "cedula": "1723043343", "numero_camiseta": 1 },
      { "nombre_completo": "EMERSON STEVEN CONDOR AZAÑA", "cedula": "1723676381", "numero_camiseta": 30 },
      { "nombre_completo": "SEGUNDO CARLOS GUALOTO BONILLA", "cedula": "1719169110", "numero_camiseta": 29 },
      { "nombre_completo": "LUIS MATEO REYNA QUINTERO", "cedula": "1752796746", "numero_camiseta": 25 },
      { "nombre_completo": "GIXON MANUEL MARQUEZ TELLO", "cedula": "0850487216", "numero_camiseta": 43 },
      { "nombre_completo": "FREDY FABIAN CONDOR COLLAGUAZO", "cedula": "1721165148", "numero_camiseta": 77 },
      { "nombre_completo": "CRISTIAN ISRAEL SIGCHA SANCHEZ", "cedula": "1722905181", "numero_camiseta": 24 },
      { "nombre_completo": "MIGUEL ALEJANDRO QUINTERO VEGA", "cedula": "1752577096", "numero_camiseta": 4 },
      { "nombre_completo": "JEFFERSON ANDRES CANDO CHICAIZA", "cedula": "1721058129", "numero_camiseta": 130 },
      { "nombre_completo": "RUBEN ALEJANDRO CHICAIZA AZAÑA", "cedula": "1753485702", "numero_camiseta": 21 },
      { "nombre_completo": "JAIRO DAVID AZAÑA MENA", "cedula": "1717815920", "numero_camiseta": 99 },
      { "nombre_completo": "JUAN ENRIQUE SIMBAÑA SAGUANO", "cedula": "1752366763", "numero_camiseta": 17 },
      { "nombre_completo": "MIGUEL ANGEL VEGA QUINTERO", "cedula": "1752577179", "numero_camiseta": 5 },
      { "nombre_completo": "HUGO VALENTIN JAMA NEVAREZ", "cedula": "0803648104", "numero_camiseta": 23 },
      { "nombre_completo": "MATIAS SEBASTIAN CABASCANGO CHOLANGO", "cedula": "1752444636", "numero_camiseta": 8 },
      { "nombre_completo": "MARIO EDISON CORTES MALDONADO", "cedula": "1721257390", "numero_camiseta": 7 },
      { "nombre_completo": "MIGUEL ANGEL SIMBAÑA VILAÑA", "cedula": "1719962092", "numero_camiseta": 14 },
      { "nombre_completo": "IVAN RAUL QUINTERO ALVARADO", "cedula": "0802109322", "numero_camiseta": 121 }
    ],
    "milan": [
      { "nombre_completo": "Jonathan Espinosa Qiña", "cedula": "1721480687", "numero_camiseta": 2 },
      { "nombre_completo": "Rafael Rodrigo Velasco Guaña", "cedula": "1716786767", "numero_camiseta": 4 },
      { "nombre_completo": "Bryan Xavier Tenorio Jumbo", "cedula": "1719159327", "numero_camiseta": 5 },
      { "nombre_completo": "Vinicio Javier Azaña Cabascango", "cedula": "1726664145", "numero_camiseta": 8 },
      { "nombre_completo": "Joel Alejandro Quishpe Quijosaca", "cedula": "1750325225", "numero_camiseta": 11 },
      { "nombre_completo": "Rolando Vinicio Vilaña Cabascango", "cedula": "1720752136", "numero_camiseta": 14 },
      { "nombre_completo": "Jhoel Sebastian Collaguazo Quiña", "cedula": "1722048509", "numero_camiseta": 15 },
      { "nombre_completo": "Diego Alejandro Vera Palacios", "cedula": "1317694477", "numero_camiseta": 20 },
      { "nombre_completo": "Maycol Anthony Quishpe Quijosaca", "cedula": "1750325191", "numero_camiseta": 22 },
      { "nombre_completo": "Alex Sebastian Tenorio Vilaña", "cedula": "1723679195", "numero_camiseta": 33 },
      { "nombre_completo": "Bryan Eduardo Zambrano Salvarria", "cedula": "1750845404", "numero_camiseta": 36 },
      { "nombre_completo": "Mateo Jose Alquinga Toapanta", "cedula": "1751429265", "numero_camiseta": 27 },
      { "nombre_completo": "Henry Alexander Lozada Sevilla", "cedula": "1050010238", "numero_camiseta": 28 },
      { "nombre_completo": "Jonathan Xavier Nazareno Remirez", "cedula": "1725997884", "numero_camiseta": 49 },
      { "nombre_completo": "Francisco Javier Sabando Medina", "cedula": "1750120022", "numero_camiseta": 18 },
      { "nombre_completo": "Jhoel Fabricio Guzman Guambi", "cedula": "1754524724", "numero_camiseta": 10 },
      { "nombre_completo": "Brayan Omar Sampredo Albuja", "cedula": "17508899104", "numero_camiseta": 47 },
      { "nombre_completo": "Juan Carlos Guambi Ushiña", "cedula": "1719051201", "numero_camiseta": 39 },
      { "nombre_completo": "Ismael Roodsman Lozada Sevilla", "cedula": "1751169356", "numero_camiseta": 53 },
      { "nombre_completo": "Fredy Jose Velasco Rivera", "cedula": "2100047238", "numero_camiseta": 43 },
      { "nombre_completo": "Frank David Aguilar Garcia", "cedula": "1753476165", "numero_camiseta": 37 },
      { "nombre_completo": "Segundo Gonzalo Alomoto Juina", "cedula": "1709681207", "numero_camiseta": 3 },
      { "nombre_completo": "Segunado Vidal Collaguaso Ulco", "cedula": "1711426583", "numero_camiseta": 7 },
      { "nombre_completo": "Frankiln Efrain Vilaña Llano", "cedula": "1714687488", "numero_camiseta": 9 },
      { "nombre_completo": "Amado Xavier Tenorio Guambi", "cedula": "1712595873", "numero_camiseta": 13 },
      { "nombre_completo": "Diego German Ulco Cabascango", "cedula": "1712696556", "numero_camiseta": 49 },
      { "nombre_completo": "Segundo Fabian Guambi Ulco", "cedula": "1712794195", "numero_camiseta": 23 }
    ]
  }
};

function splitName(fullName: string) {
  const words = fullName.trim().split(/\s+/);
  if (words.length <= 2) {
    return { firstName: words[0] || "", lastName: words.slice(1).join(" ") || "" };
  }
  // Try to take 2 for names, rest for surnames as requested (2 names / 2 surnames)
  return {
    firstName: words.slice(0, 2).join(" "),
    lastName: words.slice(2).join(" ")
  };
}

async function main() {
  console.log('--- Starting tournament seed ---');

  try {
    // 1. Create Headquarters
    console.log('Creating Headquarters: Collaqui...');
    const hq = await prisma.headquarters.create({
      data: { name: 'Collaqui', city: 'Pichincha', address: 'Collaqui' }
    });

    // 2. Create Tournament
    console.log('Creating Tournament: Torneo Relámpago...');
    const tournament = await prisma.tournament.create({
      data: { 
        name: 'Torneo Relámpago', 
        headquartersId: hq.id 
      }
    });

    // 3. Create Categories
    console.log('Creating Categories: A and B...');
    const catA = await prisma.category.create({ data: { name: 'Categoría A' } });
    const catB = await prisma.category.create({ data: { name: 'Categoría B' } });

    // 4. Create Teams and Players for Category A
    for (const [teamKey, players] of Object.entries(data.equipos)) {
      const teamName = teamKey.charAt(0).toUpperCase() + teamKey.slice(1).replace('_', ' ');
      console.log(`Creating team: ${teamName}...`);
      
      const team = await prisma.team.create({
        data: {
          name: teamName,
          tournamentId: tournament.id,
          categoryId: catA.id,
          foundedYear: 2024
        }
      });

      console.log(`Adding ${players.length} players to ${teamName}...`);
      for (const p of players) {
        const { firstName, lastName } = splitName(p.nombre_completo);
        const number = p.numero_camiseta === null ? 0 : Number(p.numero_camiseta);
        
        // Handle potential duplicate DNI issues by checking or try-catching
        try {
            await prisma.player.create({
              data: {
                firstName,
                lastName,
                dni: p.cedula,
                number: number,
                teamId: team.id
              }
            });
        } catch (e) {
            console.warn(`Warning: Could not add player ${p.nombre_completo} (DNI ${p.cedula}). It might be a duplicate.`);
        }
      }
    }

    console.log('--- Seed completed successfully ---');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
