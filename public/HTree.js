// Blog Link:
//https://creativecodingblog.deno.dev/

//Add event listener for when the page loads
//makes sure the css and html are all ready before any code is run
window.addEventListener('load', function(){

    //I have two canvases, one canvas is in the foreground, I am drawing pretty detailed
    //fractal patterns on it and it would take alot of computing power to draw every frame. 
    //So the canvas in the background will be animated instead.

    //Fractal Canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Background Canvas setup
    const bgcanvas = document.getElementById('canvas2');
    const bgctx = bgcanvas.getContext('2d');
    bgcanvas.width = window.innerWidth;
    bgcanvas.height = window.innerHeight;

    //BASIC CANVAS SETTINGS//
    //I add shadows to everything I draw in the fractal canvas
    //this adds some depth to the pattern
    ctx.shadowColor='rgba(0,0,0,.5)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    //I have make rounded lines for a more organic fractal
    ctx.lineCap = "round";

    //FRACTAL EFFECT SETTINGS//
    //Determines the initial segment size, I make this relative to the viewing 
    //screen so that any device will see the same thing.
    let size = canvas.width < canvas.height ? canvas.width * .2 : canvas.height * .2;

    //These variables are both constants because I want some complexity but not so much that
    //the computer lags trying to process drawing the fractal.
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

    //Fractal color which is randomly generated as a HSL value
    //I want the tips of the fractal to be bright red, yellow, or orange
    //and I want the stems to be a color 40 degrees on the color wheel
    //from the tips
    //This will help the tips contrast the background and really pop
    //while the stems will be a similar color but still distinct
    let randColor = (Math.random() * 130)-70;
    let colorTip = 'hsl('+ randColor + ', 100%, 50%)';
    let color = 'hsl('+ (randColor - 40) + ', 100%, 50%)';
    //I set the initial branch color here
    ctx.strokeStyle = color;
    //set width of the fractal lines
    let lineWidth = Math.floor(Math.random()*10 +10);

    //FRACTAL TREE SECTION
    //The drawBranch function's argument will track
    //how many times I iterate, since it is recursive
    //I need an end condition
    function drawBranch(step){
        //When step is greater than the maxStep constant then I 
        //leave the function
        if (step > maxStep) return;
        //When I've iterated a couple of times, I set the strokeStyle
        //to the colorTip variable so all the rest of the iterations
        //have the tip color applied.
        if (step > maxStep-4){
            ctx.strokeStyle = colorTip;
        }

        //I draw the initial line starting from the middle of the canvas
        //with the length being the initial size variable
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(size, 0);
        ctx.stroke();

        //I draw the children branches here
        //This loop iterates for as many branches as I want to draw
        for(let i = 0; i < branches; i++){
            //I save the canvas settings (transforms and everything)
            //translate to the new branch location
            //scale the branch
            ctx.save();
            ctx.translate(size-(size/branches) * i,0);
            ctx.scale(scale,scale);
            //save the canvas settings
            //rotate the canvas by my angle variable
            //and call this function (which draws a new branch at
            //the saved canvas location) while increasing the step by 1
            //and then restore the canvas settings to what they were before
            ctx.save();
            ctx.rotate(bAngle);
            drawBranch(step+1);
            ctx.restore();

            ctx.restore();
        }
    }

    //ROTATE FRACTAL TREE SECTION
    //This function calls the drawBranch function and rotates the fratal tree
    //creating a circular pattern 
    function rotateBranch(){
        //clears canvas before drawing new fractal
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.translate(canvas.width/2, canvas.height/2);
        //Loops through for as many sides (number of trees I want drawn) as I have set
        for (let i=0; i<sides; i++){
            //Rotates the canvas settings and calls the drawBranch function
            ctx.rotate((Math.PI*2)/sides);
            ctx.strokeStyle = color;
            drawBranch(0);
        }
        ctx.restore();
    }
    rotateBranch();

    //RANDOMIZE FRACTAL BUTTON SECTION
    //Every time I generate a new fratcal I run this function to
    //randomize some of the variables
    function randomizeFractal(){
        //Randomize the number of "trees" in the fractal
        //has to be a whole number
        sides = Math.floor(Math.random() * 12 +5);
        //Randomize successive branch lengths
        scale = Math.random() * 0.2 + 0.5;
        //Randomize the branch angle
        //I control the angle so that the fractal tree
        //more closely resembles a drifting sea coral
        bAngle = (Math.random()* 2.4 + 0.1) - 1.2;
        //Randomize fractal color
        randColor = (Math.random() * 130)-70;
        colorTip = 'hsl('+ randColor + ', 100%, 50%)';
        color = 'hsl('+ (randColor - 40) + ', 100%, 50%)';
        //Randomize width of the fractal lines
        lineWidth = Math.floor(Math.random()*10 +10);
        rotateBranch();
    }
    //Every time the user clicks the canvas, the event listener runs the randomize fractal
    //function, I decided on not having a button for some more immersion
    canvas.addEventListener('click', randomizeFractal);

    //BACKGROUND CIRCLE CLASS
    class Circle {
        //the constructor lets me input the x and y values for the coordinates as well as radius
        //and the color
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            //radians is used to move the circles in an orbital path
            //It is random so the circles start off on a random part of the orbit path
            this.radians = Math.random() * Math.PI * 2;
            //the velocity value controls the speed at which the circles move
            this.velocity = 0.001;
            //distance from center makes sure that the circles orbit at a constant distance from the
            //center path
            this.distanceFromCenter = {x:Math.random()*canvas.width, y:Math.random()*canvas.height};

            //update method moves the circles over time when its called b the animate function
            this.update = () => {
                //Move circles over time
                //the x and y are manipulated by using sin and cos for an orbital path
                this.radians += this.velocity;
                this.x = x + Math.cos(this.radians)*this.distanceFromCenter.x;
                this.y = y + Math.sin(this.radians)*this.distanceFromCenter.y;
                this.draw();
            };

            //draw function draws the Circles to the canvas
            this.draw = () => {
                bgctx.beginPath();
                bgctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                bgctx.fillStyle = color;
                bgctx.fill();
                bgctx.closePath();
            };
        }
    }

    //DRAW CIRCLES
    let circles;
    let circcolor;
    function bgdraw(){
        //create circles array to hold all the circle objects
        circles = [];

        //I run this loop 500 times to make 500 Circle objects and pass them into the circle array
        //I also assign a random color to the circles where I make the range
        //the blue section on the hsl circle
        for(let i=0; i<500; i++){
            circcolor = 'hsl('+ ((Math.random()* 20)+220) + ', 100%, 20%)';
            //the x and y are by default the center of the canvas
            circles.push(new Circle(canvas.width/2, canvas.height/2, 50, circcolor));
        }
        console.log(circles);
    }
    
    //ANIMATE LOOP
    //The animate function calls itself every frame since it needs to
    //continuously update the background
    function animate(){
        requestAnimationFrame(animate);
        //Every frame I clear the canvas so that the drawings don't
        //get duplicated
        bgctx.clearRect(0,0,bgcanvas.width,bgcanvas.height);

        //for all Circle objects in the circle array
        //I run the update method so that they orbit around the center in the background
        circles.forEach(Circle => {
            Circle.update();
        });
    }

    //I call the bgdraw to create all the circle objects
    //and then I call the animate function to move them around
    bgdraw();
    animate();

    //CANVAS RESIZE
    //Everytime the user resizes their window I call this function
    //It sets the canvas to the new window size as well as making sure
    //the fractal size is proportional to the new canvas so it doesn't
    //go out of bounds
    //I then call the rotate branch function to redraw the fractal
    //Since the randomize fractal function doesn't get called, the redrawn fractal 
    //retains its settings.
    window.addEventListener('resize', function(){
        console.log('resized');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        bgcanvas.width = window.innerWidth;
        bgcanvas.height = window.innerHeight;
        size = canvas.width < canvas.height ? canvas.width * 0.2 : canvas.height * 0.2;
        rotateBranch();
    });
});