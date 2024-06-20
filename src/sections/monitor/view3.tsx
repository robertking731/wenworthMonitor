'use client';


import React, { Fragment, useState } from "react";
import { AgChartsReact } from "ag-charts-react";
import "ag-charts-enterprise";
import {getData} from "./data" 
export default () => {
  const [options, setOptions] = useState({
    data: getData(),
    // title: {
    //   text: "London Property Average Price Range",
    // },
    // subtitle: {
    //   text: "2000 - 2020",
    // },
    series: [
      {
        type: "area",
        xKey: "date",
        // yLowKey: "flatsAndMaisonettes",
        yKey: "detachedHouses",
        fill: "green"
      },
    ],
    background: {
      fill: "transparent",
    },
    axes: [
      {
        position: "left",
        type: "number",
        // title: {
        //   text: "Average Price",
        // },
        // label: {
        //   formatter: ({ value }) => `£${Number(value).toLocaleString()}`,
        // },
      },
      {
        position: "bottom",
        type: "time",
      },
    ],
  });

  return <AgChartsReact options={options}/>;
};

// const root = createRoot(document.getElementById("root"));
// root.render(<ChartExample />);