function setup() {
    createCanvas(windowWidth, windowHeight)
    background('#fbf8f3')
  }
  
  function draw() {
    if (mouseIsPressed) {
      pen()
    }
  }
  
  function pen() {
    // set the color and weight of the stroke 
    stroke(0, 0, 0, 255)
    strokeWeight(2)
    
    // draw a line from current mouse point to previous mouse point
    line(mouseX, mouseY, pmouseX, pmouseY)
  }