//refresh the page and watch our painting change!!


var size = 600;//using this makes our canvas sizing incredibly more customizable
//why? because my canvas AND its contents are entirely in-proportion thanks to the .scale() method we will see later on

let canvasPiano;//universal variable to represent our single canvas, when we overlay canvases atop each other we will have multiple canvas variables representing different canvases
let canvasHit
let canvasA;
let canvasB;

//Now keep in mind, the main() function and drawscene() functions are composed of multiple individually defined functions. this allows me to consolidate many different aspects of this 'drawing' into small readable chunks

//to get the most out of this as a teaching tool begin your analysis at line 48: the 'drawHouse' function, and then arrive back at the main functions to see how they all fit together

function main(){//this will load all our components
    removeOverlay()
	CANVAS_PIANO=initializeCanvas("canvasPiano",size,size);
    drawScene()
}

function drawScene(){//this function handles all drawing
    let canvas = document.getElementById('canvasPiano')
    let ctx = canvas.getContext('2d')//contains all the methods to draw on our canvas
    canvas.width=size
    canvas.height=size

    drawBackground(ctx);

    drawHouse(ctx,[size*0.6, size*0.65], size*0.3, properties)
    //we are using canvas: ctx
    //x begins at 50% width of canvas from the left,
    //y begins at 80% height of canvas from the top
    //scale is 50% canvas size
    
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


//Our Button System

class ButtonHandler{//this class will create and house the buttons we generate
    //static defines a property or methed that cannot be called upon externally, but can be called upon from within the class itself
	static buttons=[];//contain all the buttons and their info that we create
	static helperCanvas;
	static mouse=[0,0];
	static debug=true;
	static canvas;
    //generate a button
	static createButton(location,width,height,name,frequency,properties){//where the button is, dimensions, dimensions, identifier, sound, other options
		if(properties==null){
			properties={
				strokeStyle:"black",
				defaultColor:"white",
				downColor:"red",
				hoverColor:"lightGray",
				frequency:frequency
			}
		}
		ButtonHandler.buttons.push(new Button(location,width,height,name,properties));//pushes the created button to our buttons [] array
	}
	
	static pixelHitTest(diff){
		let hitPixels=[];
		for(let y=0;y<diff.height;y++){//evaluate each y from y=0 to 
			for(let x=0;x<diff.width;x++){
				let px=getPixelValue(diff.data,x,y);
				let alpha=diff.data[(y*diff.width+x)*4+3];
				if(alpha>0){
					hitPixels.push([x,y]);
				}
			}
		}
		
		let ctx=ButtonHandler.helperCanvas.getContext("2d");
		
		let imgData=ctx.getImageData(0,0,
					diff.width,diff.height);
		
		let hitColorKeys=[];
		for(let i=0;i<hitPixels.length;i++){
			let px=getPixelValue(imgData.data,hitPixels[i][0],hitPixels[i][1]);
			let color=formatPixelFromArray(px);
			//let color=getColor(ctx,hitPixels[i]);
			hitColorKeys[color]=true;
		}
		
		for(let i=0;i<ButtonHandler.buttons.length;i++){
			let btn=ButtonHandler.buttons[i];
			btn.wasDown=btn.down;
			btn.down=false;
			if(hitColorKeys[btn.color]==true){
				btn.down=true;
				if(!btn.wasDown){
					btn.properties.callback(
						btn.properties.freq
					);
				}
			}
		}
		
		markPixelLocations(ctx,hitPixels);
	}
	
	static createPianoKey(name,location,width,height,options){
		ButtonHandler.buttons.push(new PianoKeyButton(name,location,width,height,getRandomColor(),options));
	} 
	
	static addButtonListeners(canvas){
		ButtonHandler.canvas=canvas;
		canvas.addEventListener("mousemove",ButtonHandler.onMouseMove);
		canvas.addEventListener("mousedown",ButtonHandler.onMouseDown);
		canvas.addEventListener("mouseup",ButtonHandler.onMouseUp);
	}
	
	static drawButtons(ctx){
		for(let i=0;i<ButtonHandler.buttons.length;i++){
			ButtonHandler.buttons[i].draw(ctx);
		}
		let helperCtx=ButtonHandler.helperCanvas.getContext("2d");
		helperCtx.clearRect(0,0,helperCtx.canvas.width,helperCtx.canvas.height);
		for(let i=0;i<ButtonHandler.buttons.length;i++){
			ButtonHandler.buttons[i].drawHitArea(helperCtx);
		}
		
		if(ButtonHandler.debug){
			helperCtx.beginPath();
			helperCtx.lineWidth=SIZE*0.01;
			helperCtx.arc(...(ButtonHandler.mouse),SIZE*0.04,0,Math.PI*2);
			helperCtx.stroke();
		}
		
		helperCtx.font=(SIZE*0.12)+"px Arial";
		helperCtx.fillStyle="black";
		helperCtx.textBaseline="top";
		helperCtx.textAlign="center";
		helperCtx.fillText("Hit-test Canvas",SIZE*0.5,SIZE*0.35);

	}
	
	static onMouseMove(event){
		if(event!=null){
			ButtonHandler.mouse=getMouseLocation(event);
		}
		let ctx=ButtonHandler.helperCanvas.getContext("2d");
		let color=getColor(ctx,ButtonHandler.mouse);
		let result=ButtonHandler.handleButtonHover(color);
		if(result){
			ButtonHandler.canvas.style.cursor="pointer";
		}else{
			ButtonHandler.canvas.style.cursor="auto";
		}
		ctx=ButtonHandler.canvas.getContext("2d");
	}
	
	static onMouseDown(event){
		ButtonHandler.mouse=getMouseLocation(event);
		let ctx=ButtonHandler.helperCanvas.getContext("2d");
		let color=getColor(ctx,ButtonHandler.mouse);
		ButtonHandler.handleButtonDown(color);
		
		ctx=ButtonHandler.canvas.getContext("2d");
		
	}
	
	static onMouseUp(event){
		ButtonHandler.mouse=getMouseLocation(event);
		let ctx=ButtonHandler.helperCanvas.getContext("2d");
		let color=getColor(ctx,ButtonHandler.mouse);
		ButtonHandler.handleButtonUp(color);

		ctx=ButtonHandler.canvas.getContext("2d");
	}

	static handleButtonHover(color){
		let isOnTop=false;
		for(let i=0;i<ButtonHandler.buttons.length;i++){
			if(ButtonHandler.buttons[i].color==color){
				ButtonHandler.buttons[i].hover=true;
				isOnTop=true;
			}else{
				ButtonHandler.buttons[i].hover=false;
			}
		}
		return isOnTop;
	}

	static handleButtonDown(color){
		for(let i=0;i<ButtonHandler.buttons.length;i++){
			if(ButtonHandler.buttons[i].color==color){
				ButtonHandler.buttons[i].down=true;
				ButtonHandler.buttons[i].properties.callback(
					ButtonHandler.buttons[i].properties.freq
				);
			}else{
				ButtonHandler.buttons[i].down=false;
			}
		}
	}
	
	static handleButtonUp(color){
		for(let i=0;i<ButtonHandler.buttons.length;i++){
			ButtonHandler.buttons[i].down=false;
		}
	}
}

class Button{
	constructor(location,width,height,name,callback,properties){
		this.location=location;
		this.width=width;
		this.height=height;
		this.name=name;
		this.color=getRandomColor();
		this.hover=false;
		this.down=false;
		this.callback=callback;
		this.properties=properties;
	}
	
	draw(ctx){
		ctx.save();
		ctx.translate(...this.location);
		ctx.beginPath();
		ctx.strokeStyle=this.properties.strokeStyle;
		if(this.down==true){
			ctx.fillStyle=this.properties.downColor;
		}else{
			if(this.hover==false){
				ctx.fillStyle=this.properties.defaultColor;
			}else{
				ctx.fillStyle=this.properties.hoverColor;
			}
		}
		ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
		ctx.fill();
		ctx.stroke();
		ctx.font=(this.height*0.5)+"px Arial";
		ctx.fillStyle="black";
		ctx.textBaseline="middle";
		ctx.textAlign="center";
		ctx.fillText(this.name,0,0);
		ctx.restore();
	}
	
	drawHitbox(ctx){
		ctx.save();
		ctx.translate(...this.location);
		ctx.beginPath();
		ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
		ctx.fillStyle=this.color;
		ctx.fill();
		ctx.restore();
	}
}


class PianoKeyButton extends Button{
	constructor(name,location,width,height,color,options){
		super(name,location,width,height,color,options);
	}
	draw(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle="black";
		ctx.lineWidth=3;
		ctx.fillStyle="white";
		if(this.hover){
			ctx.fillStyle="gray";
		}
		if(this.down){
			ctx.fillStyle="red";
		}
		ctx.translate(this.location[0],this.location[1]);
		//ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
		ctx.moveTo(-this.width/2,-this.height/2);
		ctx.lineTo(-this.width/2,+this.height/2);
		ctx.arc(0,+this.height/2,this.width/2,0,Math.PI);
		ctx.lineTo(+this.width/2,+this.height/2);
		ctx.lineTo(+this.width/2,-this.height/2);
		ctx.closePath();
		
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.font=(this.width*0.5)+"px Arial";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.fillText(this.name,0,0);
		ctx.restore();
	}
	
	drawHitArea(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.translate(this.location[0],this.location[1]);
		ctx.moveTo(-this.width/2,-this.height/2);
		ctx.lineTo(-this.width/2,+this.height/2);
		ctx.arc(0,+this.height/2,this.width/2,0,Math.PI);
		ctx.lineTo(+this.width/2,+this.height/2);
		ctx.lineTo(+this.width/2,-this.height/2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
}


function formatPixelFromArray(arr){
	return "rgb("+arr[0]+","+arr[1]+","+arr[2]+")";
}

function getRandomColor(){
	let red=Math.floor(Math.random()*255);
	let green=Math.floor(Math.random()*255);
	let blue=Math.floor(Math.random()*255);
	return "rgb("+red+","+green+","+blue+")";
}

function getColor(ctx,location){
	let data=ctx.getImageData(...location,1,1).data;
	return "rgb("+data[0]+","+data[1]+","+data[2]+")";
}