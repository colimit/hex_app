(function () {
	"use strict";
	/*global HexApp */
	//This object represents a game navigation state, I.e. what the game show
	//view displays at any given time. The game Nav knows the moves in the
	//the game, knows the current base move number in the game
	//and has a "current branch" which is responsible for holding
	//a variation from the base move. It also has a copy of the board, which
	//it is responsible for manipulating
	

	HexApp.GameNav = function (game) {
		this.gameMoves = game.get("moves");
		this.size = game.get("size");
		this.board = new HexApp.Board(this.size);
		this.branch = [];
		this.baseMove = 0;
		this.events = {};
	};


	HexApp.GameNav.prototype = {
		
		//this jumps to moveNum in the game moves list, and empties the branch
		//if moveNum is not given, jumps to the end of the movelist
		jump: function (moveNum) {
			var number = parseInt(moveNum, 10);
			var board = this.board;
			board.clear();
			this.clearBranch();
			var i = 0;
			while (!(i >= number) && board.handleMove(this.gameMoves[i])){
				i++;
			}
			this.baseMove = i;
		},
		
		currentMoveNum: function () {
			return this.branch.length || this.baseMove;
		},
		
		reset: function () {
			var oldBranch = this.branch;
			this.jump(this.baseMove);
			var that = this;
			oldBranch.forEach(function (move) { that.push(move); });
		},
		
		
		//this jumps to a move number within the existing branch, 
		//killing the rest of the branch;
		branchJump: function (moveNum) {	
			if (this.branch[moveNum - 1]){
				this.branch = this.branch.slice(0, moveNum);
				this.reset();
				return true;	
			}
		},
		
		//prepares for a new branch which will start at the startMove number,
		//which may be given as a string
		prepareNewBranch: function (startMove){
			var jumpNumber = parseInt(startMove, 10) - 1;
			this.goTo(jumpNumber);
		},
		
		goTo: function (moveNum) {
			return this.branchJump(moveNum) || this.jump(moveNum);
		},
		
	
		clearBranch: function () {
			this.branch = [];
		},
		
		setBranchMove: function (number, move) {
			this.branch[number - 1] = move;
		},
		
		//calls the named event's callback, with any additional arguments passed
		//along
		trigger: function(event) {
			var that = this;
			var args = [].slice.call(arguments, 1);
			if (this.events[event]){
				this.events[event].forEach(function(fn){
					fn.apply(that, args);
				});
			}
		
		},
	
		//sets up an event
		on: function(event, callback) {
			this.events[event] = this.events[event] || [];
			this.events[event].push(callback);
		},
		
		
		//this adds a move to the navigation.
		push: function(move) {
			if (this.gameMoves[this.baseMove - 1] === "resign") {
				this.jump(this.baseMove - 1);
			}
			if (this.board.handleMove(move)) {
				if (this.branch.length === 0 && 
					this.gameMoves[this.baseMove] === move){
						this.baseMove++;
				} else {
					this.setBranchMove(this.currentMoveNum() + 1, move);
				}
			}
		},
		
		next: function () {
			if (this.branch.length === 0){ 
				var move = this.gameMoves[this.currentMoveNum()]
				if (move) { this.push(move) }
			}
		},
	
		prev: function () {
			this.goTo(this.currentMoveNum() - 1);
		},
		
		branchMovesString: function () {
			var moves = [];
			this.branch.forEach(function(move, index){
				if (move) moves.push((index + 1) + "." + move);
			});
			return moves.join(" ");
		},
		
		winner: function () {
			if (this.gameMoves[this.baseMove - 1] === "resign") {
				var winner = this.board.oppositeColor(this.board.turnColor);
			}
			return this.board.winner() || winner;
		}
		
	};
		
})();