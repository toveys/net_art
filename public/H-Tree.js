
//Add event listener to setup canvas when the page loads
//makes sure the css and html are all ready before any code is run
window.addEventListener('load', function(){
    //Fractal Canvas
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Background Canvas
    const bgcanvas = document.getElementById('canvas2');
    const bgctx = canvas.getContext('2d');
    bgcanvas.width = window.innerWidth;
    bgcanvas.height = window.innerHeight;

    //BASIC CANVAS SETTINGS//
    //add shadows to everything I draw in the canvas
    ctx.shadowColor='rgba(0,0,0,.5)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    ctx.lineCap = "round";

    //FRACTAL EFFECT SETTINGS//
    //Determines the initial segment size, I make this relative to the viewing 
    //screen so that any device will see the same thing
    let size = canvas.width < canvas.height ? canvas.width * .2 : canvas.height * .2;

    //These variables are both constants because I want some complexity but not so much that
    //the computer lags trying to process drawing the fractal//
    //Determines the depth of the fractal
    const maxStep = 8;
    //Determines the number of segments per each branch off point
    const branches = 2;

    //These are the initial settings for the fractal
    //Determines the number of "trees" in the fractal
    let sides = 10;
    //Determines branch length compared to their parent branch
    let scale = 0.6;
    //Determines the branch angle
    let bAngle = .6;
    //Fractal color which is randomly generated as a HSB value
    let randColor = (Math.random() * 130)-70;
    let colorTip = 'hsl('+ randColor + ', 100%, 50%)';
    let color = 'hsl('+ (randColor - 40) + ', 100%, 50%)';
    ctx.strokeStyle = color;
    //canvas.style.backgroundColor = 'hsl(220, 100%, 20%)';
    //set width of the fractal lines
    let lineWidth = Math.floor(Math.random()*10 +10);

    //CONTROL BUTTON VARIABLE
    const randomizeButton = document.getElementById('randomizeButton');


    //FRACTAL TREE SECTION
    function drawBranch(step){
        if (step > maxStep) return;
        if (step > maxStep-4){
            ctx.strokeStyle = colorTip;
        }

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(size, 0);
        ctx.stroke();

        for(let i = 0; i < branches; i++){
            ctx.save();
            ctx.translate(size-(size/branches) * i,0);
            ctx.scale(scale,scale);

            ctx.save();
            ctx.rotate(bAngle);
            drawBranch(step+1);
            ctx.restore();

            ctx.restore();

        }

    }
    //ROTATE FRACTAL TREE SECTION
    function rotateBranch(){
        //clears canvas before drawing new fractal
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.save();
        ctx.lineWidth = lineWidth;
        //Set the stroke style of the fractal lines to the randomly generated color
        ctx.translate(canvas.width/2, canvas.height/2);
        for (let i=0; i<sides; i++){
            ctx.rotate((Math.PI*2)/sides);
            ctx.strokeStyle = color;
            drawBranch(0);
        }
        ctx.restore();
    }
    rotateBranch()

    //RANDOMIZE FRACTAL BUTTON SECTION
    function randomizeFractal(){
        //Randomize the number of "trees" in the fractal
        //has to be a whole number
        sides = Math.floor(Math.random() * 12 +5);
        //Randomize successive branch lengths
        scale = Math.random() * 0.2 + 0.5;
        //Randomize the branch angle
        bAngle = (Math.random()* 2.4 + 0.1) - 1.2;
        //Randomize fractal color
        randColor = (Math.random() * 130)-70;
        colorTip = 'hsl('+ randColor + ', 100%, 50%)';
        color = 'hsl('+ (randColor - 40) + ', 100%, 50%)';
        //Randomize width of the fractal lines
        lineWidth = Math.floor(Math.random()*10 +10);
        rotateBranch();
    }
    canvas.addEventListener('click', randomizeFractal);

    window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        bgcanvas.width = window.innerWidth;
        bgcanvas.height = window.innerHeight;
        size = canvas.width < canvas.height ? canvas.width * 0.2 : canvas.height * 0.2;
        rotateBranch();
    });
});