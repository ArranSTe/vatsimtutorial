const video = document.getElementById('myVideo');
const videoContainer = video.parentElement;
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const volumeBar = document.getElementById('volumeBar');
const muteBtn = document.getElementById('muteBtn');
const loadingSpinner = document.querySelector('.loading-spinner');

let volumeBeforeMute = 1;
let controlsTimeout;

// --- Event Listeners ---

playPauseBtn.addEventListener('click', togglePlayPause);
video.addEventListener('click', togglePlayPause);

video.addEventListener('timeupdate', updateProgress);

video.addEventListener('loadedmetadata', updateDuration);

progressBar.addEventListener('input', seekVideo);

volumeBar.addEventListener('input', updateVolume);

muteBtn.addEventListener('click', toggleMute);

fullscreenBtn.addEventListener('click', toggleFullscreen);

videoContainer.addEventListener('mousemove', showControls);
videoContainer.addEventListener('mouseleave', hideControls);
controls.addEventListener('mouseenter', () => clearTimeout(controlsTimeout));

video.addEventListener('waiting', showLoadingSpinner);
video.addEventListener('playing', hideLoadingSpinner);
video.addEventListener('canplay', hideLoadingSpinner);

video.addEventListener('ended', () => {
    // Change icon back to play when video ends
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// --- Functions ---

function togglePlayPause() {
    if (video.paused || video.ended) {
        video.play();
        // Change icon to pause
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        // Change icon to play
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function updateProgress() {
    const currentTime = video.currentTime;
    const duration = video.duration;

    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
    }

    currentTimeSpan.textContent = formatTime(currentTime);
}

function updateDuration() {
    durationSpan.textContent = formatTime(video.duration);
}

function seekVideo() {
    const seekTime = (progressBar.value / 100) * video.duration;
    video.currentTime = seekTime;
}

function updateVolume() {
    video.volume = volumeBar.value / 100;

    // Update mute button icon based on volume level
    if (video.volume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (video.volume < 0.5) {
        muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    }
    else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    volumeBeforeMute = video.volume;
}

function toggleMute() {
    if (video.muted) {
        video.muted = false;
        // Restore volume to the level before muting
        video.volume = volumeBeforeMute;
        volumeBar.value = volumeBeforeMute * 100;
        // Update icon based on restored volume
        updateVolume(); // Call updateVolume to set the correct icon
    } else {
        video.muted = true;
        // Store the current volume before muting
        volumeBeforeMute = video.volume;
        video.volume = 0;
        volumeBar.value = 0;
        // Change icon to mute
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) {
            videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
         // Change icon to minimize/compress
         fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        // Change icon back to expand
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    return `${minutes}:${formattedSeconds}`;
}

function showControls() {
    videoContainer.classList.add('show-controls');
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(hideControls, 3000);
}

function hideControls() {
    if (!video.paused && !videoContainer.matches(':hover')) {
         videoContainer.classList.remove('show-controls');
    }
}

function showLoadingSpinner() {
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}

// Initial setup: Set initial volume and update UI
video.volume = volumeBar.value / 100;
updateVolume(); // Update the mute button icon based on initial volume