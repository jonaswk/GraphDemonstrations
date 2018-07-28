var MAX_ID = 0;
var ctx: CanvasRenderingContext2D;

class GraphNode {
    edges: GraphNode[];
    id: number;
    x: number;
    y: number;
    radius: number;
    constructor(x: number, y: number, radius: number = 20) {
        this.edges = [];
        this.id = MAX_ID;
        MAX_ID += 1;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.id.toString(), this.x - this.radius/2, this.y + this.radius/2);   
    }

    drawEdges() {
        this.edges.forEach(node => {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x,node.y);
            ctx.stroke();
        });
    }
}

var nodearr: GraphNode[] = [];

nodearr.push(new GraphNode(30,30));
nodearr.push(new GraphNode(100,100));
nodearr.push(new GraphNode(150,50));
nodearr.push(new GraphNode(150,100));

nodearr[0].edges.push(nodearr[1]);
nodearr[0].edges.push(nodearr[2]);
nodearr[0].edges.push(nodearr[3]);

function redraw() {
    nodearr.forEach(node => {
        node.drawEdges();
        node.draw();
    });
}

window.onload = function () {
    var canvas = <HTMLCanvasElement> document.getElementById("graphCanvas");
    ctx = canvas.getContext("2d")!;
    redraw(); 
}