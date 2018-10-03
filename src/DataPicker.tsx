import * as React from "react";

interface IProps {
  dataset: number;
  switchDataset: any;
}

function DataPicker(props: IProps) {
  return (
    <select onChange={props.switchDataset}>
      <option value="1">Data Set 1</option>
      <option value="2">Data Set 2</option>
    </select>
  );
}

export default DataPicker;
