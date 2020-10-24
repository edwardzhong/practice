// 中介者模式使用在游戏状态
var playerDirector = (function () {
	var players = {},
		operations = {};

	operations.addPlayer = function (player) {
		var teamColor = player.teamColor;
		players[teamColor] = players[teamColor] || [];
		players[teamColor].push(player);
	};
	operations.removePlayer = function (player) {
		var teamColor = player.teamColor;
		players[teamColor] = players[teamColor] || [];
		for (var i = 0, len = players[teamColor].length; i < len; i++) {
			if (players[teamColor][i] == player) {
				players[teamColor].splice(i, 1);
				return true;
			}
		}
		return false;
	};
	operations.changeTeam = function (player, newTeamColor) {
		operations.removePlayer(player);
		player.teamColor = newTeamColor;
		operations.addPlayer(player);
	};
	operations.playerDead = function (player) {
		var teamColor = player.teamColor,
			teamPlayers = players[teamColor],
			allDead = true;

		for (var i = 0, len = teamPlayers.length; i < len; i++) {
			if (teamPlayers[i].state !== 'dead') {
				allDead = false;
				break;
			}
		}

		if (!allDead) {
			return;
		}
		for (var i = 0, len = teamPlayers.length; i < len; i++) {
			teamPlayers[i].lose();
		}

		for (var color in players) {
			if (color === teamColor) {
				continue;
			}
			for (var i = 0, len = players[color].length; i < len; i++) {
				players[color][i].win();
			}
		}
	};
	var receiveMessage = function () {
		var message = Array.prototype.shift.call(arguments);
		operations[message].apply(this, arguments);
	};
	return { receiveMessage: receiveMessage };
})();
function Player(name, teamColor) {
	this.name = name;
	this.teamColor = teamColor;
	this.state = 'alive';
}
Player.prototype = {
	win: function () {
		console.log(this.name + ' win');
	},
	lose: function () {
		console.log(this.name + ' lose');
	},
	die: function () {
		this.state = 'dead';
		playerDirector.receiveMessage('playerDead', this);
	},
	remove: function () {
		playerDirector.receiveMessage('removePlayer', this);
	},
	changeTeam: function () {
		playerDirector.receiveMessage('changeTeam', this);
	},
};
var playerFactory = function (name, teamColor) {
	var newPlayer = new Player(name, teamColor);
	playerDirector.receiveMessage('addPlayer', newPlayer);
	return newPlayer;
};

var player1 = playerFactory('a', 'blue');
var player2 = playerFactory('b', 'blue');
var player3 = playerFactory('c', 'blue');

var player4 = playerFactory('d', 'red');
var player5 = playerFactory('e', 'red');
var player6 = playerFactory('f', 'red');

player1.die();
player2.die();
player3.die();
