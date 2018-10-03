import * as React from "react";

import HeatmapProcessor from "./processing/heatmap";

interface IHeatmapProps {
  dataset: number;
}
interface IHeatmapState {
  processor: any;
}

class Heatmap extends React.Component<IHeatmapProps, IHeatmapState> {
  constructor(props: IHeatmapProps) {
    super(props);
    this.state = {
      processor: new HeatmapProcessor()
    };
  }

  public componentDidMount() {
    this.state.processor.generateSVG();
    this.state.processor.generateHeatmap(`data${this.props.dataset}.tsv`);
  }

  public componentWillReceiveProps(props: IHeatmapProps) {
    this.state.processor.generateHeatmap(`data${props.dataset}.tsv`);
  }

  public render() {
    return (
      <div>
        <h3>Hourly breakdown</h3>
        <div id="heatmap">
          <div id="chart">
            <div className="legend" />
          </div>
        </div>
      </div>
    );
  }
}

export default Heatmap;
