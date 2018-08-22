import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import theme from '../../theme';
import { DateTime } from 'luxon';

const defaultOptions = {
  title: {
    text: null,
  },
  chart: {
    type: 'spline',
    margin: [10, 10, 10, 10],
    backgroundColor: 'transparent',
    height: '50px',
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 0,
    shadow: false,
    padding: 5,
    style: {
      fontFamily: 'Oswald',
      color: theme.colors.darkBlueGrey,
    },
    formatter: function() {
      return `${DateTime.fromMillis(this.x).toFormat('HH:mm')}<br>${
        this.y
      } calls`;
    },
  },
  xAxis: {
    visible: false,
  },
  yAxis: {
    visible: false,
  },
  plotOptions: {
    spline: {
      color: theme.colors.dark,
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 2,
        },
      },
      marker: {
        enabled: false,
        radius: 2,
      },
    },
  },
};

export default ({ options = {}, series = [], ...otherProps }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      ...defaultOptions,
      ...options,
      series: series.map(serie => ({
        ...serie,
        data: serie.data.map((value, index) => ({
          ...value,
          marker: {
            enabled: index === serie.data.length - 1,
          },
        })),
      })),
    }}
    {...otherProps}
  />
);
