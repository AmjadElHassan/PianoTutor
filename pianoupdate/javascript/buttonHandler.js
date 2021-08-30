var size = 800//this will decide the length and width for each of my canvases. I will also use fractions of this variable to size my actual buttons within my canvas
let canvas//canvas A
let canvasB//canvas A
let hit_canvas//canvas B
let backgroundCanvas
let piano_canvas
let video = null
let background


let audio_Context

function main() {

    canvas = initializeCanvas('canvasA', size)//applies my size properties to my DOM canvas elements via their ID's
    piano_canvas = initializeCanvas('pianoCanvas', size)//hit Canvas is the canvas that will contain our colors
    canvasB = initializeCanvas('canvasB', size)//hit Canvas is the canvas that will contain our colors
    hit_canvas = initializeCanvas('hitCanvas', size)//hit Canvas is the canvas that will contain our colors
    backgroundCanvas = initializeCanvas("bgCanvas",size)

    backgroundCanvas.addEventListener("click",captureBackground)
    ButtonHandler.addEventListeners(canvasB)

    initializeCamera()
    let ctxA = canvas.getContext('2d')//this is necesarry to designate that you will draw 2d images on your canvas. you cannot draw anything on the canvas without declaring the context
    let ctxB = canvasB.getContext('2d')//this is necesarry to designate that you will draw 2d images on your canvas. you cannot draw anything on the canvas without declaring the context
    let ctxPiano = piano_canvas.getContext('2d')//this is necesarry to designate that you will draw 2d images on your canvas. you cannot draw anything on the canvas without declaring the context
    ButtonHandler.hitTestCanvas = hit_canvas
    ButtonHandler.createPianoKey("C", [size*0.081, size *0.129], 90, 200,
        { callback: playNote, freq: 261 })
    ButtonHandler.createPianoKey("D", [size*0.200, size *0.129], 90, 200,
        { callback: playNote, freq: 294 })
    ButtonHandler.createPianoKey("E", [size*0.319, size *0.129], 90, 200,
        { callback: playNote, freq: 327 })
    ButtonHandler.createPianoKey("F", [size*0.438, size *0.129], 90, 200,
        { callback: playNote, freq: 348 })
    ButtonHandler.createPianoKey("G", [size*0.557, size *0.129], 90, 200,
        { callback: playNote, freq: 392 })
    ButtonHandler.createPianoKey("A", [size*0.676, size *0.129], 90, 200,
        { callback: playNote, freq: 436 })
    ButtonHandler.createPianoKey("B", [size*0.795, size *0.129], 90, 200,
        { callback: playNote, freq: 490 })
    ButtonHandler.createPianoKey("C", [size*0.914, size *0.129], 90, 200,
        { callback: playNote, freq: 523 })
    // ButtonHandler.addEventListeners(canvas)//this will apply the eventlisteners to the buttons we draw onto a particular canvas. as u can see, we are applying it to variable:canvas which is canvasA
    setInterval(function(){
        drawScene(ctxA,ctxPiano,ctxB)
    },33)
    // animate(ctx)
}

function captureBackground(){
    background = canvas.getContext("2d").getImageData(0,0,size,size)
    let backgroundCtx = backgroundCanvas.getContext("2d")
    backgroundCtx.putImageData(background,0,0)

}

