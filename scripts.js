document.getElementById('play-btn').addEventListener('click', startGame);

const gameScreen = document.getElementById('game-screen');
const cursorLight = document.getElementById('cursor-light');
const player = document.getElementById('player');
const maze = document.getElementById('maze');
const jumpscare = document.getElementById('jumpscare');
const timerDisplay = document.getElementById('timer');
const livesContainer = document.getElementById('lives');

let timer;
let timeLeft = 300; // 2 minutes
let lives = 3; // Player starts with 3 lives
let playerX = 50, playerY = 50; // Player start position
let cellSize = 40;
let isColliding = false; // Prevent multiple life losses on one touch
let stepSize = 10;

// Maze layout (1 = wall, 0 = path)
const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
];
const bgMusic = new Audio('bg.mp3');
bgMusic.loop = true; // Loop background music
bgMusic.volume = 0.5; // Adjust volume

const chaseMusic = new Audio('chase.mp3');
chaseMusic.loop = true; // Loop the chase music
chaseMusic.volume = 0; 
const chaseRadius = 200;


const jumpscareSound = new Audio('jumpscare.mp3');
jumpscareSound.volume = 1.0; 

let fadeOutInterval = null; // Track the fade out interval
let enemies = [
    { id: 'enemy1', x: 0, y: 0 },
    { id: 'enemy2', x: 0, y: 0 },
    { id: 'enemy3', x: 0, y: 0 }
];
const enemyStepSize = 3; // Smaller step size for the enemy
const enemyVisibilityRadius = 100; 

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    gameScreen.style.display = 'block';

    bgMusic.play(); // Start background music

    renderMaze();
    startTimer();
    updateLivesDisplay();
    updatePlayerPosition();
    document.addEventListener('keydown', movePlayer);

    // Initialize enemy positions
    enemies.forEach(enemy => placeEnemyRandomly(enemy));

    // Move enemies every 100ms
    setInterval(() => enemies.forEach(moveEnemy), 100);
}

function findShortestPath(startX, startY, targetX, targetY) {
    const queue = [{ x: startX, y: startY, path: [] }];
    const visited = new Set();

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();

        // If the target is reached, return the path
        if (x === targetX && y === targetY) {
            return path;
        }

        // Mark the current cell as visited
        visited.add(`${x},${y}`);

        // Explore neighboring cells (up, down, left, right)
        const directions = [
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 }   // Down
        ];

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;

            // Check if the new position is valid and not visited
            if (
                mazeLayout[newY] && mazeLayout[newY][newX] === 0 && // Valid path
                !visited.has(`${newX},${newY}`) // Not visited
            ) {
                queue.push({ x: newX, y: newY, path: [...path, { x: newX, y: newY }] });
            }
        }
    }

    return null; // No path found
}
function fadeInAudio(audio) {
    if (fadeOutInterval) {
        clearInterval(fadeOutInterval); // Clear any existing fade out interval
        fadeOutInterval = null; // Reset the interval variable
    }
    const fadeInterval = setInterval(() => {
        if (audio.volume < 0.5) { // Target volume (adjust as needed)
            audio.volume += 0.05; // Increment volume
        } else {
            clearInterval(fadeInterval); // Stop fading when target volume is reached
        }
    }, 100); // Adjust fade speed
}

function fadeOutAudio(audio) {
    if (fadeOutInterval) {
        clearInterval(fadeOutInterval); // Clear any existing fade out interval
    }
    fadeOutInterval = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume -= 0.05; // Decrement volume
        } else {
            clearInterval(fadeOutInterval); // Stop fading when volume is 0
            fadeOutInterval = null; // Reset the interval variable
        }
    }, 100); // Adjust fade speed
}
function placeEnemyRandomly(enemy) {
    let validPositions = [];

    // Find all valid positions (0s in the maze layout)
    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            if (mazeLayout[row][col] === 0) {
                validPositions.push({ x: col * cellSize, y: row * cellSize });
            }
        }
    }

    // Pick a random valid position
    let randomPos = validPositions[Math.floor(Math.random() * validPositions.length)];
    enemy.x = randomPos.x;
    enemy.y = randomPos.y;

    // Update enemy position on the screen
    document.getElementById(enemy.id).style.left = enemy.x + 'px';
    document.getElementById(enemy.id).style.top = enemy.y + 'px';
}
function moveEnemy(enemy) {
    const distanceToPlayer = Math.sqrt((playerX - enemy.x) ** 2 + (playerY - enemy.y) ** 2);

    if (distanceToPlayer <= 300) {
        // Move closer to the player
        const directions = [
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 }    // Down
        ];

        let bestMove = null;
        let bestDistance = distanceToPlayer;

        // Find the best move that reduces the distance to the player
        for (const dir of directions) {
            const newX = enemy.x + dir.dx * enemyStepSize;
            const newY = enemy.y + dir.dy * enemyStepSize;
            const col = Math.floor(newX / cellSize);
            const row = Math.floor(newY / cellSize);

            if (mazeLayout[row] && mazeLayout[row][col] === 0) {
                const newDistance = Math.sqrt((playerX - newX) ** 2 + (playerY - newY) ** 2);
                if (newDistance < bestDistance) {
                    bestDistance = newDistance;
                    bestMove = { x: newX, y: newY };
                }
            }
        }

        if (bestMove) {
            enemy.x = bestMove.x;
            enemy.y = bestMove.y;
        }
    } else {
        // Move randomly
        const directions = [
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 }   // Down
        ];

        let possibleMoves = directions.filter(dir => {
            const newX = enemy.x + dir.dx * enemyStepSize;
            const newY = enemy.y + dir.dy * enemyStepSize;
            const col = Math.floor(newX / cellSize);
            const row = Math.floor(newY / cellSize);
            return mazeLayout[row] && mazeLayout[row][col] === 0;
        });

        if (possibleMoves.length > 0) {
            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            enemy.x += move.dx * enemyStepSize;
            enemy.y += move.dy * enemyStepSize;
        }
    }

    // Update enemy position on the screen
    document.getElementById(enemy.id).style.left = enemy.x + 'px';
    document.getElementById(enemy.id).style.top = enemy.y + 'px';

    checkCollision(enemy);
    updateEnemyVisibility(enemy);
}


