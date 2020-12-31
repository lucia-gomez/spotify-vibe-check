import React from 'react'
import { Radar } from '@reactchartjs/react-chart.js'
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

class Stats extends React.Component {
  render() {
    return (
      <div>
        <div>

          <div className="hide-on-small-only">
            {this.contentNormal()}
          </div>
          <div className="hide-on-med-and-up">
            {this.contentMobile()}
          </div>
        </div>
      </div>
    );
  }

  contentNormal() {
    return (
      <>
        <div className='body-header'>
          <Nav profilePicURL={this.props.profilePicURL} username={this.props.username} />
          <h1>Vibe Check...</h1>
          <h2 className={this.props.playlistName ? '' : 'pulse'}>{this.props.playlistName ?? "Select a playlist"}</h2>
        </div>
        <div>
          {this.props.chartData ? <div className="chart-container" style={{ position: 'relative' }}>
            <Radar data={this.props.chartData} options={chartOptions} height='100px' />
          </div> : null}
        </div>
      </>
    );
  }

  contentMobile() {
    return (
      <div className='page'>
        <div id='body-header-mobile'>
          <h3>Vibe Check...</h3>
          <h4>{this.props.playlistName}</h4>
        </div>
        <div>
          {this.props.chartData ? <div className="chart-container" style={{ position: 'relative' }}>
            <Radar data={this.props.chartData} options={chartOptions} height='200px' />
          </div> : null}
        </div>
      </div>
    );
  }

}

export default Stats