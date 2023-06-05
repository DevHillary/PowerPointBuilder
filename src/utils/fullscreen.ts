// Enter the full screen
export const enterFullscreen = () => {
  const docElm = document.documentElement
  if (docElm.requestFullscreen) docElm.requestFullscreen() 
  else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen() 
  else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen()
  else if (docElm.msRequestFullscreen) docElm.msRequestFullscreen()
}

// Exit full screen
export const exitFullscreen = () => {
  if (document.exitFullscreen) document.exitFullscreen()
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  else if (document.msExitFullscreen) document.msExitFullscreen()
}

// Determine whether a full-screen
export const isFullscreen = () => {
  const fullscreenElement = 
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    document.webkitCurrentFullScreenElement
  return !!fullscreenElement
}