// Iniciar juego
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');

var main_state = {

	preload: function() {
		// Color del fondo
		this.game.stage.backgroundColor = '#3498db';

		// Cargar imágenes
		game.load.image('cielo', 'assets/cielo.png');
		game.load.image('suelo', 'assets/suelo.png');
		game.load.image('moneda', 'assets/moneda.png');
		game.load.image('seta', 'assets/seta.png');
		game.load.spritesheet('prota', 'assets/prota.png', 32, 48);
	},

	create: function() {
		// Usar el sistema de físicas
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Añadir el fondo de nuestro juego
		game.add.sprite(0, 0, 'cielo');

		// Creamos un grupo para añadir plataformas
		plataformas = game.add.group();

		// Activamos el uso de la física con las plataformas
		plataformas.enableBody = true;

		// Ahora creamos el suelo
		var suelo = plataformas.create(0, game.world.height - 100, 'suelo');

		// Aumentamos el tamaño del suelo para ajustarlo al ancho
		suelo.scale.setTo(3, 3.5);

		// Inmovilizamos el suelo para evitar que se mueva al interactuar
		// con otros objetos
		suelo.body.immovable = true;

		// Creamos una plataforma por encima del suelo
		var plataforma = plataformas.create(200, 350, 'suelo');

		// Inmovilizamos la plataforma recién creada
		plataforma.body.immovable = true;

		// Añadimos al prota
		prota = game.add.sprite(400, 420, 'prota');

		// Activamos el uso de la física con el prota
		game.physics.arcade.enable( prota );

		// Propiedades del prota
		prota.body.bounce.y = 0.2;
		prota.body.gravity.y = 300;
		prota.body.collideWorldBounds = true;

		// Creamos las animaciones al andar
		prota.animations.add('izquierda', [0, 1, 2, 3], 10, true);
		prota.animations.add('derecha', [5, 6, 7, 8], 10, true);

		// Añadimos la seta
		seta = game.add.sprite(500, 420, 'seta');

		// Activamos el uso de la física con la seta
		game.physics.arcade.enable( seta );

		// Propiedades de la seta
		seta.body.bounce.y = 0.3;
		seta.body.gravity.y = 300;

		// Creamos el grupo de monedas
		monedas = game.add.group();

		monedas.enableBody = true;

		// Bucle para añadir 125 monedas
		for (var i = 0, j = 0; i < 125; i++) {
			// Creamos la moneda
			var moneda = monedas.create(j * 70, 0, 'moneda');

			// Desvio de la aparición de la moneda en el eje x
			j = j + 0.09;

			// Propiedades de la moneda
			moneda.body.gravity.y = 200;
			moneda.body.bounce.y = 0.7 + Math.random() * 0.2;
		}

		// Añadimos un letrero mostrando la puntuación
		scoreText = game.add.text(20, game.world.height - 60, 'score: 0', {font: 'bold 30px Open Sans', fill: '#fff'});
	},

	update: function() {
		// Activamos la colisión entre los objetos añadidos
		game.physics.arcade.collide(prota, plataformas);
		game.physics.arcade.collide(seta, plataformas);
		game.physics.arcade.collide(monedas, plataformas);

		// Eventos al colisionar objetos
		game.physics.arcade.overlap(prota, seta, cogerSeta, null, this);
		game.physics.arcade.overlap(prota, monedas, cogerMoneda, null, this);
		
		// Creamos el objeto encargado de capturar el teclado
		cursors = game.input.keyboard.createCursorKeys();

		// Reiniciamos la velocidad del personaje al soltar la tecla
		prota.body.velocity.x = 0;

		// Si pulsamos la flecha izquierda o derecha el prota aumentará
		// la velocidad de su carrera en ese sentido
		if (cursors.left.isDown) {
			prota.body.velocity.x = -150;
			prota.animations.play('izquierda');
		}
		else if (cursors.right.isDown) {
			prota.body.velocity.x = 150;
			prota.animations.play('derecha');
		}

		// Si el prota para de su animación se para en el frame de parada
		else {
			prota.animations.stop();
			prota.frame = 4;
		}

		// Si el prota está tocando el suelo y se pulsa la tecla de dirección
		// hacia arriba el prota salta
		if (cursors.up.isDown && prota.body.touching.down) {
			prota.body.velocity.y = -350;
		}
	},

	restart_game: function() {
		this.game.state.start('main')
	}
}


function cogerSeta (prota, seta) {
	// Eliminamos la seta
	seta.kill();

	// Aumentamos el tamaño del prota
	prota.scale.setTo(1.5, 1.5);

	// Subimos la posición del personaje después de crecer
	prota.body.y = prota.body.y - 30;
}

// Iniciamos la puntuación de la partida
var score = 0;

function cogerMoneda (prota, moneda) {
	// Eliminamos la moneda
	moneda.kill();

	// Subimos la puntuación
	score += 10;

	// Actualizamos el resultado mostrada
	scoreText.text = 'Score: ' + score;
}

game.state.add('main', main_state);
game.state.start('main');