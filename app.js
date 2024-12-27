const container = document.querySelector('.container'),
mainVideo = container.querySelector('video'),
videoTimeLine = container.querySelector('.video-timeline'),
progressBar = container.querySelector('.progress-bar'),
volumeBtn = container.querySelector('.volume i'),
volumeSlider = container.querySelector('.left input'),
currentVideoTime = container.querySelector('.current-time'),
videoDuration = container.querySelector('.video-duration'),
skipForward = container.querySelector('.skip-forward i'),
skipBackward = container.querySelector('.skip-backward i'),
playPauseBtn = container.querySelector('.play-pause i'),
speedBtn = container.querySelector('.playback-speed span'),
speedOptions = container.querySelector('.speed-options'),
noteBtn = container.querySelector('.note-add span')
note = container.querySelector('.note')
picInPicBtn = container.querySelector('.pic-in-pic span'),
fullscreenBtn = container.querySelector('.fullscreen i');

let notes = []

function playPause(){
    if(mainVideo.paused){
        mainVideo.play()
        playPauseBtn.classList.replace('fa-play', 'fa-pause')
    }else{
        mainVideo.pause()
        playPauseBtn.classList.replace('fa-pause', 'fa-play')
    } 
}

function formatTime(time){
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600)

    seconds = seconds < 10 ? `0${seconds}` : seconds
    minutes = minutes < 10 ? `0${minutes}` : minutes
    hours = hours < 10 ? `0${hours}` : hours

    if(hours == 0){
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`
}
mainVideo.addEventListener('timeupdate', (e) => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width  = `${percent}%`;
    currentVideoTime.innerText = formatTime(currentTime);
})

mainVideo.addEventListener('loadeddata', (e)=>{
    videoDuration.innerText = formatTime(e.target.value)
});


noteBtn.addEventListener('click', (e) => {
    let noteTime = Math.floor(mainVideo.currentTime)
    note.style.left = progressBar.style.width
    console.log(noteTime + "your note added");
    // return noteTime
});
// console.log(mainVideo.duration)

playPauseBtn.addEventListener('click', playPause)
mainVideo.addEventListener('click', playPause)
videoTimeLine.addEventListener('click', (e) =>{
    let timelineWidth = videoTimeLine.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
})
speedBtn.addEventListener('click', ()=> {
    speedOptions.classList.toggle('show')
})

document.addEventListener('click', (e)=> {
    if(e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded'){
        speedOptions.classList.remove('show')
    }
})
picInPicBtn.addEventListener('click', ()=>{
    mainVideo.requestPictureInPicture()
})
fullscreenBtn.addEventListener('click', () => {
    container.classList.toggle('fullscreen')
    if(document.fullscreenElement){
        fullscreenBtn.classList.replace('fa-compress', 'fa-expand')
        return document.exitFullscreen
    }else{
        fullscreenBtn.classList.replace('fa-expand','fa-compress')
        container.requestFullscreen
    }
})
speedOptions.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', ()=>{
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector('.active').classList.remove('active')
        option.classList.add('active')
    })
})
volumeBtn.addEventListener('click', () => {
    if(!volumeBtn.classList.contains('fa-volume-high')){
        mainVideo.volume = 0.5
        volumeBtn.classList.replace('fa-volume-xmark','fa-volume-high')
    }else{
        mainVideo.volume = 0
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
    }
    volumeSlider.value = mainVideo.volume; 
})

volumeSlider.addEventListener('input', (e) => {
    mainVideo.volume = e.target.value;
    if(mainVideo.volume === 0){
        volumeBtn.classList.replace('fa-volume-high','fa-volume-xmark')
    }else{
        volumeBtn.classList.replace('fa-volume-xmark','fa-volume-high')
    }
})

skipForward.addEventListener('click',() => {
    mainVideo.currentTime += 5
})
skipBackward.addEventListener('click',() => {
    mainVideo.currentTime -= 5
})



