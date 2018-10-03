import * as React from 'react';
// import * as d3 from 'd3';

import HeatmapProcessor from './processing/heatmap';


class Heatmap extends React.Component {
  public componentDidMount() {
    const processor = new HeatmapProcessor();
    processor.generateHeatmap('data1.tsv');
  }

  public render() {
    return (
      <div>
        <h3>Hourly breakdown</h3>
        <div data-width="960" data-height="500" id="heatmap">
          <div id="chart"/>
          <div className="legend"/>
        </div>
      </div>
    );
  }
}

export default Heatmap;