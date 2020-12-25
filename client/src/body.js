import React from 'react'
import Nav from './nav'
import { Radar } from '@reactchartjs/react-chart.js'

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
              <h2 className={this.props.playlistName ? '' : 'pulse'}>{this.props.playlistName ?? "Select a playlist"}</h2>
            </div>
            {this.props.chartData ? <div className="chart-container" style={{ position: 'relative' }}>
              <Radar data={this.props.chartData} options={chartOptions} height='75px' />
            </div> : null}
          </div>
          : <div className="valign-wrapper" id="login">
            <a href='http://localhost:8888/login' className="waves-effect waves-light btn-large">Login to Spotify </a>
          </div>
        }
      </div>
    );
  }

}

export default Body