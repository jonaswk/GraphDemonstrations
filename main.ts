var MAX_NODEID = 0;
var MAX_EDGEID = 0;
var ctx: CanvasRenderingContext2D;

var p = 0.2;
var n = 6;
var friction = 0.9;

var nodearr: GraphNode[] = [];
var edgearr: GraphEdge[] = [];

class Vector2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    substract(otherVector: Vector2D) {
        // Would like to have operator overloading :(
        return new Vector2D(this.x - otherVector.x, this.y - otherVector.y);
    }

    add(otherVector: Vector2D) {
        return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
    }

    times(scalar: number) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    floor(threshold: number, limit: number) {
        if (this.x < threshold) {
            this.x = limit
        }
        if (this.y < threshold) {
            this.y = limit
        }
    }

}

class GraphEdge {
    id: number;
    a: GraphNode;
    b: GraphNode;

    constructor(a: GraphNode, b: GraphNode) {
        this.a = a;
        this.b = b;
        this.id = MAX_EDGEID;
        MAX_EDGEID += 1;
    }

    draw() {
        ctx.save();
        ctx.moveTo(this.a.position.x, this.a.position.y);
        ctx.lineTo(this.b.position.x, this.b.position.y);
        ctx.stroke();
        ctx.restore();
    }
}

class GraphNode {
    id: number;
    position: Vector2D;
    radius: number;
    velocity: Vector2D;

    constructor(x: number, y: number, radius: number = 20) {
        this.id = MAX_NODEID;
        MAX_NODEID += 1;
        this.position = new Vector2D(x,y);
        this.radius = radius;
        this.velocity = new Vector2D(0,0);
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.id.toString(), this.position.x - this.radius/2, this.position.y + this.radius/2);   
        ctx.restore();
    }
}

for (let i = 0; i <= n; i++) {
    nodearr.push(new GraphNode(200 + Math.random()*100, 100+Math.random()*100));
}

for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
        let rand = Math.random();
        if (rand <= p) {
            edgearr.push(new GraphEdge(nodearr[i], nodearr[j]));
        }
    }
}

function dist(a: GraphNode, b: GraphNode) {
    return Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2));
}

function direction(a: GraphNode, b: GraphNode) {
    return b.position.substract(a.position);
}

function redraw() {
    requestAnimationFrame(redraw);

    var canvas = <HTMLCanvasElement> document.getElementById("graphCanvas");
    ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, 800, 600);

    for (let i = 0; i <= n; i++) {
        let node = nodearr[i];
        for (let j = 0; j <= n; j++) {
            if (i != j) {
                let node2 = nodearr[j];
                let scaling = (1 / Math.pow(dist(node, node2), 2)) * 80;
                if ( scaling < 0.01) scaling = 0;
                node2.velocity = node2.velocity.add(direction(node, node2).times(scaling)); 
            }
        }
    }

    edgearr.forEach(edge => {
        edge.draw();
    })
    nodearr.forEach(node => {
        node.position = node.position.add(node.velocity); 
        node.velocity = node.velocity.times(friction);
        node.velocity.floor(0.005, 0);   
        node.draw();
    });
}

window.onload = function () {
    this.requestAnimationFrame(redraw);
}
