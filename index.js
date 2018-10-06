import './index.css';

var board;
const human = '0';
const computer = 'X';
const winCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');

document.querySelector('.replay-btn').addEventListener('click', function () {
	startGame();
})

startGame();

function startGame() {
	document.querySelector('.endgame').style.display = 'none';
	board = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerHTML = '';
		cells[i].style.removeProperty('background-color');
		cells[i].style.opacity = 1;
		cells[i].addEventListener('click', cellClick, false);
	}
};

function cellClick(ev) {
	if (typeof board[ev.target.id] === 'number') {
		turn(ev.target.id, human);
		if (!checkTie() && !checkWin(board, human)) {
			turn(bestSpot(), computer)
		}
	}

}

function turn(id, player) {
	board[id] = player;
	document.getElementById(id).innerText = player;
	let gameWon = checkWin(board, player);
	if (gameWon) {
		gameOver(gameWon);
	}
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombinations.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = { index: index, player: player };
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (const index of winCombinations[gameWon.index]) {
		document.getElementById(index).style.background = gameWon.player == human ? 'blue' : '#dd1818';
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].style.opacity = winCombinations[gameWon.index].indexOf(i) !== -1 ? 1 : '.5';
		cells[i].removeEventListener('click', cellClick, false);
	}
	declareWinner(gameWon.player == human ? 'You win' : 'You lose');
}

function declareWinner(winner) {
	document.querySelector('.endgame').style.display = 'block';
	document.querySelector('.endgame .text').innerText = winner;
}

function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(board, computer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.opacity = '.2';
			cells[i].removeEventListener('click', cellClick, false)
		}
		declareWinner('It\'s a tie ... how embarassing :(');
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availableSpots = emptySquares();

	if (checkWin(newBoard, human)) {
		return { score: -10 };
	} else if (checkWin(newBoard, computer)) {
		return { score: 10 };
	} else if (availableSpots.length === 0) {
		return { score: 0 };
	}

	var moves = [];
	for (var i = 0; i < availableSpots.length; i++) {
		var move = {};
		move.index = newBoard[availableSpots[i]];
		newBoard[availableSpots[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}
		newBoard[availableSpots[i]] = move.index;
		moves.push(move);

	}
	var bestMove;
	if (player === computer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];


}