function drawScene(ctxA,ctxPiano,ctxB){
    if (video!==null){
        let min = Math.min(video.videoWidth, video.videoHeight)
        let sx = (video.videoWidth-min)/2
        let sy = (video.videoHeight-min)/2
        ctxA.drawImage(video,sx,sy,min,min,0,0,size,size)
    } else {
        // show loading
    }

    ButtonHandler.drawButtons(ctxPiano)

    if (background!=null){
        let aImgData = ctxA.getImageData(0,0,size,size)
        let diff = getDifference(background,aImgData)
        ctxB.putImageData(diff,0,0)
        ButtonHandler.pixelHitTest(diff)
    } else {
        let backgroundCtx = backgroundCanvas.getContext("2d")

        backgroundCtx.fillStyle = 'red' //setting new color for text
        backgroundCtx.font = size * 0.1  + "px Arial"//setting the font of my text
        backgroundCtx.textAlign = "center"//aligning text
        backgroundCtx.textBaseline = "middle"//aligning text

        backgroundCtx.fillText("NO BACKGROUND", size * 0.5, size * 0.1)
        backgroundCtx.fillStyle = 'black' //setting new color for text

        backgroundCtx.fillText("Click here to", size * 0.5, size * 0.4)
        backgroundCtx.fillText(" capture background", size * 0.5, size * 0.55)
        backgroundCtx.fillText("image", size * 0.5, size * 0.7)
        backgroundCtx.beginPath();
        backgroundCtx.lineWidth = 4;
        backgroundCtx.stroke()
    }
}
function getDifference(aImgData,bImgData){
    let diff_threshold = 70
    
    for (let y=0;y<aImgData.height;y++){
        for (let x=0;x<aImgData.width;x++){
            let aPixel = getPixelValue(aImgData.data,x,y)
            let bPixel = getPixelValue(bImgData.data,x,y)
            if (eculDistance(aPixel,bPixel)<diff_threshold){
                bImgData.data[(y*aImgData.width+x)*4+3]=0
            }
        }
    }
    return bImgData
}

function getPixelValue(data,x,y){
    return [
        data[(y*size+x)*4+0],
        data[(y*size+x)*4+1],
        data[(y*size+x)*4+2],
        data[(y*size+x)*4+3],
    ]
}

function eculDistance(a,b){
    let dist = 0
    for (let i=0;i<a.length;i++){
        dist+=(a[i]-b[i])*(a[i]-b[i])
    }
    return Math.sqrt(dist)
}



function playNote(freq) {
    if (audio_Context==null){
        audio_Context = new (AudioContext||webkitAudioContext||window.webkitAudioContext)()
    }

    let osc = audio_Context.createOscillator()
    osc.frequency.value = freq

    let gainNode = audio_Context.createGain()
    gainNode.gain.setValueAtTime(0.0, audio_Context.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.05, audio_Context.currentTime+0.05)
    gainNode.gain.linearRampToValueAtTime(0.0, audio_Context.currentTime+1.49)
    
    osc.frequency.linearRampToValueAtTime(freq, audio_Context.currentTime+1.49)
    osc.start(audio_Context.currentTime);
    osc.stop(audio_Context.currentTime+1.5)
    osc.connect(gainNode)
    gainNode.connect(audio_Context.destination)
}

function animate() {
    drawScene(canvas.getContext("2d"));
    window.requestAnimationFrame(animate);
}

// function drawScene(canvas) {
//     canvas.clearRect(0, 0, size, size)
//     ButtonHandler.drawButtons(canvas);//this will draw our buttons onto the canvas ctx, which is also canvas A
// }

function initializeCanvas(canvasName, size) {//this adjusts our canvas element's sizing
    let canvas = document.getElementById(canvasName)
    canvas.width = size;
    canvas.height = size;
    return canvas
}


class ButtonHandler {//this class keeps track of everything button related
    static mouse = [0, 0]
    static buttons = []//this will store the info for each button we create
    static textBoxes = []//this will store the infor for each textBox we create
    static hitTestCanvas;//set this static property as a means to reference our color canvas
    static textCanvas;//set this static property as a means to reference our text canvas
    //underneath this class is another class for producing buttons as an object with properties. you can see that I create buttons with certain properties then push them into
    //our buttons and textBoxes arrays to keep track of them
    static createTextbox(text, location, width, height) {
        ButtonHandler.textBoxes.push(new Button(text, location, width, height, 'white'))
    }
    static createButton(name, location, width, height, color,options) {
        ButtonHandler.buttons.push(new RectangleButton(name, location, width, height, color,options))
    }
    static createPianoKey(name, location, width, height, options) {
        ButtonHandler.buttons.push(new PianoKeyButton(name, location, width, height, randomizeColor(), options))
    }

    static addEventListeners(canvas) {//this function adds what our program does when mouse is moving and when you press down on a button
        canvas.addEventListener('mousedown', ButtonHandler.onMouseDown)//we cannot apply directly attatch the event listener to button1
        canvas.addEventListener('mousemove', ButtonHandler.onMouseMove)
        canvas.addEventListener('mouseup', ButtonHandler.onMouseUp)
    }
    
