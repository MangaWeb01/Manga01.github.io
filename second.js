document.getElementById('call-sign-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    const selectedCallSign = document.querySelector('input[name="callSign"]:checked');
    const customCallSign = document.getElementById('custom-call-sign').value;

    if (selectedCallSign) {
        alert(`You selected: ${selectedCallSign.value}`);
    }
    
    if (customCallSign) {
        alert(`Your custom call sign: ${customCallSign}`);
    }

    // Redirect to the contract page
    window.location.href = 'contract.html';
});

const backgroundMusic = document.getElementById('background-music');
const musicTime = localStorage.getItem('musicTime');

if (musicTime) {
    backgroundMusic.currentTime = parseFloat(musicTime);
    backgroundMusic.play(); // Start playing the music from the saved time
}