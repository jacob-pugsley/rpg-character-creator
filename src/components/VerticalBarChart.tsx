import React from 'react';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import "./VerticalBarChart.css"

const VerticalBarChart = () => {
    ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    annotationPlugin
    );

    const options: any = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: true,
                text: 'Ability scores',
            },
            annotation: {
                annotations: {
                    line: {
                        type: "line",
                        yMin: 5,
                        yMax: 5,
                        xMax: 10,
                        borderWidth: 2
                    }
                }
            }
        }
    };

    const labels = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

    const data = {
    labels,
    datasets: [
        {
        label: "Ability scores",
        data: labels.map(() => Math.random()*20),
        backgroundColor: ["gray", "yellow", "red", "green", "blue", "pink"]
        },
    ],
    };


    return (
        <div className="barChartDiv">
            <Bar options={options} data={data} />
        </div>
    )


}

export default VerticalBarChart
