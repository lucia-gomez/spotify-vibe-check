import React from 'react';
import { Router } from "@reach/router"
import SpotifyWebApi from 'spotify-web-api-js';

import Playlists from './playlists';
import Stats from './stats';
import Settings from './settings';
import SideNav from './sideNav';
import NavMobile from './navMobile';

import { server_url } from './util';

const spotifyApi = new SpotifyWebApi();

class App extends React.Component {
  state = {
    activePlaylist: -1,
    activePlaylistName: undefined,
    activePlaylistTracks: undefined,
    loading: false,
    loggedIn: false,
    playlists: [],
    profilePicURL: undefined,
    selectedNavTab: 0,
    username: '???',
    userPageURL: '/#',
  }

  constructor(props) {
    super(props);
    this.clickPlaylistItem = this.clickPlaylistItem.bind(this);
    this.getPlaylistAudioFeatures = this.getPlaylistAudioFeatures.bind(this);
    this.apiCall = this.apiCall.bind(this);
  }

  async componentDidMount() {
    const params = getHashParams();
    const access_token = params.access_token;
    if (access_token) {
      spotifyApi.setAccessToken(access_token);
      this.apiCall(() => this.getPlaylists());
      this.apiCall(() => this.getUserInfo());
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
            getPlaylistAudioFeatures={() => this.apiCall(() => this.getPlaylistAudioFeatures())}
            loading={this.state.loading}
            loggedIn={this.state.loggedIn}
            playlist={this.state.playlists[this.state.activePlaylist]}
            playlistTracks={this.state.activePlaylistTracks}
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
            getPlaylistAudioFeatures={() => this.apiCall(() => this.getPlaylistAudioFeatures())}
            loading={this.state.loading}
            loggedIn={this.state.loggedIn}
            playlist={this.state.playlists[this.state.activePlaylist]}
            playlistTracks={this.state.activePlaylistTracks}
            profilePicURL={this.state.profilePicURL}
            username={this.state.username}
            userPageURL={this.state.userPageURL}
          />
          <Settings path="/settings" />
        </Router>
        <NavMobile />
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
      this.genPlaylistData(playlist)
    );
  }

  /**
   * Get stats data for a playlist, if there's one selected
   */
  async genPlaylistData(playlist) {
    if (this.state.activePlaylist === -1) {
      this.setState({ activePlaylistTracks: undefined });
      return;
    }
    this.toggleLoading();

    const tracks = await this.apiCall(() => this.getPlaylistTracks(playlist));
    // const audioFeatures = await this.apiCall(() => this.getPlaylistAudioFeatures(tracks));

    if (tracks !== null) {
      this.setState({ activePlaylistTracks: tracks });
    }
    else {
      this.setState({ activePlaylistTracks: undefined })
    }
    this.toggleLoading();
  }

  async apiCall(func) {
    try {
      return func()
    } catch (error) {
      this.setState({ loggedIn: false });
      return null;
    }
  }

  async getPlaylists() {
    let playlists = [];
    let data = null;
    let i = 0;
    do {
      data = await spotifyApi.getUserPlaylists({ limit: 50, offset: 50 * i++ });
      playlists = playlists.concat(data.items)
    } while (data.next !== null);
    this.setState({ playlists: playlists });
  }

  async getPlaylistTracks(playlist) {
    let tracks = [];
    let playlistData = null;
    let i = 0;
    do {
      playlistData = await spotifyApi.getPlaylistTracks(playlist.id, { offset: 100 * i++ });
      tracks = tracks.concat(playlistData.items);
    } while (playlistData.next !== null);
    return tracks;
  }

  async getPlaylistAudioFeatures() {
    const trackIDs = this.state.playlistTracks.map(trackObj => trackObj.track.id);

    let audioFeatures = [];
    let audioFeaturesData = null;
    let i = 0;
    do {
      const slice = trackIDs.slice(100 * i, 100 * (i + 1));
      audioFeaturesData = await spotifyApi.getAudioFeaturesForTracks(slice);
      audioFeatures = audioFeatures.concat(audioFeaturesData.audio_features);
      i++;
    } while (100 * i < trackIDs.length);

    audioFeatures = audioFeatures.filter(x => x !== null);
    return {
      "Energy": audioFeatures.map(t => t.energy),
      "Danceability": audioFeatures.map(t => t.danceability),
      "Valence": audioFeatures.map(t => t.valence),
      "Tempo": audioFeatures.map(t => t.tempo),
    };
  }

  async getUserInfo() {
    const user = await spotifyApi.getMe();
    this.setState({ username: user.display_name, userPageURL: user.external_urls.spotify });
    if (user.images.length > 0) {
      this.setState({ profilePicURL: user.images[0].url });
    }
  }

  toggleLoading() {
    this.setState(prevState => ({ loading: !prevState.loading }));
  }
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
