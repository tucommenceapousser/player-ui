
const playPauseBtn = document.querySelector(".play-pause-btn")
const theaterBtn = document.querySelector(".theater-btn")
const fullScreenBtn = document.querySelector(".full-screen-btn")
const miniPlayerBtn = document.querySelector(".mini-player-btn")
const muteBtn = document.querySelector(".mute-btn")
const speedBtn = document.querySelector(".speed-btn")
const volumeSlider = document.querySelector(".volume-slider")
const currentTimeElem = document.querySelector(".current-time")
const totalTimeElem = document.querySelector(".total-time")
const videoContainer = document.querySelector(".video-container")
const videoContainerControl = document.querySelector(".video-controls-container")
const timelineContainer = document.querySelector(".timeline-container")
const video = document.querySelector("video")



var menu = document.getElementById("menu");
var video_player = document.getElementById("video-player");
var video_name = document.getElementById("video-name");
var current_url = document.getElementById("current-video");
var autoplayBtn = document.getElementById("autoplayBtn")
var loopBtn = document.getElementById("loopBtn")
var autonextBtn = document.getElementById("autonextBtn");
var autosaveBtn = document.getElementById("autosaveBtn");
var container_2 = document.getElementById("container2");
var container_3 = document.querySelector(".container-3");

var autonextCount = 0;
var autosaveCount = 1;

document.addEventListener("click", (e) => {
  e.preventDefault();
  var isClickInsideElementMenu = menu.contains(e.target);
  var isClickInsideElementContainer_2 = container_2.contains(e.target);
  if (isClickInsideElementMenu) {
    if (e.target.tagName.toLowerCase() == "a") {
      var childrenInsideMenu = menu.children;
      for (i = 0; i <= childrenInsideMenu.length - 1; i++) {
        childrenInsideMenu[i].removeAttribute("id");
      }
      e.target.parentElement.setAttribute("id", "current-video");
      
      video_name.innerText = e.target.innerText;
      
      video_player.src = e.target.href;
      for (i = 0; i <= childrenInsideMenu.length - 1; i++) {
        if (childrenInsideMenu[i].getAttribute('id') == "current-video") {
          break; 
        }
      }
      console.log(localStorage.getItem(i))
      if (localStorage.getItem(i) !== null) {
        video_player.currentTime = localStorage.getItem(i);
      }
    }
  } else if (isClickInsideElementContainer_2) {
    if (e.target.tagName.toLowerCase() == "p") {
      e.target.classList.toggle("bigger");
    }
  }
})

function toggleAutoplay() {
  video_player.toggleAttribute("autoplay");
  autoplayBtn.classList.toggle("btn-active");
}

function toggleLoop() {
  video_player.toggleAttribute("loop");
  loopBtn.classList.toggle("btn-active");
}

function toggleNext() {
  autonextBtn.classList.toggle("btn-active");
  if (autonextCount == 0 ) {
    autonextCount += 1;
  } else {
    autonextCount -= 1;
  }
}

function toggleSave() {
  autosaveBtn.classList.toggle("btn-active");
  if (autosaveCount == 1 ) {
    autosaveCount -= 1;
  } else {
    autosaveCount += 1;
  }
}

video_player.addEventListener("play", function() {
  setInterval(function() {
    if (autosaveCount == 1) {
      var childrenInsideMenu = menu.children;
      for (i = 0; i <= childrenInsideMenu.length - 1; i++) {
        if (childrenInsideMenu[i].getAttribute('id') == "current-video") {
          break; 
        }
      }
      localStorage.setItem(i, video_player.currentTime);
    }
  }, 1000);
})
video_player.addEventListener("ended", function() {
  if (autonextCount == 1) {
    var childrenInsideMenu = menu.children;
    for (i = 0; i <= childrenInsideMenu.length - 1; i++) {
      if (childrenInsideMenu[i].getAttribute('id') == "current-video") {
        childrenInsideMenu[i].removeAttribute("id");
        localStorage.setItem(i, 0);
        if (childrenInsideMenu.length <= i + 1) {
          i = -1;
        }
        var childrenInsideChildren = childrenInsideMenu[i+1].children;

        video_name.innerText = childrenInsideChildren[0].innerText;
        video_player.src = childrenInsideChildren[0].href;
        childrenInsideMenu[i+1].setAttribute("id", "current-video");
        if (localStorage.getItem(i+1) !== null) {
          video_player.currentTime = localStorage.getItem(i+1);
        }
        break; 
      }
    }
  }
})



