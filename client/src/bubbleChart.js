import React from 'react';
// import BubbleChart from '@weknow/react-bubble-chart-d3';
import BubbleChart from './react-bubble-chart-d3/react-bubble-chart-d3';

class GenreBubbleChart extends React.Component {
  /**
   * chart data is sorted in descending order, so earlier in the list means
   * a higher count. higher counts should be colored more brightly
   */
  getBubbleColor(i, n) {
    if (i < n * 0.1) {
      return '#1DB954';
    } else if (i < n * 0.3) {
      return '#1db988';
    } else if (i < n * 0.7) {
      return '#1db9ac';
    } else {
      return '#1d9cb9';
    }
  }

  render() {
    const cutoff = Math.ceil(this.props.data.length * 0.02);
    const dataFiltered = this.props.data.filter(x => x[1] > cutoff);
    const numBubbles = dataFiltered.length;

    const chartData = dataFiltered.map((x, i) => ({
      label: x[0],
      value: x[1],
      color: this.getBubbleColor(i, numBubbles),
    }));

    return (
      <BubbleChart
        className='chart'
        padding={0}
        showLegend={false}
        valueFont={{
          size: this.props.mobile ? 28 : 22,
          color: '#fff',
        }}
        labelFont={{
          size: this.props.mobile ? 30 : 24,
          color: '#fff',
        }}
        bubbleClickFun={this.props.onClick}
        data={chartData}
      />
    );
  }
}

export default GenreBubbleChart;
