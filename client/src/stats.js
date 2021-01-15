import React from 'react';
import { Bar, HorizontalBar } from '@reactchartjs/react-chart.js';
import Nav from './nav';
import { TrackGrid } from './trackGrid';
import GenreBubbleChart from './bubbleChart';
import M from "materialize-css";

class Stats extends React.Component {
  state = {
    genreSelected: undefined,
    popularitySelected: undefined,
  };

  componentDidUpdate() {
    let tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});
  }

  static getDerivedStateFromProps(props, state) {
    if (props.loading) {
      return { genreSelected: undefined, popularitySelected: undefined };
    }
    return null;
  }

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
          <Nav user={this.props.user} />
          <div className='hide-on-med-and-down flex-row'>
            {this.getCoverArt()}
            <div className='flex-col' style={{ alignSelf: 'flex-end' }}>
              <h1>Vibe Check...</h1>
              <h2 className={this.props.playlist ? '' : 'pulse'}>
                {this.props.playlist ? this.props.playlist.name : "Select a playlist"}
              </h2>
            </div>
          </div>
          <div className='show-on-medium hide-on-large-only' id='body-header-mobile'>
            {this.getCoverArt()}
            <div id='selected-playlist-header'>
              <h1>Vibe Check...</h1>
              <h2>{this.props.playlist ? this.props.playlist.name : "Select a playlist"}</h2>
            </div>
          </div>
        </div>
        {this.props.loading ? "loading" : this.props.playlistTracks ? this.getAnalysis() : null}
      </>
    );
  }

  contentMobile() {
    return (
      <div className='page'>
        <Nav user={this.props.user} />
        {this.props.playlist ? <>
          <div id='body-header-mobile'>
            {this.getCoverArt()}
            <h3>Vibe Check...</h3>
            <h4>{this.props.playlist.name}</h4>
          </div>
          {this.props.loading ? "loading" : this.props.playlistTracks ? this.getAnalysis(true) : null}
        </> : null}
      </div>
    );
  }

  getAnalysis(mobile = false) {
    return (
      <div className='stats'>
        {StatsSection(
          mobile,
          "Popularity Contest",
          "How popular are the songs on your playlist?",
          "Popularity scores are calculated by Spotify, so don't shoot the messenger",
          this.getPopularitySection(mobile),
        )}
        {StatsSection(
          mobile,
          "Genres",
          "How diverse is your playlist?",
          "Spotify has some very specific genres. Below, each bubble represents the number of songs in one genre",
          this.getGenreSection(mobile),
        )}
      </div>
    );
  }

  getPopularitySection(mobile) {
    const popularityBins = this.getPopularityData();
    let clickFn = (x, y, z) => this.onClickPopularityChart(x, y, z);
    let chartData = popularityBins.map(x => x.length);
    let labels = ["wtf", "yikes", "hipster trash", "...interesting", "thin ice", "well-known", "iconic", "popular", "hot", "overplayed"];

    if (mobile) {
      labels = labels.reverse();
      chartData = chartData.reverse();
      clickFn = (x, y, z) => this.onClickPopularityChart(9 - x, y, z);
    }

    const data = {
      labels: labels,
      datasets: [{
        data: chartData,
        backgroundColor: 'rgba(29, 185, 84, 1)',
        hoverBackgroundColor: 'rgba(38, 252, 114, 1)'
      }],
    };
    const options = {
      maintainAspectRatio: false,
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
            fontColor: "#b2b2b2",
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: "#b2b2b2",
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

    const style = mobile ? { height: '30vh', width: '100%' } : { height: '50vh' }
    return (
      <>
        <div style={style} className='chart'>
          {mobile ? <HorizontalBar data={data} options={options} /> : <Bar data={data} options={options} />}
        </div>
        {this.getPopularityDrilldown(popularityBins)}
      </>
    );
  }

  getPopularityDrilldown(popularityBins) {
    const p = this.state.popularitySelected;
    return (
      <>
        {p ?
          <>
            <h5>{`${p.numSongs} ${p.label} song${p.numSongs === 1 ? '' : 's'}`}</h5>
            {TrackGrid(popularityBins[p.index])}
          </>
          : <h5>Click on a category to learn more</h5>
        }
      </>
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
      songsInBins.push(filtered);
    }
    return songsInBins;
  }

  onClickPopularityChart(index, label, numSongs) {
    this.setState({ popularitySelected: { index, label, numSongs } });
  }

  getGenreSection(mobile) {
    if (!this.props.genreData) {
      return null;
    }
    const genres = Object.entries(this.props.genreData).map(x => [x[0], x[1].size]);
    const genreCountsSorted = genres.sort((a, b) => b[1] - a[1]);

    return (
      <>
        <div id='bubble-chart'>
          <GenreBubbleChart
            data={genreCountsSorted}
            mobile={mobile}
            onClick={(genre) => this.setState({ genreSelected: genre })}
          />
        </div>
        {this.getGenreDrilldown()}
      </>
    );
  }

  getGenreDrilldown() {
    const g = this.state.genreSelected;
    const numSongs = g ? this.props.genreData[g].size : 0;
    return (
      <>
        {g ?
          <>
            <h5>{`${numSongs} ${g} song${numSongs === 1 ? '' : 's'}`}</h5>
            {TrackGrid([...this.props.genreData[g]])}
          </>
          : <h5>Click on a category to learn more</h5>
        }
      </>
    );
  }

  getCoverArt() {
    return (this.props.playlist ?
      <div id='cover-wrapper'>
        <img src={this.props.playlist.images[0].url} id='not-blurred' alt='playlist cover art' />
        <img src={this.props.playlist.images[0].url} id='blurred' alt='playlist cover art blurred' />
      </div> : null
    );
  }
}

const StatsSection = (mobile, title, caption, tooltipText, ...children) => {
  return (
    <div className='stats-section'>
      <div className='stats-section-header'>
        {mobile ? <h5>{title}</h5> : <h3>{title}</h3>}
        <p>{caption}</p>
        <i className='material-icons-outlined tooltipped' data-tooltip={tooltipText}>help</i>
      </div>
      {children.map((child, i) => <div key={i}>{child}</div>)}
    </div>
  );
};

// function avgList(list) {
//   const sum = list.reduce((a, b) => a + b, 0);
//   return Math.round(100 * sum / list.length);
// }

export default Stats