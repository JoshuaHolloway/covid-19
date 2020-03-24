const data_arr = [];
const y_axis_labels = [];
const x_axis_data__confirmed = [];
const x_axis_data__confirmed__change = [];
const x_axis_data__confirmed__growth_factor = [];
const url = 'https://pomber.github.io/covid19/timeseries.json';
fetch(url)
    .then(res => res.json())
    .then(data => {
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
        chart_callback__log();
        chart_callback__linear();
        chart_callback__growth();
    });
//===============================================
const chart_callback__linear = () => {

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
            }, {
                label: 'My Second dataset',
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: [
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor()
                ],
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

    document.getElementById('randomizeData').addEventListener('click', function() {
        config.data.datasets.forEach(function(dataset) {
            dataset.data = dataset.data.map(function() {
                return randomScalingFactor();
            });

        });

        window.myLine.update();
    });

    const colorNames = Object.keys(window.chartColors);
    document.getElementById('addDataset').addEventListener('click', function() {
        var colorName = colorNames[config.data.datasets.length % colorNames.length];
        var newColor = window.chartColors[colorName];
        var newDataset = {
            label: 'Dataset ' + config.data.datasets.length,
            backgroundColor: newColor,
            borderColor: newColor,
            data: [],
            fill: false
        };

        for (var index = 0; index < config.data.labels.length; ++index) {
            newDataset.data.push(randomScalingFactor());
        }

        config.data.datasets.push(newDataset);
        window.myLine.update();
    });

    document.getElementById('addData').addEventListener('click', function() {
        if (config.data.datasets.length > 0) {
            var month = MONTHS[config.data.labels.length % MONTHS.length];
            config.data.labels.push(month);

            config.data.datasets.forEach(function(dataset) {
                dataset.data.push(randomScalingFactor());
            });

            window.myLine.update();
        }
    });

    document.getElementById('removeDataset').addEventListener('click', function() {
        config.data.datasets.splice(0, 1);
        window.myLine.update();
    });

    document.getElementById('removeData').addEventListener('click', function() {
        config.data.labels.splice(-1, 1); // remove the label first

        config.data.datasets.forEach(function(dataset) {
            dataset.data.pop();
        });

        window.myLine.update();
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
const chart_callback__growth = () => {
    let config = {
        type: 'line',
        data: {
            labels: y_axis_labels,
            datasets: [{
                label: 'Change',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: x_axis_data__confirmed__change,
                fill: false,
            }, {
                label: 'Growth Factor',
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: x_axis_data__confirmed__growth_factor,
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

    const pill = document.getElementById('pill-3');
    pill.addEventListener('click', () => {
        const ctx = document.getElementById('canvas-growth').getContext('2d');
        window.myLine = new Chart(ctx, config);
    });


};