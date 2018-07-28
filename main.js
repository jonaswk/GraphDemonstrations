"use strict";
var MAX_ID = 0;
var ctx;
var GraphNode = /** @class */ (function () {
    function GraphNode(x, y, radius) {
        if (radius === void 0) { radius = 20; }
        this.edges = [];
        this.id = MAX_ID;
        MAX_ID += 1;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    GraphNode.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.id.toString(), this.x - this.radius / 2, this.y + this.radius / 2);
    };
    GraphNode.prototype.drawEdges = function () {
        var _this = this;
        this.edges.forEach(function (node) {
            ctx.moveTo(_this.x, _this.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
        });
    };
    return GraphNode;
}());
var nodearr = [];
nodearr.push(new GraphNode(30, 30));
nodearr.push(new GraphNode(100, 100));
nodearr.push(new GraphNode(150, 50));
nodearr.push(new GraphNode(150, 100));
nodearr[0].edges.push(nodearr[1]);
nodearr[0].edges.push(nodearr[2]);
nodearr[0].edges.push(nodearr[3]);
function redraw() {
    nodearr.forEach(function (node) {
        node.drawEdges();
        node.draw();
    });
}
window.onload = function () {
    var canvas = document.getElementById("graphCanvas");
    ctx = canvas.getContext("2d");
    redraw();
};
