
var turn = 0;
var currentGame;
var winningCombos = [
	[0, 1, 2], 
	[3, 4, 5],
	[6, 7, 8], 
	[0, 3, 6], 
	[1, 4, 7], 
	[2, 5, 8], 
	[0, 4, 8], 
	[2, 4, 6]
]

function attachListeners() {
	//listener for the turn
	$('td').on('click', function(event) {
		doTurn(event);
	});
	//listen for previous games
	$('#previous').on('click', function(){
		getPreviousGames();
	});
	// listen quietly for save
	$('#save').on('click', function(){
		//this means we're not resetting, saving in the middle of a game, it has an idea and it gets patched
		if(currentGame) {
			saveGame(false);	
		}
		//we are resetting this is a new game, can't be patched because it has no idea, so post
		else {
			saveGame(true);
		}
	});
}

function doTurn(event) {
	//update the board
	updateState(event);
	// check if anyone won
	var check = checkWinner();
	//if so save game
	if (check === true || turn === 8) {
		//reset turn
		turn = 0;
		saveGame(true);
		//reset board
		$('td').text('');
	}
	else {
		//new turn
		turn++;		
	}

}

function updateState(event) {
	var currentPlayer = player();
	//update board with current player
	if($(event.target).is(':empty')) {
		$(event.target).html(currentPlayer);
	}
}

function checkWinner() {
	var winner;
	console.log(turn);
	if (turn > 3 && turn <= 8) {
		for (var i = 0, len = winningCombos.length; i < len; i++) {
			//check if this combo has a winner
			winner = checkCells(winningCombos[i]);
			//if it returned x as the winner, x won
			if (winner === "X") {
				message("Player X Won!");
				return true;
			}
			//same for o
			else if (winner === "O") {
				message("Player O Won!");
				return true;
			}
		}
		//if we made it through the loop with no winner its a tie
		message("Tie game");
		return false;
	}
	//for when turn isn't yet 3
	return false;

}

function checkCells(winningCombo) {
	var result;
	//get the cells
	var cellsArray = $('td');
	var firstCell = $(cellsArray[winningCombo[0]]);
	//exclude like cells if they're empty, nobody won
	if (!firstCell.is(':empty')) {
		
		var cell0 = cellsArray[winningCombo[0]].innerHTML;
		var cell1 = cellsArray[winningCombo[1]].innerHTML;
		var cell2 = cellsArray[winningCombo[2]].innerHTML;
		//somebody won
		if (cell0 === cell1 && cell1 === cell2) {
			var result = cell0;
		}
	}
	return result;
}

function player() {
	if (turn % 2 === 0 || turn === 0)  {
		return "X";
	}
	else {
		return "O";
	}
}

function message(messageString) {
	$('#message').html(messageString);
}

function saveGame(reset) {
	var state = getState();
	var method;
	var url;
	
	if(reset) {
		method = "POST";
		url = '/games';
		var data = {
			game: {
				state: state	
			}
		}
	}
	else {
		console.log("lol")
		method = "PATCH";
		console.log(currentGame);
		url = '/games/' + currentGame;
		var data = {
			game: {
				id: currentGame,
				state: state
			} 
		}
	}	
 	$.ajax( {
 		url: url,	
 		method: method,
 		data: data
 	}).done(function(data, textStatus, jqXHR) {
 		console.log(jqXHR);
 		if (reset) {
 			current_game = 0
 		}
 		else {
 			currentGame = JSON.parse(jqXHR.responseText)['game']['id'];
 			console.log(currentGame);
 		}
 	});
}

function getState() {
	var board = []
 	var cells = ($('td'));
 	for (var k = 0; k < 9; k++) {
 		board.push(cells[k].innerHTML);
 	}
 	return board;
}

function getPreviousGames() {
	$.get("/games").done(function(data) {
		if (data.length > 0){
			for(var l = 0, len = data.length; l < len; l++) {
				$('#games').innerHTML("<p>" + data[l].id + "</p>");
			}
		}
	});
}

$(document).ready(function() {
	attachListeners();
});

// $.ajax('/foo', { type: 'POST', data: { _method: 'PATCH' } });

// var data = JSON.stringify({
// 		title: issueTitle, 
// 		body: issueBody
// 	});

// 	$.ajax({
// 		url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/issues',
// 		type: 'POST',
// 		dataType: 'json',
// 		dataContent: 'application/json',
// 		data: data,
// 		headers: {
// 			// Authorization: ''
//   		},
// 	}).done(function(results) {
// 		handleResponse(results);
// 	}).fail(function(jqXHR, textStatus, errorThrown){
// 		handleError(jqXHR, textStatus, errorThrown);
// 	});


// <body>
// 	<table border='1' cellpadding='40'>
// 		<tr>
// 			<td data-x='0' data-y='0'></td>
// 			<td data-x='1' data-y='0'></td>
// 			<td data-x='2' data-y='0'></td>
// 		</tr>
// 		<tr>
// 			<td data-x='0' data-y='1'></td>
// 			<td data-x='1' data-y='1'></td>
// 			<td data-x='2' data-y='1'></td>
// 		</tr>
// 		<tr>
// 			<td data-x='0' data-y='2'></td>
// 			<td data-x='1' data-y='2'></td>
// 			<td data-x='2' data-y='2'></td>
// 		</tr>
// 	</table>
// 	<div id='games'></div>
// 	<div id='message'></div>
// 	<button id='save'>Save Game</button>
// 	<button id='previous'>Show Previous Games</button>
// </body>
