// OBJETO PLAYER
let player;

// ESTADO DA APLICAÇÃO
let state = {
  playlist: [],
  maxVideos: 10,
  key: '',
  currentVideoData: {},
};

// CARREGANDO SCRIPT DE FORMA ASSÍNCRONA
let tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// API DO YT CHAMA ASSIM QUE É CARREGADA
function onYouTubeIframeAPIReady() {
  // INSTÂNCIA DO PLAYER
  player = new YT.Player('player', {
    width: 0,
    height: 0,
    videoId: '',
    playerVars: {
      color: 'white',
      playlist: '',
    },
    events: {
      onStateChange: getCurrentVideoData,
    },
  });
}

// EVENTOS DE CONTROLE DO PLAYER
element('play').addEventListener('click', () => player.playVideo());
element('next').addEventListener('click', () => player.nextVideo());
element('pause').addEventListener('click', () => player.pauseVideo());
element('prev').addEventListener('click', () => player.previousVideo());
element('stop').addEventListener('click', () => player.stopVideo());

// RECUPERANDO CHAVE DA API E SALVANDO NO ESTADO
fetch('../apiKey.json')
  .then((response) => response.json())
  .then((json) => (state.key = json.key));

// BUSCAR PLAYLIST
const searchForm = element('searchForm');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  fetchVideos(state.key, event.target.formInput.value, state.maxVideos);
  console.log(player);
});

// FETCH DOS VIDEOS
async function fetchVideos(key, search, maxResults) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${key}&type=video&channelId=UCSJ4gkVC6NrvII8umztf0Ow&maxResults=${maxResults}&q=${search}`,
  );
  const json = await response.json();

  if (json.pageInfo.totalResults > 0) {
    const { items } = json;
    state.playlist = items.map((item) => {
      return item.id.videoId;
    });
    loadVideos(state.playlist);
  } else {
    invalidSearch();
  }
}

// GET CURRENT VIDEO DATA
function getCurrentVideoData(event) {
  if (event.target.getPlayerState() == 1) {
    loadVideoThumb(event.target.getVideoData());
  }
}

// BUSCA INVALIDA
function invalidSearch() {
  element('formInput').value = '';
  const invalidSearch = element('invalidSearch');
  invalidSearch.classList.add('search__invalid--on');
  setTimeout(() => {
    invalidSearch.classList.remove('search__invalid--on');
  }, 1500);
}

// CARREGANDO VIDEOS
function loadVideos(playlist) {
  player.loadPlaylist(playlist);
  player.setShuffle(true);
  player.setVolume(100);
  player.setLoop(true);
}

function loadVideoThumb(data) {
  const date = new Date(player.getDuration() * 1000);

  element('nowCover').src = `https://img.youtube.com/vi/${data.video_id}/0.jpg`;
  element('infoTitle').innerText = data.title;
  element('infoAuthor').innerText = data.author;
  element('infoTime').innerText = `${date
    .getUTCHours()
    .toString()
    .padStart(2, '0')}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;
}

// RETORNO DE ELEMENTO DOM POR ID
function element(id) {
  return document.getElementById(id);
}
