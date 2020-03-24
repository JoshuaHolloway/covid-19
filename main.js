const data_arr = [];
const y_axis_labels = [];
const x_axis_data__confirmed = [];
const x_axis_data__confirmed__change = [];
const x_axis_data__confirmed__growth_factor = [];
const url = 'https://pomber.github.io/covid19/timeseries.json';
fetch(url)
    .then(res => res.json())
    .then(data => {

        console.log(data.US);

        data.US.forEach((elem, idx, arr) => {
            data_arr.push(elem);
            y_axis_labels.push(elem.date);
            x_axis_data__confirmed.push(elem.confirmed);
        });

        for (let i = 1; i < x_axis_data__confirmed.length; ++i) {
            const x0 = x_axis_data__confirmed[i-1];
            const x1 = x_axis_data__confirmed[i];
            const dx = x1 - x0;
            x_axis_data__confirmed__change.push(dx);
        }

        for (let i = 1; i < x_axis_data__confirmed__change.length; ++i) {
            const dx0 = x_axis_data__confirmed__change[i-1];
            const dx1 = x_axis_data__confirmed__change[i];
            const growth_factor = dx1 / dx0;
            if (growth_factor < 1e3)
                x_axis_data__confirmed__growth_factor.push(growth_factor);
            else
                x_axis_data__confirmed__growth_factor.push(null);
        }

        console.log(x_axis_data__confirmed__change);
        console.log(x_axis_data__confirmed__growth_factor);
    })
    .then(() => {
        chart_callback__linear();
        chart_callback__log();
        chart_callback__change();
    });
//===============================================
const chart_callback__linear = () => {

    let config = {
        type: 'line',
        data: {
            labels: y_axis_labels,
            datasets: [{
                label: 'Total Confirmed Cases',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: x_axis_data__confirmed,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'United States Total Confirmed Cases'
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
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Value',
                    },
                }]
            }
        }
    };


    // Update display on window load
     const ctx = document.getElementById('canvas-linear').getContext('2d');
    window.onload = function() {
        window.myLine = new Chart(ctx, config);
    };

    // If clicked on then update window display
    const pill = document.getElementById('pill-1');
    pill.addEventListener('click', () => {
        window.myLine = new Chart(ctx, config);
    });
};
//===============================================
const chart_callback__log = () => {
    let config = {
        type: 'line',
        data: {
            labels: y_axis_labels,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: x_axis_data__confirmed,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Chart.js Line Chart'
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
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    type: 'logarithmic',
                    scaleLabel: {
                        display: true,
                        labelString: 'Value',
                    },
                }]
            }
        }
    };

    const pill = document.getElementById('pill-2');
    pill.addEventListener('click', () => {
        const ctx = document.getElementById('canvas-log').getContext('2d');
        window.myLine = new Chart(ctx, config);
    });


};
//===============================================
const chart_callback__change = () => {

    // TODO: Get more accurate with the slice indices
    const y_sliced = y_axis_labels.slice(0,y_axis_labels.length); 
    const x_change_sliced = x_axis_data__confirmed__change.slice(0,
                            x_axis_data__confirmed__change.length);
    // const x_growth_sliced = x_axis_data__confirmed__growth_factor.slice(0, x_axis_data__confirmed__growth_factor.length);

    let config = {
        type: 'bar',
        data: {
            labels: y_sliced,
            datasets: [{
                label: 'Change',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: x_change_sliced,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Chart.js Line Chart'
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
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    type: 'logarithmic',
                    scaleLabel: {
                        display: true,
                        labelString: 'Value',
                    },
                }]
            }
        }
    };


    // TODO:
    // 1. Use slice() to extract from [34,:]
    // 2. Superimpose bar chart (for change)
    //    on top of line chart

    const pill = document.getElementById('pill-3');
    pill.addEventListener('click', () => {
        const ctx = document.getElementById('canvas-change').getContext('2d');
        window.myLine = new Chart(ctx, config);
    });


};
//===============================================