    static pixelHitTest(diff){
        let hitPixels = []
        for (let y=0; y<diff.height;y++){
            for (let x=0; x<diff.width;x++){
                let px=getPixelValue(diff.data,x,y)
                let alpha = diff.data[(y*diff.width+x)*4+3]
                if (alpha>0){
                    hitPixels.push([x,y])
                }
            }
        }

        let hitColorKeys = []
        let ctx = ButtonHandler.hitTestCanvas.getContext("2d")

        let imgData = ctx.getImageData(0,0,diff.width,diff.height)


        hitPixels.forEach(hitPixel=>{
            let px = getPixelValue(imgData.data,hitPixel[0],hitPixel[1])
            let color = formatPixelFromArray(px)
            // let color=getColor(ctx,hitPixel)
            hitColorKeys[color]=true
        })

        ButtonHandler.buttons.forEach(button=>{
            let buttonDown = button.down
            button.down=false

            if (hitColorKeys[button.color]===true){
                button.down=true;
                if (buttonDown){
                    return
                }
                button.options.callback(button.options.freq)
            }
        })

        markPixelLocations(ctx, hitPixels)
    }

    static onMouseDown(event) {//this is what will happen when you click the button
        console.log(ButtonHandler.buttons)
        let location = getMouseLocation(event)//getMouseLocation() returns the 1x1 pixel that our mouse is floating over. refer to this function which is defined at the bottom of this document
        let ctx = ButtonHandler.hitTestCanvas.getContext('2d')//I will add a context for this canvas because we want to interact with our color canvas
        // let cty = ButtonHandler.textCanvas.getContext('2d')//we will be applying the color from our color canvas, to our text canvas
        let theColor = getColor(ctx, location)//the get color function returns the color we are on from the location. refer to this function which is definder at the bottom of this page
        let button = ButtonHandler.isHovering(theColor);//a function that returns true, if our mouse is hovering over a color that is not white. function is definde dbelow
        if (button) {//if isHovering(theColor) returns true
            button.click()
            // ButtonHandler.buttons.forEach(x => {//for each of our buttons
            //     if (x.color == theColor) {//if the color of the button matches the color we are on
            //         ButtonHandler.textBoxes[0].name = x.color;//replace the name property in our textbox object with the color of that button
            //         ButtonHandler.drawText(cty)//apply that new name property of the text box onto Canvas C
            //     }
            // })
        }
    }

    static onMouseUp(event){
        ButtonHandler.buttons.forEach(button => button.down = false)
    }

    static onMouseMove(event) {//what happens when we move our mouse
        ButtonHandler.mouse = getMouseLocation(event)//gets our current mouse location (which will be on our Canvas A)
        let ctx = ButtonHandler.hitTestCanvas.getContext('2d')//gets the color from our color canvas
        //so to understand, canvas A and canvas B have the same dimensions, with the buttons in the same area
        //so we pull a particular position from canvas A (the point our mouse is on)
        //we then apply this location to canvas B and return the color that is being displayed on that particular point
        // console.log(ButtonHandler.mouse)
        let theColor = getColor(ctx, ButtonHandler.mouse)
        let button = ButtonHandler.isHovering(theColor);
        // console.log(theColor)//as we move our mouse, we will see the colors we are landing on being displayed in our console
        ButtonHandler.buttons.forEach(button => button.hover = false)
        if (button) {//if we are hovering over a button that is not white,
            button.hover = true
            canvas.style.cursor = 'pointer'//change the cursor style to a pointer
        } else {//otherwise
            canvas.style.cursor = 'auto'//default pointer
        }
    }

    static resetHoverStates() {
        ButtonHandler.buttons.forEach(button => button.hover = false)
    }

    static isHovering(color) {//this function does the color comparison
        let hoveredButton = ButtonHandler.buttons.filter(button => button.color === color)

        if (hoveredButton) {//if the color does not have these rgb values, which is the rgb values for white
            return hoveredButton[0]
        } else {
            return false//return false
        }

    }

