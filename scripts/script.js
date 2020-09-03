// RETORNO DE ELEMENTO DOM POR ID
function element(id) {
  return document.getElementById(id);
}

// OBJETO PLAYER
let player;

// ESTADO DA APLICAÇÃO
let state = {
  playlist: [],
  maxVideos: 10,
  key: '',
};

// OBJETO DO NOW PLAYING
const now = {
  cover: element('nowCover'),
  title: element('infoTitle'),
  author: element('infoAuthor'),
  time: element('infoTime'),
  loading: element('loading'),
};

// RECUPERANDO CHAVE DA API E SALVANDO NO ESTADO
fetch('../apiKey.json')
  .then((response) => response.json())
  .then((json) => (state.key = json.key));

// EVENTOS DE CONTROLE DO PLAYER
function addControls() {
  element('play').addEventListener('click', () => player.playVideo());
  element('next').addEventListener('click', () => player.nextVideo());
  element('pause').addEventListener('click', () => player.pauseVideo());
  element('prev').addEventListener('click', () => player.previousVideo());
  element('stop').addEventListener('click', () => player.stopVideo());
  element('controls').classList.add('controls--on');
}

// CARREGANDO SCRIPT DA API DO YOUTUBE DE FORMA ASSÍNCRONA COMO SUGERIDO PELA API
let tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// API DO YT CHAMA ASSIM QUE É CARREGADA
function onYouTubeIframeAPIReady() {
  // CRIA INSTÂNCIA DO PLAYER E O CARREGA NA PÁGINA
  player = new YT.Player('player', {
    width: 0,
    height: 0,
    videoId: '',
    playerVars: {
      color: 'white',
      playlist: '',
    },
    events: {
      onStateChange: onChangePlayer,
      onError: handleError,
    },
  });
}

// EVENTO DE PESQUISA DAS MÚSICAS
element('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  fetchVideos(state.key, event.target.formInput.value, state.maxVideos);
});

// FETCH PARA BUSCAR VIDEOS ATRAVÉS DA API DO YOUTUBE
async function fetchVideos(key, search, maxResults) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${key}&type=video&videoCategoryId=10&videoEmbeddable=true&maxResults=${maxResults}&q=music+${search}`,
  );
  const json = await response.json();
  console.log(json);
  if (!json.error && json.pageInfo.totalResults > 0) {
    const { items } = json;
    state.playlist = items.map((item) => {
      return item.id.videoId;
    });
    loadVideos(state.playlist);
  } else {
    invalidSearch();
  }
}

// EVENTO DE ESTADO DO PLAYER
function onChangePlayer(event) {
  // MOSTRANDO LOADING ANTES DE CARREGAR INFO
  loadingInfo(event.target.getPlayerState());

  // CARREGANDO INFO E CONTROLES QUANDO REPRODUZINDO
  if (event.target.getPlayerState() == 1) {
    loadVideoThumb(event.target.getVideoData());
    addControls();
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

// CARREGA OS VIDEOS NO PLAYER
function loadVideos(playlist) {
  player.loadPlaylist(playlist);
  player.setShuffle(true);
  player.setVolume(100);
  player.setLoop(true);
}

// CARREGANDO INFORMAÇÕES DA MÚSICA ATUAL
function loadVideoThumb(data) {
  const date = new Date(player.getDuration() * 1000);

  now.cover.src = `https://img.youtube.com/vi/${data.video_id}/0.jpg`;
  now.cover.alt = data.title;
  now.title.innerText = data.title;
  now.author.innerText = data.author;
  now.time.innerText = `${date
    .getUTCHours()
    .toString()
    .padStart(2, '0')}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;
}

// LOADING DO APP
function loadingInfo(playerState) {
  if (
    playerState != 1 &&
    playerState != 5 &&
    playerState != 2 &&
    playerState != -1
  ) {
    now.loading.classList.add('container__loading--on');
  } else {
    now.loading.classList.remove('container__loading--on');
  }
}

function handleError(event) {
  invalidSearch();
}
