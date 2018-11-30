/*Broderick Lemke, 2018 */

var w = 700;
var h = 700;

var scaleFac = 12; //scaleFac for each box

var grid = [];

var numX;
var numY;

var on = true;


var initialState; //used with mouse clicking and dragging



function setup() {
  //Set up the canvas
  numX = floor(w/scaleFac);
  numY = floor(h/scaleFac);

  var canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');
  background(50);

  noStroke();

  frameRate(20);

  //Create a grid array based on the size of the canvas and
  for (var i = 0; i < numX; i++) {
    for (var j = 0; j < numY; j++) {
      var value = floor(random(0,2));

      //Create the space with a custom constructor
      var newestSpace = new space(i,j,value);

      //push the space into a grid array
      grid.push(newestSpace);
    }
  }

}


function draw() {
    //To do each frame:
    background(50);


    for (var i = 0; i < grid.length; i++){
        //Calculate the color of the square and update it
          grid[i].changeCol();
          grid[i].show();
        }
    if (on) {
      for (var i = 0; i < grid.length; i++) {
        //If the program is running, check the neighbors to see if this cell will live or die next generation
        grid[i].checkNeighbor(i);
      }

      for (var i = 0; i < grid.length; i++) {
        //Update the value of this cell for the next generation
        grid[i].updateValue();
      }
    }

}

function space(x, y, value){
  this.x = x * scaleFac;
  this.y = y * scaleFac;
  this.value = value;
  this.nextValue;
  this.col;

  this.changeCol = function(){
    if (this.value == 1){
      this.col = 255;
    } else if (this.value == 0){
      this.col = 10;
    } else {
        //If a pixel isn't a 1 or a 0, turn red for testing and output it's value into the console
      console.log(this.value)
      this.col = color(255, 0, 0);
    }
  }

  this.show = function(){
    noStroke();
    //Draw this cell
    fill(this.col);
    rect(this.x, this.y, scaleFac - 2 , scaleFac -2);
  }

  this.checkNeighbor = function(i){
    var neighborCount = 0; //start at 0, go up for each neighborCount
    var colNum = floor(i % numX); //
    var rowNum = floor(i / numX); //



    //top left neighborCount

    if (colNum != 0 && rowNum != 0){
      if (grid[i-1-numY].value == 1){
        neighborCount++;
      }
    }
    //upper neighborCount
    if (rowNum != 0){
      if (grid[i-numY].value ==1){
        neighborCount++;
      }
    }
    //top right neighborCount
    if (colNum != numX-1 && rowNum != 0){
      if (grid[i+1-numY].value == 1){
        neighborCount++;
      }
    }

    //right neighborCount
    if (colNum != numX-1){
      if (grid[i+1].value == 1){
        neighborCount++;
      }
    }

    //bottom right neighborCount
    if (colNum != numX-1 && rowNum != numY-1 ){
      if (grid[i+numY+1].value == 1){
        neighborCount++;
      }
    }


    //bottom neighborCount
    if (rowNum != numY-1){
      if (grid[i+numY].value ==1){
        neighborCount++;
      }
    }

    //bottom left neighborCount
    if (colNum != 0 && rowNum != numY-1){
      if (grid[i-1+numY].value == 1){
        neighborCount++;
      }
    }

    //left neighborCount
    if (colNum != 0){
      if (grid[i-1].value == 1){
        neighborCount++;
      }
    }


  //  console.log(i + " " + this.nextValue + " " + this.value + " " + this.col + " " + rowNum + " " + colNum + " " + neighborCount);

    //check rules
    if (neighborCount < 2 || neighborCount > 3){ //over population and underpop
      this.nextValue = 0;
    } else if ((neighborCount == 2 || neighborCount == 3) && this.value==1) { //next generation
      this.nextValue = 1;
    } else if (neighborCount == 3 && this.value == 0){ //reproduction
      this.nextValue = 1;
    } else if (neighborCount > 3 && this.value == 1){
      this.nextValue = 0;
    } else if (neighborCount < 3 || neighborCount > 3) {
      this.nextValue = 0;
    }
  }

  this.updateValue = function(){
    this.value = this.nextValue;
  }
}

function pause(){
  //turn on or off the checking of neighbors and updating
  if (on){
    on = false;
  } else {
    on = true;
  }
}

function clearAll(){
  //clears out every grid
  for (var i = 0; i < grid.length; i++) {
    grid[i].value = 0;
    grid[i].show();
  }
}

function randomizeValues(){
  //sets all spaces to a new random value
  for (var i = 0; i < grid.length; i++) {
    grid[i].value = floor(random(0,2));
    grid[i].show();
  }
}

function mouseClicked() {
  //If the mouse is clicked, get the location

  var curX = mouseX;
  var curY = mouseY;

  if (curX <= w && curY <= h){
    //if it is within the canvas,
    gridX = floor(curX/scaleFac);
    gridY = floor(curY/scaleFac);

    i = (gridX * numY) + gridY;
    //Find the cell where it is and flip its value.
    if (i<grid.length) {
      initialState = grid[i].value;
      if (grid[i].value==1){
        grid[i].value = 0;
      } else {
        grid[i].value = 1;
      }
    }
  }
}


function mouseDragged() {
  //If the mouse is clicked and dragged through cells, get their location and change them.
  var curX = mouseX;
  var curY = mouseY;

  if (curX <= w && curY <= h){
    //If in the canvas
    gridX = floor(curX/scaleFac);
    gridY = floor(curY/scaleFac);

    i = (gridX * numY) + gridY;

    if (i<grid.length) {
      //Find the cell where it is and flip its value.
      if (initialState == 1 && grid[i].value==1){
        grid[i].value = 0;
      } else if (initialState == 0 && grid[i].value ==0) {
        grid[i].value = 1;
      }
    }
  }

}

function glider(){
  //Create a glider for testing purposes
    var xs = [3, 3, 4, 4, 5];
    var ys = [0, 2, 1, 2, 1]
    for (var i = 0; i < xs.length; i++) {
          j = (xs[i] * numY) + ys[i];
          grid[j].value = 1;
    }

}
