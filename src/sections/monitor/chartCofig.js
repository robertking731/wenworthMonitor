import { getData } from './data';

export const chartLists = [
    {
      id: 1,
      title: 'S&P500',
      price: 5431,
      percentage: -0.04,
    },
    {
      id: 2,
      title: 'Nasdap',
      price: 17688,
      percentage: 0.12,
    },
    {
      id: 3,
      title: 'US 10Yr',
      price: 4.24,
      percentage: -0.14,
    },
    {
      id: 4,
      title: 'FTSE',
      price: 8157,
      percentage: 0.13,
    },
    {
      id: 5,
      title: 'Crude Oil',
      price: 78.79,
      percentage: 0.43,
    },
    {
      id: 6,
      title: 'Gold',
      price: 2334,
      percentage: -0.63,
    },
    {
      id: 7,
      title: 'Euro',
      price: 1.07,
      percentage: 0.01,
    },
    {
      id: 8,
      title: 'GBP',
      price: 1.27,
      percentage: -0.13,
    },
  ];

  export var options = {
    data: getData(),
    width: 250,
    series: [
      {
        type: 'area',
        xKey: 'date',
        yKey: 'detachedHouses',
        fill: 'green',
      },
    ],
    background: {
      fill: 'transparent',
    },
    axes: [
      {
        position: 'left',
        type: 'number',
        label: {
          formatter: ({ value }) => ``,
        },
      },
      {
        position: 'bottom',
        type: 'time',
      },
    ],
  };