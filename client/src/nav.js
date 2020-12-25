import React from 'react'

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dropdownOpen: false };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  dropdown = (
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
        <a className="dropdown-item" href="http://localhost:8888/logout">Log Out</a>
      </div>
    </div>
  );

  render() {
    return (
      <div className="nav-wrapper">
        <div id='profile-info'>
          <div className='flex-row valign-wrapper'>
            <img src={this.props.profilePicURL} id="profile-pic" alt="your Spotify profile"></img>
            <p>{this.props.username}</p>
            {this.dropdown}
          </div>
        </div>
      </div>

    );
  }

  toggleMenu() {
    this.setState((prevState) => (
      { dropdownOpen: !prevState.dropdownOpen }
    ), () => this.animateMenu());
  }

  animateMenu() {
    console.log(this.state.dropdownOpen);
    document.getElementById("profile-dropdown").className = this.state.dropdownOpen ? 'open' : 'closed';
  }
}

export default Nav