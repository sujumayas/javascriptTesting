$( document ).ready(function() {
  console.log( 'Document Ready!' );


  	// ION SOUND INITIATION //
	$.ionSound({
	    sounds: [                       // set needed sounds names
	        "beer_can_opening",
	        "bell_ring:0.3",            // :0.3 - individual volume
	    ],
	    path: "sounds/",                // set path to sounds
	    multiPlay: true,               // playing only 1 sound at once
	    volume: "0.3"                   // not so loud please
	});


	/**************** 
	Cambios en el CSS
	1) Quiero que los cubos se generen automáticamente, según una petición por MODAL. 
		- Creo que podría hacerse con múltiplos de 10, de todas formas. 20, 30, 40, 50. Para comenzar. 
		- Luego, si me da la gana, lo hago para que pueda ser cualquier número y que se organizen.
	2) Quiero que cuando se haga click en un cuadrado, sus closest (-1, y +1, y -lenght y +lenght) cambien de color. 
		- Esto es bastante simple. Lo puedo colocar junto con el $.ionSound.play()
		- La idea es que se pongan más rojas, o algo así, y que luego vuelvan a la normalidad. 
	***********/

	$("button").on("click", function(){
	    $.ionSound.play("beer_can_opening");
	    var i = $(this).index();
	    $(this).addClass("shadow");
	    $(this).next().addClass("shadow");
	    $(this).prev().addClass("shadow");
	    var up = ":nth-child(" + (i + 11) + ")";
	    var down = ":nth-child(" + (i - 9) + ")";
	    $("button" + up).addClass("shadow");
	    $("button" + down).addClass("shadow");
	    $(".wrapper").on({mouseleave: function(){
	    	    	for (var i = $("button").length; i >= 0; i--) {
	    	    		var indi = ":nth-child("+i+")";
	    	    		$("button"+indi).removeClass("shadow");
	    	    	};
	    	    }});
			});

});