document.addEventListener("keydown", e => {
    const tagName = document.activeElement.tagName.toLocaleLowerCase()

    if (tagName === "input") return
    switch (e.key.toLocaleLowerCase()) {
        case " ":
            if (tagName === "button") return
        case "k":
            togglePLay()
            break
        case "f":
            toggleFullScreenMode()
            break
        case "i":
            toggleMiniPlayerMode()
            break
        case "m":
            toggleMute()
            break
        case "arrowleft":
        case "j":
            skip(-5)
            break
        case "arrowright":
        case "j":
            skip(5)
            break
    }
})

// time line


timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e)
})


let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect()
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  isScrubbing = (e.buttons & 1) === 1
  videoContainer.classList.toggle("scrubbing", isScrubbing)
  if (isScrubbing) {
    wasPaused = video.paused
    video.pause()
  } else {
    video.currentTime = percent * video.duration
    if (!wasPaused) video.play()
  }

  handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    timelineContainer.style.setProperty("--preview-position", percent)

    if (isScrubbing) {
        e.preventDefault()
        timelineContainer.style.setProperty("--progress-position", percent)
    }
}


// Playback Speed

speedBtn.addEventListener("click", changePlaybackSpeed)

function changePlaybackSpeed() {
    let newPlaybackRate = video.playbackRate + 0.25
    if (newPlaybackRate > 2) newPlaybackRate = 0.25
    video.playbackRate = newPlaybackRate
    speedBtn.textContent = `${newPlaybackRate}x`
}

//Durantion 

video.addEventListener("loadeddata", () => {
  totalTimeElem.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate", () => {
  currentTimeElem.textContent = formatDuration(video.currentTime)
  const percent = video.currentTime / video.duration
  timelineContainer.style.setProperty("--progress-position", percent)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
})
function formatDuration(time) {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60) % 60
  const hours = Math.floor(time / 3600)
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`
  }
}

function skip(duration) {
  video.currentTime += duration
}

// Volume controls


muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute() {
    video.muted = !video.muted
}

video.addEventListener("volumechange", () => {
    volumeSlider.value = video.volume
    let volumeLevel
    if (video.muted || video.volume === 0) {
        volumeSlider.value = 0
        volumeLevel = "muted"
    } else if (video.volume >= .5) {
        volumeLevel = "high"
    } else {
        volumeLevel = "low"
    }
    

    videoContainer.dataset.volumeLevel = volumeLevel
})


//View modes

theaterBtn.addEventListener("click", toggleTheaterMode)
fullScreenBtn.addEventListener("click", toggleFullScreenMode)
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode)

function toggleTheaterMode() {
    videoContainer.classList.toggle("theater")
    container_2.classList.toggle("theater-container-2")
    container_3.classList.toggle("theater-container-3")
}

function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

function toggleMiniPlayerMode() {
    if (videoContainer.classList.contains("mini-player")) {
        document.exitPictureInPicture()
    } else {
        video.requestPictureInPicture()
    }
}

document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("full-screen", document.fullscreenElement)
})

video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("mini-player")
})


video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("mini-player")
})



// Play & Pause
playPauseBtn.addEventListener('click', togglePLay)

video.addEventListener("click", togglePLay)

function togglePLay() {
    video.paused ? video.play() : video.pause()
}


video.addEventListener("play", () => {
    videoContainer.classList.remove("paused")
    videoContainer.classList.remove("ended")
})

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused")
})

video.addEventListener("ended", () => {
    videoContainer.classList.add("ended")
})