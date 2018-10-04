import * as React from "react";
import "./App.css";

import DataPicker from "./DataPicker";
import Heatmap from "./Heatmap";

interface IAppState {
  dataset: number;
}

class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataset: 1
    };

    this.switchDataset = this.switchDataset.bind(this);
  }

  public switchDataset(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ dataset: Number(e.target.value) });
  }

  public render() {
    return (
      <div className="App">
        <Heatmap dataset={this.state.dataset} />
        <DataPicker
          dataset={this.state.dataset}
          switchDataset={this.switchDataset}
        />
      </div>
    );
  }
}

export default App;
