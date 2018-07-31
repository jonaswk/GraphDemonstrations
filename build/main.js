"use strict";
var MAX_NODEID = 0;
var MAX_EDGEID = 0;
var ctx;
var p = 0.2;
var n = 6;
var friction = 0.5;
var nodearr = [];
var edgearr = [];
var Vector2D = /** @class */ (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2D.prototype.substract = function (otherVector) {
        // Would like to have operator overloading :(
        return new Vector2D(this.x - otherVector.x, this.y - otherVector.y);
    };
    Vector2D.prototype.add = function (otherVector) {
        return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
    };
    Vector2D.prototype.times = function (scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    };
    Vector2D.prototype.floor = function (threshold, limit) {
        if (this.x < threshold) {
            this.x = limit;
        }
        if (this.y < threshold) {
            this.y = limit;
        }
    };
    return Vector2D;
}());
var GraphEdge = /** @class */ (function () {
    function GraphEdge(a, b) {
        this.a = a;
        this.b = b;
        this.id = MAX_EDGEID;
        MAX_EDGEID += 1;
    }
    GraphEdge.prototype.draw = function () {
        ctx.save();
        ctx.moveTo(this.a.position.x, this.a.position.y);
        ctx.lineTo(this.b.position.x, this.b.position.y);
        ctx.stroke();
        ctx.restore();
    };
    return GraphEdge;
}());
var GraphNode = /** @class */ (function () {
    function GraphNode(x, y, radius) {
        if (radius === void 0) { radius = 20; }
        this.id = MAX_NODEID;
        MAX_NODEID += 1;
        this.position = new Vector2D(x, y);
        this.radius = radius;
        this.velocity = new Vector2D(0, 0);
    }
    GraphNode.prototype.draw = function () {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.id.toString(), this.position.x - this.radius / 2, this.position.y + this.radius / 2);
        ctx.restore();
    };
    return GraphNode;
}());
for (var i = 0; i <= n; i++) {
    nodearr.push(new GraphNode(300 + Math.random() * 100, 200 + Math.random() * 100));
}
for (var i = 0; i <= n; i++) {
    for (var j = 0; j <= n; j++) {
        var rand = Math.random();
        if (rand <= p) {
            edgearr.push(new GraphEdge(nodearr[i], nodearr[j]));
        }
    }
}
function dist(a, b) {
    return Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2));
}
function direction(a, b) {
    return b.position.substract(a.position);
}
function redraw() {
    requestAnimationFrame(redraw);
    var canvas = document.getElementById("graphCanvas");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 800, 600);
    for (var i = 0; i <= n; i++) {
        var node = nodearr[i];
        for (var j = 0; j <= n; j++) {
            if (i != j) {
                var node2 = nodearr[j];
                var scaling = (1 / Math.pow(dist(node, node2), 2)) * 200;
                if (scaling < 0.009)
                    scaling = 0;
                node2.velocity = node2.velocity.add(direction(node, node2).times(scaling));
            }
        }
    }
    edgearr.forEach(function (edge) {
        edge.draw();
    });
    nodearr.forEach(function (node) {
        node.position = node.position.add(node.velocity);
        node.velocity = node.velocity.times(friction);
        node.velocity.floor(0.005, 0);
        node.draw();
    });
}
window.onload = function () {
    this.requestAnimationFrame(redraw);
};
