const songList = document.getElementById('song-list');
const queueList = document.getElementById('queue-list');
const dropArea = document.getElementById('drop-area');
const audioPlayer = document.getElementById('audio-player');

const playPauseBtn = document.getElementById('play-pause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const clearQueueBtn = document.getElementById('clear-queue');

const presetBtns = document.querySelectorAll('.preset-btn');
const speedSlider = document.getElementById('speed-slider');
const volumeSlider = document.getElementById('volume-slider');

const currentTrackDisplay = document.getElementById('current-track-display');

let queue = [];
let currentIndex = 0;
let isPlaying = false;

const presets = {
    preset1: ['song1.mp3', 'song3.mp3', 'song2.mp3'],
    preset2: ['song4.mp3', 'song2.mp3', 'song1.mp3'],
    preset3: ['song3.mp3', 'song4.mp3', 'song1.mp3']
};

// 再生速度変更
speedSlider.addEventListener('input', (e) => {
    audioPlayer.playbackRate = e.target.value;
});

// 音量変更
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

// ドラッグ＆ドロップとタッチ機能
function handleDragStart(e) {
    e.dataTransfer?.setData('text/plain', e.target.dataset.src);
}

function handleTouchStart(e) {
    if (!e.target.matches('li')) return;
    const touch = e.touches[0];
    e.target.dataset.dragging = 'true';
    e.target.dataset.touchX = touch.clientX;
    e.target.dataset.touchY = touch.clientY;
}

function handleTouchMove(e) {
    const element = document.querySelector('[data-dragging="true"]');
    if (!element) return;

    const touch = e.touches[0];
    element.style.position = 'absolute';
    element.style.left = `${touch.clientX}px`;
    element.style.top = `${touch.clientY}px`;
}

function handleTouchEnd(e) {
    const element = document.querySelector('[data-dragging="true"]');
    if (element) {
        const touch = e.changedTouches[0];
        const dropAreaRect = dropArea.getBoundingClientRect();

        if (
            touch.clientX >= dropAreaRect.left &&
            touch.clientX <= dropAreaRect.right &&
            touch.clientY >= dropAreaRect.top &&
            touch.clientY <= dropAreaRect.bottom
        ) {
            const songSrc = element.dataset.src;
            addToQueue(songSrc);
        }

        element.removeAttribute('data-dragging');
        element.style.position = '';
    }
}

songList.addEventListener('dragstart', handleDragStart);
songList.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

dropArea.addEventListener('dragover', (e) => e.preventDefault());
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const songSrc = e.dataTransfer.getData('text/plain');
    addToQueue(songSrc);
});

// キューに追加
function addToQueue(songSrc) {
    const newTrack = document.createElement('li');
    newTrack.textContent = songSrc.split('/').pop();
    newTrack.dataset.src = songSrc;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => removeFromQueue(newTrack));

    newTrack.appendChild(deleteBtn);
    queueList.appendChild(newTrack);

    queue.push(songSrc);

    if (!isPlaying) {
        playTrack(0);
    }
}

// トラック再生
function playTrack(index) {
    if (queue[index]) {
        audioPlayer.src = queue[index];
        audioPlayer.play();
        isPlaying = true;
        currentIndex = index;
        currentTrackDisplay.textContent = `再生中: ${queue[index].split('/').pop()}`;
        highlightCurrentTrack();
    }
}

// 再生中の曲をハイライト表示
function highlightCurrentTrack() {
    Array.from(queueList.children).forEach((track, index) => {
        if (index === currentIndex) {
            track.style.backgroundColor = '#ffeb3b';
        } else {
            track.style.backgroundColor = '';
        }
    });
}

audioPlayer.addEventListener('ended', () => {
    if (currentIndex < queue.length - 1) {
        setTimeout(() => playTrack(currentIndex + 1), 4000);
    } else {
        isPlaying = false;
    }
});

function removeFromQueue(trackElement) {
    const indexToRemove = Array.from(queueList.children).indexOf(trackElement);
    queue.splice(indexToRemove, 1);
    trackElement.remove();

    if (indexToRemove === currentIndex) {
        if (queue[currentIndex]) {
            playTrack(currentIndex);
        } else if (queue.length > 0) {
            playTrack(currentIndex - 1);
        } else {
            audioPlayer.pause();
            isPlaying = false;
            currentTrackDisplay.textContent = '';
        }
    } else if (indexToRemove < currentIndex) {
        currentIndex--;
    }
    highlightCurrentTrack();
}

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedPreset = btn.dataset.preset;
        if (presets[selectedPreset]) {
            queue = [...presets[selectedPreset]];
            queueList.innerHTML = '';
            queue.forEach(songSrc => addToQueue(songSrc));
            playTrack(0);
        }
    });
});
