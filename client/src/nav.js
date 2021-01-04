import React from 'react'
import { server_url } from './util';

class Nav extends React.Component {
  render() {
    const dropdown = (
      <div className="dropdown">
        <div
          className="dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false">
          <i className="material-icons" >expand_more</i>
        </div>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href={server_url + "/logout"}>Log Out</a>
        </div>
      </div>
    );

    let profilePicURL = undefined;
    if (this.props.user && this.props.user.images.length > 0) {
      profilePicURL = this.props.user.images[0].url;
    }

    return (
      this.props.user ?
        <div className="nav-wrapper">
          <div id='profile-info'>
            <div className='flex-row valign-wrapper'>
              <div className='flex-row valign-wrapper'>
                {profilePicURL ? <img src={profilePicURL} id="profile-pic" alt="your Spotify profile"></img> : null}
                <p>{this.props.user.display_name}</p>
              </div>
              {dropdown}
            </div>
          </div>
        </div> : null
    );
  }
}

export default Nav