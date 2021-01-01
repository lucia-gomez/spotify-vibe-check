import React from 'react'
import { Bar, HorizontalBar } from '@reactchartjs/react-chart.js'
import Nav from './nav'

const chartOptions = {
  scale: {
    ticks: {
      display: false,
      showLabelBackdrop: false,
      min: 0,
      max: 100,
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
  state = {
    popularitySelected: undefined,
  };

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
          <div className='flex-row'>
            {this.getCoverArt()}
            <div className='flex-col' style={{ alignSelf: 'flex-end' }}>
              <h1>Vibe Check...</h1>
              <h2 className={this.props.playlist ? '' : 'pulse'}>
                {this.props.playlist ? this.props.playlist.name : "Select a playlist"}
              </h2>
            </div>
          </div>
        </div>
        {this.props.loading ? "loading" :
          <div>
            {this.props.playlistTracks ? this.getAnalysis() : null}
            {/* {this.props.chartData ? <div className="chart-container" style={{ position: 'relative' }}>
              <Radar data={this.props.chartData} options={chartOptions} height='100px' />
            </div> : null} */}
          </div>}
      </>
    );
  }

  contentMobile() {
    // const stats = this.props.chartData ?
    //   <div className="chart-container" style={{ position: 'relative' }}>
    //     <Radar data={this.props.chartData} options={chartOptions} height='200px' />
    //   </div> : null;

    return (
      <div className='page'>
        {this.props.playlist ? <>
          <div id='body-header-mobile'>
            {this.getCoverArt()}
            <h3>Vibe Check...</h3>
            <h4>{this.props.playlist.name}</h4>
          </div>
          {this.props.playlistTracks ? this.getAnalysis(true) : null}
        </> : null}
      </div>
    );
  }

  getAnalysis(mobile = false) {
    return (
      <div className='stats'>
        {this.getPopularityGraph(mobile)}
      </div>
    );
  }

  getPopularityGraph(mobile) {
    const popularityBins = this.getPopularityData();
    const chartData = popularityBins.map(x => x.length);
    const clickFn = (x, y, z) => this.onClickPopularityChart(x, y, z);
    const data = {
      labels: ["wtf", "yikes", "hipster trash", "...interesting", "thin ice", "well-known", "iconic", "popular", "hot", "overplayed"],
      datasets: [{
        data: chartData,
        backgroundColor: 'rgba(29, 185, 84, 1)',
        hoverBackgroundColor: 'rgba(231, 174, 15, 1)'
      }],
    };
    const options = {
      maintainAspectRatio: !mobile,
      legend: {
        display: false,
      },
      onClick: function (_, i) {
        let e = i[0];
        if (!e) {
          return;
        }
        const index = e._index;
        const x_value = this.data.labels[e._index];
        const y_value = this.data.datasets[0].data[e._index];
        clickFn(index, x_value, y_value);
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: "white",
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: "white",
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        custom: x => x.displayColors = false,
        callbacks: {
          title: (x, _) => `${x[0].value} ${x[0].label} songs`,
          label: (x, _) => null,
        }
      },
    }
    return (
      <>
        {mobile ? <HorizontalBar data={data} options={options} /> : <Bar data={data} options={options} />}
        {this.getPopularityDrilldown(popularityBins)}
      </>
    );
  }

  getPopularityDrilldown(popularityBins) {
    const p = this.state.popularitySelected;
    return (
      <div id='popularityDrilldown'>
        {p ?
          <div>
            <h5>{`${p.numSongs} ${p.label} song${p.numSongs === 1 ? '' : 's'}`}</h5>
            <ul>
              {popularityBins[p.index].map((s, i) => <li key={i}>{s.name}</li>)}
            </ul>
          </div>
          : <h5>Click on a category to learn more</h5>
        }
      </div>
    );
  }

  getPopularityData() {
    const binSize = 10;
    const numBins = 10;
    const songsInBins = [];

    for (let i = 0; i < numBins; i++) {
      const minVal = i * binSize;
      const maxVal = (i + 1) * binSize;
      const filtered = this.props.playlistTracks.filter(x => {
        const pop = x.track.popularity;
        return pop >= minVal && pop < maxVal;
      });
      songsInBins.push(filtered.map(x => ({ name: x.track.name })));
    }
    return songsInBins;
  }

  onClickPopularityChart(index, label, numSongs) {
    this.setState({ popularitySelected: { index, label, numSongs } });
  }

  getCoverArt() {
    return (this.props.playlist ?
      <div id='cover-wrapper'>
        <img src={this.props.playlist.images[0].url} alt='playlist cover art' />
        <img src={this.props.playlist.images[0].url} id='blurred' alt='playlist cover art blurred' />
      </div> : null
    );
  }
}

// function binList(list, binSize, numBins) {
//   let bins = [];
//   for (let i = 0; i < numBins; i++) {
//     const minVal = i * binSize;
//     const maxVal = (i + 1) * binSize;
//     bins.push(list.filter(x => x >= minVal && x < maxVal).length);
//   }
//   return bins;
// }

// function avgList(list) {
//   const sum = list.reduce((a, b) => a + b, 0);
//   return Math.round(100 * sum / list.length);
// }

export default Stats