    static drawButtons(canvas) {//this will handle automating our drawing of buttons
        ButtonHandler.buttons.forEach(x => x.draw(canvas))
        let hitCanvas = ButtonHandler.hitTestCanvas.getContext('2d')
        hitCanvas.clearRect(0, 0, size, size)
        ButtonHandler.buttons.forEach(x => {//then for each button in our buttons array
            x.drawHitArea(hitCanvas)//we draw each button using a different automated set of strokes on our canvas by useing the 'drawHitArea' method of our Button Class below
            //why do i do this? because, I want the same size and location of each button, but i want to apply their color properties here. so I needed to define
            //a new set of automaties instructions
            //if i were to use the simple x.draw() method, it would do what it does in canvas A,
            //which is to display the name of the button, not its color
        })
        hitCanvas.fillStyle = 'black' //setting new color for text
        hitCanvas.font = size * 0.1 + "px Arial"//setting the font of my text
        hitCanvas.textAlign = "center"//aligning text
        hitCanvas.textBaseline = "middle"//aligning text
        hitCanvas.fillText("Hit Test Canvas", size * 0.5, size * 0.1)//sets the text,x-coordinate,y-coordinate

        hitCanvas.beginPath();
        hitCanvas.lineWidth = 4;
        hitCanvas.arc(ButtonHandler.mouse[0], ButtonHandler.mouse[1], size * 0.04, 0, Math.PI * 2);
        hitCanvas.stroke()
    }

    static drawText(canvas) {//this is what we use to apply our new text onto our textbox, when we click a button
        ButtonHandler.textBoxes.forEach(x => x.draw(canvas))//for each textbox draw it onto our canvas parameter
    }
}

function markPixelLocations(ctx,locations){
    let imgData=ctx.getImageData(0,0,size,size)
    for (let i=0;i<locations.length;i++){
        let x=locations[i][0]
        let y = locations[i][1]
        imgData.data[(y*size+x)*4+0]=255
        imgData.data[(y*size+x)*4+1]=0
        imgData.data[(y*size+x)*4+2]=0
        imgData.data[(y*size+x)*4+3]=255
    }
    ctx.putImageData(imgData,0,0)
}

class RectangleButton {//this class will construct our buttons and textBoxes
    constructor(name, location, width, height, color,options) {//creates button objects that assigns properties based on the parameters
        this.name = name
        this.location = location
        this.width = width
        this.height = height
        this.color = color
        this.hover = false
        this.down = false
        this.options = options
    }
    click(){
        this.down = true
        this.options.callback(this.options.freq)
    }

    draw(ctx) {//these are the instructions for drawing a box
        ctx.save()//resets reference position. if we do not include this, everytime we draw, it will not "overwrite" our previous entries,
        //it will simply keep adding onto our canvas
        ctx.beginPath()//begining of a stroke
        ctx.strokeStyle = 'black'//colcor of our lines
        ctx.lineWidth = 5//line width of our strokes
        ctx.fillStyle = 'white'//defines how we fill the area within a shape
        if (this.hover === true) {
            ctx.fillStyle = 'gray'//defines how we fill the area within a shape
        }
        if (this.down === true) {
            ctx.fillStyle = 'red'//defines how we fill the area within a shape
        }
        ctx.translate(this.location[0], this.location[1])//location[0] is our x position, and location[1] is our y positon. these are properties of our button objects. this is the point we are beginnign our drawing
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)//creates a rectangles at our current point. the x begins to the left of our point at a length of half of our width. the y of our rectangle begins at half the height below our point. 
        //the total width is our width property, and our total height is our height property
        //why the fractions? I am telling to my program that I want the point I am at to be the exact center of my rectangle.
        //if you were to remove those fractions, it would build the same rectangle, but the current position you are at would be defined as the top-left corner of the rectangle.
        ctx.fill();//fill in the rectangle with the color
        ctx.stroke()//draw the lines of the rectangle
        ctx.beginPath()//begin a new path for text I want to add
        ctx.fillStyle = 'black' //setting new color for text
        ctx.font = this.height * 0.5 + "px Arial"//setting the font of my text
        ctx.textAlign = "center"//aligning text
        ctx.textBaseline = "middle"//aligning text
        ctx.fillText(this.name, 0, 0)//sets the text,x-coordinate,y-coordinate
        ctx.restore()//refers to our "save" method. this is the point to reset from 

    }


    drawHitArea(ctx) {
        ctx.save()//resets reference position
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.translate(this.location[0], this.location[1])//we must provide location as an array object of 2 items
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
        ctx.fill();
        ctx.restore()

    }
}

