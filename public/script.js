// get rid of the default document padding
document.body.style.margin   = 0;
document.body.style.overflow = "hidden";
//Create canvas and make it the length and width of the browser window
const cnv = document.getElementById ("example_canvas");
cnv.style.background = "turquoise";
const ctx = cnv.getContext ("2d");
resize_canvas ();
window.onresize = resize_canvas;

//Declare variables
var angle = Math.PI/4;
var x_pos = 0; 
//Call Draw function
requestAnimationFrame(draw);
function draw(){
    cnv.style.background = "turquoise";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    //translate canvas origin point
    ctx.translate(cnv.width/2, cnv.height);
    branch(200);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function branch(len){
    //draw line starting from canvas origin to -len in the y direction
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();
    //translate to tip of the line
    ctx.translate(0, -len);
    if (len > 4){
        ctx.save();
        //rotate
        ctx.rotate(angle);
        branch(len*.67);
        ctx.restore();
        ctx.save();
        //rotate
        ctx.rotate(-angle);
        branch(len*.67);
        ctx.restore();
    }
}

function resize_canvas() {
    cnv.width = innerWidth;
    cnv.height = innerHeight;
}