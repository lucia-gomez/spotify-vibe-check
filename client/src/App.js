import React from 'react';
import { Radar } from '@reactchartjs/react-chart.js'
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const chartOptions = {
  scale: {
    ticks: {
      display: false,
      showLabelBackdrop: false,
    },
    angleLines: {
      color: 'rgb(54, 54, 54)',
    },
    gridLines: {
      color: 'rgb(54, 54, 54)',
    }
  },
  legend: {
    display: false
  }
}

class App extends React.Component {
  state = { loggedIn: false, playlists: [], chartData: [], activePlaylist: -1 }

  async componentDidMount() {
    const params = getHashParams();
    const access_token = params.access_token;
    if (access_token) {
      spotifyApi.setAccessToken(access_token);
      await this.getPlaylists();
      this.setState({ loggedIn: true });
    }
  }

  render() {
    return (
      <div className='App' >
        <div className="row">
          <nav className="nav col s12 m4 l3">
            {this.renderPlaylists()}
          </nav>
          <div className="content col s12 m8 l9">
            <div>
              {this.state.loggedIn ?
                null : <a href='http://localhost:8888'> Login to Spotify </a>
              }
              <div className="chart-container" style={{ position: 'relative' }}>
                <Radar data={this.state.chartData} options={chartOptions} height='75px' />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderPlaylists() {
    return (
      <div>
        <p id='playlists-title'>YOUR PLAYLISTS</p>
        <div className="collection">
          {this.state.playlists.map((playlist, i) => {
            const active = this.state.activePlaylist === i ? 'active' : '';
            return <a
              href="#/"
              className={"collection-item " + active}
              key={i}
              onClick={() => this.clickPlaylistItem(playlist, i)}
            >
              {playlist.name}
            </a>
          }
            // <ul key={i} onClick={() => this.getPlaylistChart(playlist)}>
            //   <div>
            //     {playlist.name}
            //   </div>
            // </ul>
          )}
        </div>
      </div>
    )
  }

  async clickPlaylistItem(playlist, i) {
    this.setState({ activePlaylist: i });
    this.getPlaylistChart(playlist);
  }

  async getPlaylistChart(playlist) {
    const stats = await this.getPlaylistStats(playlist);

    const chartData = {
      labels: stats.labels,
      datasets: [
        {
          data: stats.data,
          backgroundColor: 'rgba(29, 185, 84, 0.5)',
          borderColor: 'rgba(5, 237, 87, 1)',
          borderWidth: 1,
        }
      ]
    };

    this.setState({ chartData: chartData });
  }

  async getPlaylists() {
    const playlists = await spotifyApi.getUserPlaylists();
    this.setState({ playlists: playlists.items });
  }

  async getPlaylistStats(playlist) {
    const tracks = (await spotifyApi.getPlaylistTracks(playlist.id)).items;
    const trackIDs = tracks.map(trackObj => trackObj.track.id);
    const audioFeatures = (await spotifyApi.getAudioFeaturesForTracks(trackIDs)).audio_features;

    return {
      labels: ["Energy", "Danceability", "Tempo", "Valence"],
      data: [
        avgList(audioFeatures.map(t => t.energy)),
        avgList(audioFeatures.map(t => t.danceability)),
        avgList(audioFeatures.map(t => t.valence)),
        avgList(audioFeatures.map(t => t.tempo / 250))
      ]
    };
  }

}

function avgList(list) {
  const sum = list.reduce((a, b) => a + b, 0);
  return sum / list.length;
}

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  e = r.exec(q)
  while (e) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  return hashParams;
}

export default App;
