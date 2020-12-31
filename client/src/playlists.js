import React from 'react';
import { Link } from "@reach/router";
import MobilePlaylistItem from './mobilePlaylistItem';

class Playlists extends React.Component {
  render() {
    return (
      <div className='page'>
        <div id='body-header-mobile'>
          <h3>Vibe Check...</h3>
        </div>
        <ul>
          {this.props.playlists.map((playlist, i) =>
            <Link to='/stats' key={i}>
              <div onClick={() => this.props.onclick(playlist, i)}>
                {MobilePlaylistItem(playlist.images[0].url, playlist.name, playlist.owner.display_name)}
              </div>
            </Link>
          )}
        </ul>
      </div>
    );
  }
}

export default Playlists;