class PianoKeyButton extends RectangleButton{
    constructor(name, location, width, height, color,options){
        super(name, location, width, height, color,options)
    }
    draw(ctx) {//these are the instructions for drawing a box
        ctx.save()//resets reference position. if we do not include this, everytime we draw, it will not "overwrite" our previous entries,
        //it will simply keep adding onto our canvas
        ctx.beginPath()//begining of a stroke
        ctx.strokeStyle = 'black'//colcor of our lines
        ctx.lineWidth = 5//line width of our strokes
        ctx.fillStyle = 'white'//defines how we fill the area within a shape
        if (this.hover === true) {
            ctx.fillStyle = 'gray'//defines how we fill the area within a shape
        }
        if (this.down === true) {
            ctx.fillStyle = 'red'//defines how we fill the area within a shape
        }
        ctx.translate(this.location[0], this.location[1])//location[0] is our x position, and location[1] is our y positon. these are properties of our button objects. this is the point we are beginnign our drawing
        //ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)//creates a rectangles at our current point. the x begins to the left of our point at a length of half of our width. the y of our rectangle begins at half the height below our point. 
        ctx.moveTo(-this.width/2,-this.height/2);
        ctx.lineTo(-this.width/2,this.height/2);
        ctx.arc(0,this.height/2,this.width/2,0,Math.PI)
        ctx.lineTo(this.width/2,this.height/2);
        ctx.lineTo(this.width/2,-this.height/2);
        ctx.closePath();
        //the total width is our width property, and our total height is our height property
        //why the fractions? I am telling to my program that I want the point I am at to be the exact center of my rectangle.
        //if you were to remove those fractions, it would build the same rectangle, but the current position you are at would be defined as the top-left corner of the rectangle.
        ctx.stroke()//draw the lines of the rectangle
        ctx.fill();//fill in the rectangle with the color
        ctx.beginPath()//begin a new path for text I want to add
        ctx.fillStyle = 'black' //setting new color for text
        ctx.font = this.width * 0.5 + "px Arial"//setting the font of my text
        ctx.textAlign = "center"//aligning text
        ctx.textBaseline = "middle"//aligning text
        ctx.fillText(this.name, 0, 0)//sets the text,x-coordinate,y-coordinate
        ctx.restore()//refers to our "save" method. this is the point to reset from 

    }


    drawHitArea(ctx) {
        ctx.save()//resets reference position
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.translate(this.location[0], this.location[1])//we must provide location as an array object of 2 items
        ctx.moveTo(-this.width/2,-this.height/2);
        ctx.lineTo(-this.width/2,this.height/2);
        ctx.arc(0,this.height/2,this.width/2,0,Math.PI)
        ctx.lineTo(this.width/2,this.height/2);
        ctx.lineTo(this.width/2,-this.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore()

    }

}


function getMouseLocation(event) {
    var rect = event.target.getBoundingClientRect()
    var loc = [
        Math.floor(size * (event.clientX - rect.left) / (rect.right - rect.left)),//returns x-coordinates by subtracting total x of canvas from the leftmost edge of the button inside
        Math.floor(size * (event.clientY - rect.top) / (rect.bottom - rect.top))//same but with y
        //this is essentially setting the precedent of the top-left corner of my canvas being position 0,0 and bottom right corner = size,size
    ]
    return loc
}

function formatPixelFromArray(arr) {
    return `rgb(${arr[0]},${arr[1]},${arr[2]})`//what is returned is literally an array of [r,g,b]
}
function getColor(ctx, location) {
    var data = ctx.getImageData(location[0], location[1], 1, 1)//we want image data at our x and y of our cursor, and the area to be 1x1 pixel
    return `rgb(${data.data[0]},${data.data[1]},${data.data[2]})`//what is returned is literally an array of [r,g,b]
}
function randomizeColor() {
    return `rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`//what is returned is literally an array of [r,g,b]
}

function initializeCamera(){
	var promise=navigator.mediaDevices.getUserMedia({video:true});
	promise.then(function(signal){
		video=document.createElement("video");
		video.srcObject=signal;
		video.play();
	}).catch(function(err){
		alert("Camera Error");
	});
}