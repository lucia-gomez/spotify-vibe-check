import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Body from './body';

import Logo from './assets/logo_green.png';

const spotifyApi = new SpotifyWebApi();

class App extends React.Component {
  state = {
    activePlaylist: -1,
    activePlaylistName: undefined,
    chartData: undefined,
    loggedIn: false,
    playlists: [],
    profilePicURL: undefined,
    username: '???',
    userPageURL: '/#',
  }

  async componentDidMount() {
    const params = getHashParams();
    const access_token = params.access_token;
    if (access_token) {
      spotifyApi.setAccessToken(access_token);
      this.getPlaylists();
      this.getUserInfo();
      this.setState({ loggedIn: true });
    }
  }

  render() {
    return (
      <div className='App' >
        <div className="row">
          <div className="side-nav col s12 m4 l3">
            <img src={Logo} id="logo" alt="Spotify logo"></img>
            {this.renderPlaylists()}
          </div>
          <div className="content col s12 m8 l9">
            <Body
              chartData={this.state.chartData}
              loggedIn={this.state.loggedIn}
              playlistName={this.state.activePlaylistName}
              profilePicURL={this.state.profilePicURL}
              username={this.state.username}
              userPageURL={this.state.userPageURL}
            />
          </div>
        </div>
      </div >
    )
  }

  renderPlaylists() {
    return (
      <div>
        <p id='playlists-title'>YOUR PLAYLISTS</p>
        <div className="divider" />
        <div className="collection">
          {this.state.playlists.map((playlist, i) => {
            const active = this.state.activePlaylist === i ? 'active' : '';
            return <div
              className={"collection-item " + active}
              key={i}
              onClick={() => this.clickPlaylistItem(playlist, i)}
            >
              {playlist.name}
            </div>
          }
          )}
        </div>
      </div>
    )
  }

  /**
   *  Select playlist, or unselect it if it was already selected
   */
  async clickPlaylistItem(playlist, i) {
    this.setState((prevState) => {
      const isSame = prevState.activePlaylist === i;
      return (
        {
          activePlaylist: isSame ? -1 : i,
          activePlaylistName: isSame ? undefined : playlist.name,
        }
      )
    }, () =>
      this.getPlaylistChart(playlist)
    );
  }

  /**
   * Get chart data for a playlist, if there's one selected
   */
  async getPlaylistChart(playlist) {
    if (this.state.activePlaylist === -1) {
      this.setState({ chartData: undefined });
      return;
    }

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

    // return chartData;
    this.setState({ chartData: chartData });
  }

  async getPlaylists() {
    const playlists = await spotifyApi.getUserPlaylists();
    this.setState({ playlists: playlists.items });
  }

  async getPlaylistStats(playlist) {
    try {
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
    } catch (error) {
      this.setState({ loggedIn: false });
      return null;
    }
  }

  async getUserInfo() {
    const user = await spotifyApi.getMe();
    this.setState({ username: user.display_name, userPageURL: user.external_urls.spotify });
    if (user.images.length > 0) {
      this.setState({ profilePicURL: user.images[0].url });
    }
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
