// assets/js/websockettester.js

// initialize global variables

var KEY_SERVER_URI = "ws://localhost:8888";
var connection;
//party completa que se enviará
var allCharacters = {
    "party": [],
    "enemies": [],

}


$(document).ready(function() {

    //OJO Pongo aquí lo de los sonidos porque depende de Jquery y no entiendo bien aún como funca. 
    $.ionSound({
            sounds: [
                "beer_can_opening",
                "bell_ring",
            ],
            path: "assets/sounds/",
            multiPlay: true,
            volume: "1.0"
        });

        $("#attack").on("click", function(){
            $.ionSound.play("bell_ring");
        });


    // load the saved serverURI into the serveruri input
    var server = localStorage.getItem(KEY_SERVER_URI);
    $("#serveruri").val(server);


    // Funcion que inicia la conexion al hacer click en el boton
    $("#connect").on("click", function(e) {
        var server = $("#serveruri").val();
        // crear conexion
        connection = new WebSocket(server);
        console.log("clicked connect");
        // save the current serveruri so we don't have to type it all the time
        localStorage.setItem(KEY_SERVER_URI, server);
        window.connection;
        connection.onopen = function() {
            /*Send a small message to the console once the connection is established */
            console.log('Connection open!');
        }
        e.preventDefault();
    });

    //carga arrays con los valores iniciales con la funcion de 'functions.js'
    loadStartingArrays(allCharacters);


    // funcion para seleccionar personaje que ataca (solo permite uno)
    $('.player').on('click', function() {
        if ($('#party').find('.selected').length == 0) {
            $.ionSound.play("beer_can_opening");
            $(this).toggleClass('selected');
        } else if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
    });

    // funcion para seleccionar enemigo (solo permite uno)
    $('.minion').on('click', function() {
        if ($('#minions').find('.selected').length == 0) {
            $.ionSound.play("beer_can_opening");
            if ($(this).hasClass('unselectable') == false){
                $(this).toggleClass('selected');
            }    
        } else if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
    });


    /*****
    Funcion del botón de ataque, inicia la mecánica del juego
     y envía los datos si hay un personaje y un enemigo seleccionados
    *****/
    $('#attack').on('click', function(e) {
        var attacker;
        var target;

        // confirma que has seleccionado a un personaje y un oponente
        if ($('#party').find('.selected').length == 0 || $('#minions').find('.selected').length == 0) {
            $('#outputText').prepend('<p class="errorText"> No has seleccionado atacante Y oponente </p>');
            return console.log('error, no habia seleccionado todo lo necesario');
        }
        // busca quienes hay seleccionados en ambas columnas y determina su posición en el array
        if ($('#party').find('.selected')) {
            attacker = $('#party').find('.selected').index() - 1; //'-1' x q index tira numeros ordinales
        }
        if ($('#minions').find('.selected')) {
            target = $('#minions').find('.selected').index() - 1; //'-1' x q index tira numeros ordinales
        }
        // Marca al player seleccionado como atacante
        allCharacters.party[attacker].role = 'attacker';
        // si el atacante es el mago marca a todos los enemigos como oponentes
        if (allCharacters.party[attacker].profession == 'Mage') {
            for (var i = 0; i < allCharacters.enemies.length; i++) {
                allCharacters.enemies[i].role = 'target';
            }
        } else {
            allCharacters.enemies[target].role = 'target';
        }

        var message = allCharacters;
        connection.send(JSON.stringify(message)); // JSON.stringify(party) cambio aquí a party para ver que pasa
        console.log(JSON.stringify(message));

        // corregir esto para que reciba los mensajes adecuados
        // mensaje regresado x el server
        connection.onmessage = function(e) {
            allCharacters = JSON.parse(e.data);
            //console.log("recibí esto del server: ");
            //console.log(allCharacters);

            var party = allCharacters.party;
            var enemies = allCharacters.enemies;
            //actualiza enemigos
            enemiesAttacked(enemies);
            // actualiza personajes (Aquí tenemos que meter un delay + un sonido tal vez)
            characterAttacked(party);
            // hace updates de los arrays. ¿por separado?
            updateArrayMinions(allCharacters.enemies, enemies);
            updateArrayParty(allCharacters.party, party);
            checkGameState(allCharacters);
        }
        e.preventDefault();

    });

});