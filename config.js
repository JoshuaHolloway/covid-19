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

            borderWidth: 5,
            // pointStyle: 'rectRot',
            // pointRadius: 3,
            pointBorderColor: 'rgb(0, 55, 0)'
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
                        // const date = val.split('-');
                        // const month = months[parseInt(date[1],10)-1];
                        // const date_formatted = `${month}-${date[2]}`
                        // return date_formatted;
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
        },
        elements: {
            point: {
                // radius: 100,
                // pointStyle: "circle",
                // backgroundColor: "rgba(0,0,0,0.1)",
                // borderColor: "rgba(0,0,0,0.1)",
                // borderWidth: 1,
                // hitRadius: 1,
                // hoverRadius: 4,
                // hoverBorderWidth: 1
            },
        },
    }
};