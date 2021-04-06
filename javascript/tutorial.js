//refresh the page and watch our painting change!!


var size = 600;//using this makes our canvas sizing incredibly more customizable
//why? because my canvas AND its contents are entirely in-proportion thanks to the .scale() method we will see later on

let canvas;//universal variable to represent our single canvas, when we overlay canvases atop each other we will have multiple canvas variables representing different canvases

//Now keep in mind, the main() function and drawscene() functions are composed of multiple individually defined functions. this allows me to consolidate many different aspects of this 'drawing' into small readable chunks

//to get the most out of this as a teaching tool begin your analysis at line 48: the 'drawHouse' function, and then arrive back at the main functions to see how they all fit together

function main(){//this will load all our components
    removeOverlay()
    canvas=initializeCanvas("canvas",size,(size*0.85));
    drawScene()
}

function drawScene(){//this function handles all drawing
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')//contains all the methods to draw on our canvas
    canvas.width=size
    canvas.height=size

    drawBackground(ctx);

    let properties = {//properties for second house
        levels: 7,
        wallColor: 'darkred',
        roofColor:randomizeColor(),
        door: true
    }

    drawHouse(ctx,[size*0.6, size*0.65], size*0.3, properties)
    //we are using canvas: ctx
    //x begins at 50% width of canvas from the left,
    //y begins at 80% height of canvas from the top
    //scale is 50% canvas size

    properties = {//properties for first house
        levels: 4,
        wallColor: 'darkred',
        roofColor: randomizeColor(),
    }

    
    drawHouse(ctx,[size*0.4, size*0.8], size*0.4,properties)

}

function drawHouse(ctx, location, scale,properties){
    //why is location parameter important?
    //if we do not include this parameter to represent the bounds of our canvas
    //our image ends up being drawn in the top left corner of our page,
    //rather than within the visible window of our canvas.
    //the first parameter of location, represents our x translation, the second the y-translation
    //we will use the canvas.translate() method, to express this movement
    ctx.beginPath();//begins drawing

    ctx.save()//save and restore methods are required when you use the same function
    //more than once to create an image on the same canvas
    ctx.translate(location[0],location[1])
    ctx.scale(scale,scale)//we will use the same scale for both x and y
    ctx.lineWidth=0.03//sets thickness of our lines

    ctx.fillStyle=properties.wallColor;//sets inner color for our walls

    //walls of house

    for (let i=1;i<=properties.levels;i++){
        ctx.beginPath()
        ctx.rect(-0.5,-0.1,1.0,0.1);//parameters are x-starting point, y-starting point, width, height
        ctx.stroke()
        ctx.fill()//applies fillStyle
        ctx.translate(0,-0.1)//after finishing creating the square, it will translate a set distance below, before the next loop
        ctx.rotate((Math.random()-0.5)*0.08)//in this log cabin, it is unusual for the logs
        //to be perfectly aligned. it makes the home look artificial. lets simulate the misalignment
        //our values with math.random will be between -0.5 and positive 0.5 radians
    }

    ctx.fillStyle=properties.roofColor;//we reset the fillStyle in anticipation of our roof styling
    

    //triangular roof of house
    ctx.beginPath()
    ctx.moveTo(-0.5,0)//start @ left corner of triangle
    ctx.lineTo(0.5,0)//translate to right corner of triangle
    ctx.lineTo(0.0,-0.5)//translate to top corner of triangle
    ctx.lineTo(-0.5,0)//return to left corner of triangle
    ctx.closePath()//without this, we will notice imprecise corners
    ctx.stroke()//finish brush stroke
    ctx.fill()//applies fillStyle
    
    ctx.restore()

    //door of house
    if (properties.door){
        ctx.save()
        ctx.translate(location[0],location[1])
        ctx.scale(scale*0.5,scale*0.5);
        ctx.lineWidth=0.4;
        //why are we doing this again? the new translation of our walls from 0 to 0.1, and the weird random angles will be maintained otherwise
        //removing the lines above these comments will result in mis-aligned door

        ctx.beginPath()
        ctx.fillStyle='black'
        ctx.rect(0.3,-0.7,0.2,0.52)
        ctx.fill()
        ctx.stroke()
        ctx.rotate(0)
    }

    ctx.restore()//restores the scaling to the moment we saves
    //now we can use the operation of drawHouse() again 
    
}

function drawBackground(ctx){
    //pasture
    ctx.beginPath();
    ctx.fillStyle='green';
    ctx.rect(0,size*0.5,size,0.5*size);
    //read this as x starts all the way to the left(x=0, height starts at 50% of totalheight, width is totalwidth, and height is half totalheight
    ctx.fill()
    ctx.stroke()
    //sky
    ctx.beginPath()
    ctx.fillStyle='cyan'
    ctx.rect(0,0,size,0.5*size)
    ctx.fill()
    ctx.stroke()
}

function randomizeColor(){
    //to get a random color, we will use math.random() to create random values to plug in as rgba values. we'll use this for the roofs
    let red = Math.floor((Math.random()*255))
    let green = Math.floor((Math.random()*255))
    let blue = Math.floor((Math.random()*255))

    return `rgba(${red},${green},${blue},1)`
}

function initializeCanvas(canvasName, width, height){//an automatic way to create a canvas with specific specs
    let canvas = document.getElementById(canvasName)
    canvas.width = width
    canvas.height = height
    return canvas
}

function removeOverlay(){//when activated, will remove overlay 
}