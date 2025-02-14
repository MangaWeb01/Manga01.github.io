let canvas;
let videoVisible = false;
const video = document.createElement('video');
let isDrawing = false; // Flag to track if the user is drawing

function setup() {
    canvas = createCanvas(500, 200); // Set canvas size
    canvas.parent('signature-canvas'); // Attach canvas to the div
    background('#fbf8f3'); // Set background color

    // Add event listener for the clear button
    const clearButton = document.querySelector('.clear-button');
    clearButton.addEventListener('click', clearCanvas);

    // Add event listener for the submit button
    const submitButton = document.querySelector('.submit-button');
    submitButton.addEventListener('click', handleSubmit);

    // Set up the video
    video.src = 'mini.mp4';
    video.loop = true;
    video.style.position = 'fixed';
    video.style.top = '20px';
    video.style.left = '20px';
    video.style.width = '400px'; // Adjust size as needed
    video.style.display = 'none'; // Initially hidden
    document.body.appendChild(video);

    // Add mousePressed event to the canvas
    canvas.mousePressed(startDrawing);
    canvas.mouseReleased(stopDrawing);
}

function draw() {
    if (isDrawing) {
        pen();
    }
}

function startDrawing() {
    isDrawing = true; // Set the flag to true when drawing starts
    if (!videoVisible) {
        video.style.display = 'block';
        video.play();
        videoVisible = true;
    }
}

function stopDrawing() {
    isDrawing = false; // Reset the flag when the mouse is released
}

function pen() {
    stroke(0); // Set stroke color to black
    strokeWeight(2); // Set stroke weight
    line(mouseX, mouseY, pmouseX, pmouseY); // Draw line from previous to current mouse position
}

function clearCanvas() {
    background('#fbf8f3'); // Reset the background color
    video.style.display = 'none';
    video.pause();
    videoVisible = false;
    isDrawing = false; // Reset drawing flag when clearing the canvas
}

function handleSubmit(event) {
    event.preventDefault(); // Prevent form submission

    // Show the image and text
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <h1 style="color: #ff69b4; font-size: 3em;">You're mine now!</h1>
            <img src="point.jpg" alt="Point" style="width: 300px; height: auto;">
        </div>
    `;
    document.body.appendChild(popup);

    // Add confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0 }
    });
}