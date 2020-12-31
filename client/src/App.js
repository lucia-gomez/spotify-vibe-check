import React from 'react';
import { Router, Link } from "@reach/router"
import SpotifyWebApi from 'spotify-web-api-js';

import Playlists from './playlists';
import Stats from './stats';
import Settings from './settings';
import SideNav from './sideNav';

import { server_url } from './util';

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

  constructor(props) {
    super(props);
    this.clickPlaylistItem = this.clickPlaylistItem.bind(this);
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
        {this.state.loggedIn ? this.content() :
          <div className="valign-wrapper" id="login">
            <a href={server_url + '/login'} className="btn-large pulse-btn">Login to Spotify </a>
          </div>}
      </div >
    )
  }

  content() {
    return (
      <>
        <div className='hide-on-small-only'>
          {this.desktopContent()}
        </div>
        <div className='hide-on-med-and-up'>
          {this.mobileContent()}
        </div>
      </>
    );
  }

  desktopContent() {
    return (
      <div className="row">
        <div className='col s12 m3 l3'>
          {SideNav(this.state.playlists, this.state.activePlaylist, this.clickPlaylistItem)}
        </div>
        <div className='content col s12 m9 l9 '>
          <Stats
            chartData={this.state.chartData}
            loggedIn={this.state.loggedIn}
            playlist={this.state.playlists[this.state.activePlaylist]}
            profilePicURL={this.state.profilePicURL}
            username={this.state.username}
            userPageURL={this.state.userPageURL}
            renderPlaylistsMobile={() => this.renderPlaylistsMobile()}
          />
        </div>
      </div>
    );
  }

  mobileContent() {
    return (
      <>
        <Router>
          <Playlists
            path="/"
            playlists={this.state.playlists}
            onclick={this.clickPlaylistItem}
          />
          <Stats
            path="/stats"
            chartData={this.state.chartData}
            loggedIn={this.state.loggedIn}
            playlist={this.state.playlists[this.state.activePlaylist]}
            profilePicURL={this.state.profilePicURL}
            username={this.state.username}
            userPageURL={this.state.userPageURL}
          />
          <Settings path="/settings" />
        </Router>
        <div id='tabs' className='valign-wrapper'>
          <Link to="/">
            <div className='tab-btn'>
              <i className='material-icons-outlined'>library_music</i>
              <p>Playlists</p>
            </div>
          </Link>
          <Link to='/settings'>
            <div className='tab-btn'>
              <i className='material-icons-outlined'>settings</i>
              <p>Settings</p>
            </div>
          </Link>
        </div>
      </>
    );
  }

  /**
   *  Select playlist, or unselect it if it was already selected
   */
  async clickPlaylistItem(playlist, i) {
    this.setState((prevState) => {
      const isSame = prevState.activePlaylist === i;
      return ({
        activePlaylist: isSame ? -1 : i,
        activePlaylistName: isSame ? undefined : playlist.name,
      })
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
    if (stats !== null) {
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
    else {
      this.setState({ chartData: undefined })
    }
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
