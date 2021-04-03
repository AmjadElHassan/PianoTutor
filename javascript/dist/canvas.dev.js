"use strict";

var size = 500; //using this makes our script incredibly more modular

var canvasPiano;

function main() {
  //this will load all our components
  removeOverlay();
  canvasPiano = initializeCanvas("canvasPiano", size, size * 0.85);
  drawScene();
}

function drawScene() {
  var canvas = document.getElementById('canvasPiano');
  var ctx = canvas.getContext('2d'); //contains all the methods to draw on our canvas

  ctx.beginPath();
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, size, size);
  drawHouse(ctx, [size * 0.5, size]); //x begins at center, y begins at bottom
}

function drawHouse(ctx, location) {
  ctx.lineWidth = 10;
  ctx.beginPath();
}

function initializeCanvas(canvasName, width, height) {
  //an automatic way to create a canvas with specific specs
  var canvas = document.getElementById(canvasName);
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function removeOverlay() {
  //when activated, will remove out overlay from the canvas
  var element = document.getElementById('overlay');
  element.style.display = "none";
}