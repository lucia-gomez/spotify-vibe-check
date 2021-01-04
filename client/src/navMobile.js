import React from 'react';
import { Link } from "@reach/router";

class NavMobile extends React.Component {
  state = { activeTab: 0 };

  render() {
    const navButtons = [
      { icon: 'library_music', label: 'Playlists', path: '/' },
      { icon: 'settings', label: 'Settings', path: '/settings' }
    ];

    return (
      <div id='tabs' className='valign-wrapper'>
        {navButtons.map((b, i) => {
          const isActive = this.state.activeTab === i;
          return <Link to={b.path} onClick={() => this.onClickNav(i)} key={i}>
            <div className={'tab-btn' + (isActive ? ' active' : '')}>
              <i className={'material-icons' + (isActive ? '' : '-outlined')}>{b.icon}</i>
              <p>{b.label}</p>
            </div>
          </Link>
        })}
      </div>
    );
  }

  onClickNav(index) {
    if (this.state.activeTab !== index) {
      this.setState({ activeTab: index });
    }
  }
};

export default NavMobile;