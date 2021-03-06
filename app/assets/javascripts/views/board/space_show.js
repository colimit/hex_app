/*global HexApp, Backbone */
(function(){
	"use strict";
	HexApp.Views.SpaceShow = Backbone.View.extend({

		initialize: function (options){
			this.coord = options.coord;
			this.board = options.board;
			this.$el.attr("style", this.style());
			this.$el.addClass("hex-space");
			this.$el.attr("id", HexApp.coordToString(this.coord));
		},

		spaceTop: function () {
			return 11 + 24 * this.coord[0];
		},

		spaceLeft: function () {
			return 15 + 14 * this.coord[0] + 28 * this.coord[1];
		},

		style: function() {
			var left = "left: " + this.spaceLeft() + "px;";
			var top  = "top: " + this.spaceTop() + "px;";
			return left + " " + top;
		},

		render: function () {
			this.$el.removeClass("red");
			this.$el.removeClass("blue");
			var color = this.board.getHex(this.coord);
			if (color) { this.$el.addClass(color); }
			return this;
		}

	});
})();