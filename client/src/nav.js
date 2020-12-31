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

    return (
      <div className="nav-wrapper">
        <div id='profile-info'>
          <div className='flex-row valign-wrapper'>
            <div className='flex-row valign-wrapper'>
              <img src={this.props.profilePicURL} id="profile-pic" alt="your Spotify profile"></img>
              <p>{this.props.username}</p>
            </div>
            {dropdown}
          </div>
        </div>
      </div>

    );
  }
}

export default Nav