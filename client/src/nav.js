import React from 'react'

class Nav extends React.Component {
  render() {
    return (
      <div className="nav-wrapper">
        <div className='flex-row valign-wrapper' id='profile-info'>
          <img src={this.props.profilePicURL} id="profile-pic" alt="your Spotify profile"></img>
          <p>{this.props.username}</p>
        </div>
      </div>
    );
  }
}

export default Nav