function checkCollision(enemy) {
    const distance = Math.sqrt((playerX - enemy.x) ** 2 + (playerY - enemy.y) ** 2);
    if (distance < 10) { // Collision detection threshold
        lives--;

        // Show jumpscare image
        jumpscare.style.display = 'block';
        jumpscare.style.opacity = '1';

        // Play jumpscare sound
        jumpscareSound.currentTime = 2.5; // Reset to start
        jumpscareSound.play();

        setTimeout(() => {
            jumpscare.style.display = 'none'; // Hide image
            isColliding = false;
        }, 1000); // Adjust timing as needed

        updateLivesDisplay();

        if (lives <= 0) {
            setTimeout(() => {
                alert('Game Over!');
                location.reload();
            }, 500);
        }
    }
}
function renderMaze() {
    maze.innerHTML = '';
    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            if (mazeLayout[row][col] === 1) {
                let wall = document.createElement('div');
                wall.classList.add('wall');
                wall.style.width = `${cellSize}px`;
                wall.style.height = `${cellSize}px`;
                wall.style.left = `${col * cellSize}px`;
                wall.style.top = `${row * cellSize}px`;
                maze.appendChild(wall);
            } else if (mazeLayout[row][col] === 2) { // Render the goal
                let goal = document.createElement('div');
                goal.classList.add('goal');
                goal.style.width = `${cellSize}px`;
                goal.style.height = `${cellSize}px`;
                goal.style.left = `${col * cellSize}px`;
                goal.style.top = `${row * cellSize}px`;
                goal.style.backgroundColor = 'green'; // Set the color of the goal
                maze.appendChild(goal);
            }
        }
    }
}

let isChaseMusicPlaying = false;

function updateEnemyVisibility(enemy) {
    const enemyElement = document.getElementById(enemy.id);
    const distance = Math.sqrt((playerX - enemy.x) ** 2 + (playerY - enemy.y) ** 2);

    // Update enemy visibility
    if (distance <= enemyVisibilityRadius) {
        enemyElement.style.opacity = 1; // Make enemy visible
    } else {
        enemyElement.style.opacity = 0; // Make enemy invisible
    }

    // Check if any enemy is within the chase radius
    let anyEnemyInRange = enemies.some(e => {
        const dist = Math.sqrt((playerX - e.x) ** 2 + (playerY - e.y) ** 2);
        return dist <= chaseRadius;
    });

    // Manage chase music
    if (anyEnemyInRange) {
        if (chaseMusic.paused) {
            console.log("Starting chase music"); // Debugging
            chaseMusic.currentTime = 0; // Reset music to start
            chaseMusic.volume = 0; // Start with volume 0
            chaseMusic.play(); // Start playing the chase music
        }
        // Cancel any active fade out
        if (fadeOutInterval) {
            clearInterval(fadeOutInterval);
            fadeOutInterval = null;
        }
        fadeInAudio(chaseMusic); // Fade in the chase music
    } else {
        fadeOutAudio(chaseMusic); // Fade out the chase music
    }
}
function startTimer() {
    function updateTimerDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateTimerDisplay(); // Initial update

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Time is up! Game Over.');
            location.reload();
        }
        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function movePlayer(event) {
    let newX = playerX;
    let newY = playerY;

    if (event.key === 'ArrowUp') newY -= stepSize;
    if (event.key === 'ArrowDown') newY += stepSize;
    if (event.key === 'ArrowLeft') newX -= stepSize;
    if (event.key === 'ArrowRight') newX += stepSize;

    if (!isWall(newX, newY)) {
        playerX = newX;
        playerY = newY;

        // Check for goal collision
        if (isGoal(newX, newY)) {
            window.location.href = 'helo.html'; // Redirect to hello.html
        }
    } else {
        loseLife();
    }

    updatePlayerPosition();
}

function isGoal(x, y) {
    let col = Math.floor(x / cellSize);
    let row = Math.floor(y / cellSize);
    return mazeLayout[row] && mazeLayout[row][col] === 2; // Check if the position is a goal
}

function isWall(x, y) {
    let col = Math.floor(x / cellSize);
    let row = Math.floor(y / cellSize);
    return mazeLayout[row] && mazeLayout[row][col] === 1;
}


function loseLife() {
    if (!isColliding) {
        isColliding = true;
        lives--;

        // Show jumpscare image
        jumpscare.style.display = 'block';
        jumpscare.style.opacity = '1';

        // Play jumpscare sound
        jumpscareSound.currentTime = 2.5; // Reset to start
        jumpscareSound.play();

        setTimeout(() => {
            jumpscare.style.display = 'none'; // Hide image
            isColliding = false;
        }, 1000); // Adjust timing as needed

        updateLivesDisplay();

        if (lives <= 0) {
            setTimeout(() => {
                alert('Game Over!');
                location.reload();
            }, 500);
        }
    }
}


function updateLivesDisplay() {
    livesContainer.innerHTML = '❤️'.repeat(lives);
}

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
    cursorLight.style.left = `${playerX - 75}px`;
    cursorLight.style.top = `${playerY - 75}px`;
}
