import * as React from 'react';
import colors from './colors';
import { filter, range, map, reduce, reverse } from 'ramda';
import { Chart as ChartJS } from 'chart.js';
import { subDays } from 'date-fns';

interface Props {
  data: any;
}

const count = map(x => x.length);
const objToArray = (obj, length) => map(x => obj[x], range(0, length));
const byType = reduce((acc, x) => {
  acc.alpha.push(filter(({ type }) => type === 'alpha', x));
  acc.beta.push(filter(({ type }) => type === 'beta', x));
  acc.latest.push(filter(({ type }) => type === 'latest', x));
  return acc;
});

const createLabels = (today: Date, numDays: number = 15): string[] => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const labels = map(x => {
    const date = subDays(today, x);
    return `${date.getDate()}`;
  }, range(0, numDays));

  return labels;
};

export class Chart extends React.Component<Props> {
  private chart: any;
  private c: any;

  constructor(props) {
    super(props);
    this.chart = React.createRef();
  }

  componentDidMount() {
    const all = reverse(objToArray(this.props.data, 30));
    const allByType = byType({ alpha: [], beta: [], latest: [] }, all);

    this.c = new ChartJS(this.chart.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: reverse(createLabels(new Date(), all.length)),
        datasets: [
          {
            borderColor: colors.latest,
            backgroundColor: colors.latest_a,
            data: count(allByType.latest)
          },
          {
            borderColor: colors.beta,
            backgroundColor: colors.beta_a,
            data: count(allByType.beta)
          },
          {
            borderColor: colors.alpha,
            backgroundColor: colors.alpha_a,
            data: count(allByType.alpha)
          }
        ]
      },
      options: {
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 10
          }
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: false
            }
          ]
        },
        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 14,
          bodySpacing: 4,
          callbacks: {
            labelColor: (
              tooltipItem: {
                datasetIndex: number;
                index: number;
              },
              { data }
            ) => {
              const ds = data.datasets || [];
              return {
                borderColor: ds[tooltipItem.datasetIndex].borderColor,
                backgroundColor: ds[tooltipItem.datasetIndex].borderColor
              };
            },
            label: (
              tooltipItem: {
                datasetIndex: number;
                index: number;
                yLabel: string;
              },
              data: { datasets: any[] }
            ) => {
              let label =
                // versions[tooltipItem.datasetIndex][tooltipItem.index].map(item => item.version) ||
                '';
              return label;
            }
          }
        }
      }
    } as ChartJS.ChartConfiguration);
  }

  render() {
    return <canvas width="100%" height="20" ref={this.chart} />;
  }
}
