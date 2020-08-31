let player;

let tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: 0,
    height: 0,
    videoId: 'n5uz7egB9tA',
    playerVars: {
      color: 'white',
      playlist: 'BYyPga-3g3k, UPMgJeYsOLo',
    },
  });
}

element('play').addEventListener('click', () => player.playVideo());
element('next').addEventListener('click', () => player.nextVideo());
element('pause').addEventListener('click', () => player.pauseVideo());
element('prev').addEventListener('click', () => player.previousVideo());
element('stop').addEventListener('click', () => player.stopVideo());

const searchPlayBtn = document.getElementById('searchPlayBtn');

searchPlayBtn.addEventListener('click', () => {
  console.log(player);
  player.loadVideoById('BYyPga-3g3k');
});

function element(id) {
  return document.getElementById(id);
}
