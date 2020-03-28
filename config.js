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
        annotation: {},
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
                    labelString: null,
                },
                ticks: {
                    callback: (val, idx, vals) => {
                        const date = val.split('-');
                        const month = months[parseInt(date[1],10)-1];
                        const date_formatted = `${month}-${date[2]}`
                        return date_formatted;
                    },
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