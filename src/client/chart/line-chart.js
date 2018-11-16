import React, { Component } from 'react';
import Chart from 'chart.js';

const dataset2 = {
    label: 'Odd Count',
    data: [],
    backgroundColor: 'transparent',
    borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1
};

export default class LineChart extends Component {
    constructor(props) {
        super(props);
    }

  componentDidMount() {

        this.chart = new Chart(this.props.id, {
            type: 'line',
            data: {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                datasets: [{
                    label: this.props.name,
                    data: [],
                    backgroundColor: 'transparent',
                    borderColor: [
                        'rgba(84, 145, 227, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        
        this.props.data.subscribe(next => {

            this.chart.data.labels = next[0]['label'];
            if(this.props.id === 'chart1') {
                this.chart.data.datasets[0].data = next[0]['data'];
            } else if(this.props.id === 'chart2') {
                this.chart.data.datasets[0].data = next[1]['data'];      
            } else if(this.props.id === 'chart3') {
                this.chart.data.datasets[0].data = next[2]['data1'];
                if(this.chart.data.datasets.length === 1) {
                    this.chart.data.datasets.push(dataset2);
                }
                if(this.chart.data.datasets.length > 1) {
                    this.chart.data.datasets[1].data = next[2]['data2'];
                }
            } else {
                this.chart.data.datasets[0].data = next[3]['data'];
            } 
            this.chart.update();        
        })
  }

  render() {
    return (
        <div className="card">
            <canvas className="card-body" id={this.props.id}></canvas>
        </div>
    );
  }
}
