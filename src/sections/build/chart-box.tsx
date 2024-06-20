import { alpha, useTheme } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

interface ChartBoxProps {
    xData: string[],
    yData: number[],
}

export default function ChartBox({ xData = [], yData = [] }: ChartBoxProps) {
    const theme = useTheme();

    const chartOptions = useChart({
        xaxis: {
            title: {
                text: 'Date',
            },
            categories: xData,
        },
        yaxis: {
            title: {
                text: 'Cumulative Returns',
            },
        },
        tooltip: {
            x: {
                show: false,
            },
            marker: { show: false },
        },
        stroke: {
            width: 0
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.7,
                stops: [0, 100 * Math.max(...yData) / (Math.max(...yData) - Math.min(...yData)), 100],
                colorStops: [
                    {
                        offset: 0,
                        color: alpha(theme.palette.success.main, 0.3),
                        opacity: 1,
                    },
                    {
                        offset: 100 * Math.max(...yData) / (Math.max(...yData) - Math.min(...yData)),
                        color: alpha(theme.palette.success.main, 0.3),
                        opacity: 1,
                    },
                    {
                        offset: 100 * Math.max(...yData) / (Math.max(...yData) - Math.min(...yData)),
                        color: alpha(theme.palette.error.main, 0.3),
                        opacity: 1,
                    },
                    {
                        offset: 100,
                        color: alpha(theme.palette.error.main, 0.3),
                        opacity: 1,
                    },
                ],
            },
        }
    });

    return <Chart dir="ltr" type="area" series={[
        {
            name: 'Return',
            data: [...yData],
        },
    ]} options={chartOptions} width="100%" height={256} />
}