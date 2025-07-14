const username = 'senanto';
const apiKey = '7cb3d0a229e377c8c532c6d59bf273f0';

async function fetchLastFM() {
  const container = document.getElementById('lastfm-now-playing');
  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`);
    const data = await response.json();

    if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
      const track = data.recenttracks.track[0];
      const artist = track.artist['#text'];
      const song = track.name;
      const nowPlaying = track['@attr'] && track['@attr'].nowplaying === "true";
      const album = track.album['#text'] || '';
      const url = track.url || '#';

      const sizesOrder = ['extralarge', 'large', 'medium', 'small'];
      let image = '';

      if (track.image && track.image.length) {
        for (const size of sizesOrder) {
          const imgObj = track.image.find(img => img.size === size);
          if (imgObj && imgObj['#text']) {
            image = imgObj['#text'];
            break;
          }
        }
      }

      container.innerHTML = `
        <img src="${image}" alt="Albüm Resmi" />
        <div class="info">
          <div class="nowplaying-label">${nowPlaying ? '🎧 Şu anda çalıyor:' : 'Son dinlenen:'}</div>
          <a href="${url}" target="_blank" rel="noopener noreferrer" title="Last.fm sayfasına git">${song}</a><br/>
          <small>${artist} — ${album}</small>
        </div>
      `;
    } else {
      container.innerText = "Dinleme verisi bulunamadı.";
    }
  } catch (error) {
    container.innerText = "Veri alınırken hata oluştu.";
  }
}

fetchLastFM();

async function fetchGitHubRepos() {
  const username = 'senanto';
  const projectList = document.getElementById('project-list');

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await response.json();

    if (!Array.isArray(repos)) {
      projectList.innerHTML = '<p>Projeler alınamadı.</p>';
      return;
    }

    projectList.innerHTML = '';

    repos.forEach(repo => {
      const item = document.createElement('div');
      item.className = 'project-item';
      item.innerHTML = `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
        <p>${repo.description || "Açıklama yok."}</p>
      `;
      projectList.appendChild(item);
    });
  } catch (err) {
    projectList.innerHTML = '<p>GitHub API hatası.</p>';
  }
}

fetchGitHubRepos();

