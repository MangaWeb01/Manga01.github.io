const noButton = document.getElementById('no-button');
const yesButton = document.getElementById('yes-button');
const playMusicButton = document.getElementById('play-music');
const backgroundMusic = document.getElementById('background-music');

playMusicButton.addEventListener('click', () => {
    backgroundMusic.play();
    playMusicButton.style.display = 'none'; // Hide the button after clicking
});

noButton.addEventListener('mouseover', () => {
    const randomX = Math.random() * (window.innerWidth - noButton.offsetWidth);
    const randomY = Math.random() * (window.innerHeight - noButton.offsetHeight);
    
    noButton.style.position = 'absolute';
    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;
});

yesButton.addEventListener('click', () => {
    localStorage.setItem('musicTime', backgroundMusic.currentTime);
    backgroundMusic.pause(); // Pause the music before redirecting
    window.location.href = 'second.html'; // Redirect to the second page
});