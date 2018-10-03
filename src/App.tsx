import * as React from 'react';
import './App.css';

import Heatmap from './Heatmap'

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Heatmap />
      </div>
    );
  }
}

export default App;
