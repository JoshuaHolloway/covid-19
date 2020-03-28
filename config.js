//===============================================
let config = {
    type: 'line',
    data: {
        labels: null,
        datasets: [{
            label: null,
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: null,
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: false,
            text: null
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: null
                }
            }],
            yAxes: [{
                display: true,
                type: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: null,
                },

            }]
        }
    }
};