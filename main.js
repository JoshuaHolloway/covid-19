const data_arr = [];
const y_axis_labels = [];
const data__confirmed = [];
const data__confirmed__change = [];
const data__confirmed__growth_factor = [];
const url = 'https://pomber.github.io/covid19/timeseries.json';
fetch(url)
    .then(res => res.json())
    .then(data => {

        console.log(data.US);

        data.US.forEach((elem, idx, arr) => {
            data_arr.push(elem);
            y_axis_labels.push(elem.date);
            data__confirmed.push(elem.confirmed);
        });

        for (let i = 1; i < data__confirmed.length; ++i) {
            const x0 = data__confirmed[i-1];
            const x1 = data__confirmed[i];
            const dx = x1 - x0;
            data__confirmed__change.push(dx);
        }

        for (let i = 1; i < data__confirmed__change.length; ++i) {
            const dx0 = data__confirmed__change[i-1];
            const dx1 = data__confirmed__change[i];
            const growth_factor = dx1 / dx0;
            if (growth_factor < 1e3)
                data__confirmed__growth_factor.push(growth_factor);
            else
                data__confirmed__growth_factor.push(null);
        }

        console.log(data__confirmed__change);
        console.log(data__confirmed__growth_factor);

        const Ep = data__confirmed__growth_factor[data__confirmed__growth_factor.length - 1];
        const Nd = data__confirmed[data__confirmed.length - 1];
        // const Nd_1 = Nd + Ep * Nd;

        let Nd_1 = null;
        if ( Ep > 1.0) {
            Nd_1 = Nd * Ep;
        }
        else {
            console.log('debug');
            const factor = 1.0 - Ep;
            console.log(`factor: ${factor}`);

            Nd_1 = (1 + factor) * Nd;
            console.log(`Nd_1: ${Nd_1}`);
        }
        console.log(`Current Growth Factor: ${Ep}`);
        console.log(`Number of cases today: ${Nd}`);
        console.log(`Expected cases tomorrow: ${Nd_1}`);
    })
    .then(() => {
        chart_callback__linear();
        chart_callback__log();
        chart_callback__change();
        chart_callback__growth();

        chart_callback__linear_mirror();

        console.log('data__confirmed:');
        console.log(data__confirmed);


        // mirrored = mirror(data__confirmed);
        // console.log('mirrored:');
        // console.log(mirrored);

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
                data: data__confirmed,
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
const chart_callback__linear_mirror = () => {

    const debug_labels = [];
    for (let i = 0; i < 2 * y_axis_labels.length; i++)
        debug_labels.push(i);

    let config = {
        type: 'line',
        data: {
            labels: debug_labels,
            datasets: [{
                label: 'Total Confirmed Cases',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: mirror(data__confirmed),
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

    // If clicked on then update window display
    const pill = document.getElementById('pill-5');
    pill.addEventListener('click', () => {
        const ctx = document.getElementById('canvas-mirror').getContext('2d');
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
                data: data__confirmed,
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
    const x_change_sliced = data__confirmed__change.slice(0,
                            data__confirmed__change.length);
    // const x_growth_sliced = data__confirmed__growth_factor.slice(0, data__confirmed__growth_factor.length);

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
                    type: 'linear',
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
const chart_callback__growth = () => {

    // TODO: Get more accurate with the slice indices
    const y_sliced = y_axis_labels.slice(0,y_axis_labels.length); 
    const x_growth_sliced = data__confirmed__growth_factor.slice(0, data__confirmed__growth_factor.length);

    let config = {
        type: 'bar',
        data: {
            labels: y_sliced,
            datasets: [{
                label: 'Change',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: x_growth_sliced,
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
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Value',
                    },
                }]
            },
            // https://github.com/chartjs/chartjs-plugin-annotation
            annotation: {
                annotations: [{
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: 1,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 4,
                    label: {
                    enabled: false,
                    content: 'Test label'
                    }
                }]
            }
        }
    };


    // TODO:
    // 1. Use slice() to extract from [34,:]
    // 2. Superimpose bar chart (for change)
    //    on top of line chart

    const pill = document.getElementById('pill-4');
    pill.addEventListener('click', () => {
        const ctx = document.getElementById('canvas-growth').getContext('2d');
        window.myLine = new Chart(ctx, config);
    });


};