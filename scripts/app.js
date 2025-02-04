import Note from "./note.js";
import Storage from "./storage.js";
import { videos } from "./videos.js";

const container = document.querySelector(".container"),
  mainVideo = container.querySelector("video"),
  videoTimeLine = container.querySelector(".video-timeline"),
  progressBar = container.querySelector(".progress-bar"),
  volumeBtn = container.querySelector(".volume i"),
  volumeSlider = container.querySelector(".left input"),
  currentVideoTime = container.querySelector(".current-time"),
  videoDuration = container.querySelector(".video-duration"),
  skipForward = container.querySelector(".skip-forward i"),
  skipBackward = container.querySelector(".skip-backward i"),
  playPauseBtn = container.querySelector(".play-pause i"),
  speedBtn = container.querySelector(".playback-speed span"),
  speedOptions = container.querySelector(".speed-options"),
  noteBtn = container.querySelector(".note-add span"),
  noteTime = container.querySelector(".note-time"),
  noteText = container.querySelector(".note-text"),
  notePart = container.querySelector(".note-part"),
  cancelBtn = container.querySelector("#cancelBtn"),
  saveBtn = container.querySelector("#saveBtn"),
  picInPicBtn = container.querySelector(".pic-in-pic span"),
  fullscreenBtn = container.querySelector(".fullscreen i");

const videoList = document.querySelector(".video-list");
// const videoListItem = document.querySelector(".video-list-item");
// const videoImg = document.querySelector(".video-image");
// const listItemDuration = document.querySelector(".listItemDuration");
// const videoName = document.querySelector(".video-name");
const videoPlayer = document.querySelector("#video-player");

const storage = new Storage();
// container.style.display = 'none'

function randomVideo() {
  const randomVideoIndex = Math.floor(Math.random() * videos.length);
  let chosenVideo = videos[randomVideoIndex].videoSrc;
  mainVideo.src = chosenVideo;
}

randomVideo();


function imgToVideo (e){
  const imgSrc = e.target.src;

  const firstPart = imgSrc.slice(22)
  const secondPart = firstPart.replace('/screenshots', '')
  const thirdPart = secondPart.replace('.png', '.mp4')

  return thirdPart;
}


videoList.addEventListener("click", (e) => {

  // console.log(imgToVideo(e))
  mainVideo.src = imgToVideo(e);
  progressBar.style.width = "0%";

  if(playPauseBtn.className === "fa-play"){
    playPauseBtn.classList.replace("fa-play", "fa-pause")
  }else{
    playPauseBtn.classList.replace("fa-pause", "fa-play")
  }
});



let timer;
const hideControls = () => {
  if (mainVideo.paused) return;
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 2000);
};
hideControls();
container.addEventListener("mousemove", () => {
  container.classList.add("show-controls");
  clearTimeout(timer);
  hideControls();
});

function playPause() {
  if (mainVideo.paused) {
    mainVideo.play();
    playPauseBtn.classList.replace("fa-play", "fa-pause");
  } else {
    mainVideo.pause();
    playPauseBtn.classList.replace("fa-pause", "fa-play");
  }
}

function formatTime(time) {
  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target;
  let percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentVideoTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("timeupdate", (e) => {
  videoDuration.innerText = formatTime(e.target.duration);
});

noteBtn.addEventListener("click", () => {
  if (!mainVideo.paused) {
    mainVideo.pause();
    // noteIndicator.classList.add("showNoteIndicator");
    playPauseBtn.classList.replace("fa-pause", "fa-play");
  }
  notePart.classList.toggle("showNote");
  noteTime.innerText = formatTime(mainVideo.currentTime);
});
cancelBtn.addEventListener("click", () => {
  notePart.classList.toggle("showNote");
});

playPauseBtn.addEventListener("click", playPause);
mainVideo.addEventListener("click", playPause);
videoTimeLine.addEventListener("click", (e) => {
  let timelineWidth = videoTimeLine.clientWidth;
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});
speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-rounded"
  ) {
    speedOptions.classList.remove("show");
  }
});
picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture();
});
fullscreenBtn.addEventListener("click", () => {
  container.classList.toggle("fullscreen");
  if (document.fullscreenElement) {
    fullscreenBtn.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen();
  } else {
    fullscreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
  }
});
speedOptions.querySelectorAll("li").forEach((option) => {
  option.addEventListener("click", () => {
    mainVideo.playbackRate = option.dataset.speed;
    speedOptions.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
});
volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    mainVideo.volume = 0.5;
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0;
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value;
  if (mainVideo.volume === 0) {
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

const draggableProgressBar = (e) => {
  let timelineWidth = videoTimeLine.clientWidth;
  progressBar.style.width = `${e.offsetX}px`;
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
  currentVideoTime.innerText = formatTime(mainVideo.currentTime);
};
videoTimeLine.addEventListener("mousedown", () => {
  videoTimeLine.addEventListener("mousemove", draggableProgressBar);
});
container.addEventListener("mouseup", () => {
  videoTimeLine.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeLine.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeLine.querySelector(".progress-time");
  let offsetX = e.offsetX;
  progressTime.style.left = `${offsetX}px`;
  let timelineWidth = videoTimeLine.clientWidth;
  let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
  progressTime.innerText = formatTime(percent);
});
skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 5;
});
skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 5;
});

videos.forEach((vid) => {
  videoList.innerHTML += `
   <div class="video-list-item">
      <img src=${vid.videoImg} class="video-image"></img>
      <span class="videoDuration">${vid.duration}</span>
      <p class="video-name">${vid.name}</p>
    </div>
  `;
});

saveBtn.addEventListener("click", () => {
  createNote();

  if (noteText.value.length > 0) {
    let noteIndicator = document.createElement("span");
    noteIndicator.classList.add("note-indicator");
    noteIndicator.style.left = progressBar.style.width;
    console.log(progressBar.style.width);
    videoTimeLine.appendChild(noteIndicator);
  }
  console.log(noteText.value.length);
  noteText.value = "";
  notePart.classList.toggle("showNote");
});

function createNote() {
  const videoNote = noteText.value;
  const time = formatTime(mainVideo.currentTime);
  const videoUrl = videoPlayer.src;

  const note = new Note(videoNote, time, videoUrl);
  storage.addNoteToStorage(note);
}
