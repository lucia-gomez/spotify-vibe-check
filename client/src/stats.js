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
          <h2 className={this.props.playlist ? '' : 'pulse'}>
            {this.props.playlist ? this.props.playlist.name : "Select a playlist"}
          </h2>
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
    const stats = this.props.chartData ?
      <div className="chart-container" style={{ position: 'relative' }}>
        <Radar data={this.props.chartData} options={chartOptions} height='200px' />
      </div> : null;

    return (
      <div className='page'>
        {this.props.playlist ? <>
          <div id='body-header-mobile'>
            <div id='cover-wrapper'>
              <img src={this.props.playlist.images[0].url} alt='playlist cover art' />
              <img src={this.props.playlist.images[0].url} id='blurred' alt='playlist cover art blurred' />
            </div>
            <h3>Vibe Check...</h3>
            <h4>{this.props.playlist.name}</h4>
          </div>
          <div>{stats}</div>
        </> : null}
      </div>
    );
  }

}

export default Stats