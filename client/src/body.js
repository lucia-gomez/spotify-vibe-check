import React from 'react'
import { Radar } from '@reactchartjs/react-chart.js'
import { server_url } from './util';
import Nav from './nav'


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

class Body extends React.Component {
  render() {
    return (
      <div>
        {this.props.loggedIn ?
          <div>
            <div className='body-header'>
              <Nav profilePicURL={this.props.profilePicURL} username={this.props.username} />
              <h1>Vibe Check...</h1>
              <h2 className={this.props.playlistName ? 'hide-on-small-only' : 'pulse hide-on-small-only'}>{this.props.playlistName ?? "Select a playlist"}</h2>
            </div>
            <div className="hide-on-small-only">
              {this.contentNormal()}
            </div>
            <div className="hide-on-med-and-up">
              {this.contentMobile()}
            </div>
          </div>
          : <div className="valign-wrapper" id="login">
            <a href={server_url + '/login'} className="btn-large pulse-btn">Login to Spotify </a>
          </div>
        }
      </div>
    );
  }

  contentNormal() {
    return (
      <div>
        {this.props.chartData ? <div className="chart-container" style={{ position: 'relative' }}>
          <Radar data={this.props.chartData} options={chartOptions} height='75px' />
        </div> : null}
      </div>
    );
  }

  contentMobile() {
    return (
      <div>
        {this.props.renderPlaylistsMobile()}
      </div>
    );
  }

}

export default Body