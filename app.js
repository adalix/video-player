const container = document.querySelector('.container'),
mainVideo = container.querySelector('video'),
progressBar = container.querySelector('.progress-bar'),
volumeBtn = container.querySelector('.volume i'),
volumeSlider = container.querySelector('.left input'),
skipForward = container.querySelector('.skip-forward i'),
skipBackward = container.querySelector('.skip-backward i'),
playPauseBtn = container.querySelector('.play-pause i'),
speedBtn = container.querySelector('.playback-speed span'),
speedOptions = container.querySelector('.speed-options');

function playPause(){
    if(mainVideo.paused){
        mainVideo.play()
        playPauseBtn.classList.replace('fa-play', 'fa-pause')
    }else{
        mainVideo.pause()
        playPauseBtn.classList.replace('fa-pause', 'fa-play')
    } 
}
speedBtn.addEventListener('click', ()=> {
    speedOptions.classList.toggle('show')
})

document.addEventListener('click', (e)=> {
    if(e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded'){
        speedOptions.classList.remove('show')
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
playPauseBtn.addEventListener('click', playPause)
mainVideo.addEventListener('click', playPause)
mainVideo.addEventListener('timeupdate', (e) => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100
    progressBar.style.width  = `${percent}%`
})


