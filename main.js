//===============================================
const url = 'https://pomber.github.io/covid19/timeseries.json';
//===============================================
class Config {
    // Properties
    num_datasets = 0;
    _ = {
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
            },
        },       
    };
    myLine;

    // Constructor (initialize graph)
    constructor(data_set, chart_type, y_scale_type='linear', x_labels=null, chart_title=null, dataset_label=null, y_axis_label=null) {
        this.set_chart_type(chart_type);
        this.set_chart_title(chart_title);
        this.set_dataset_label(dataset_label);
        this.set_y_label(y_axis_label);
        this.set_y_scale_type(y_scale_type);
        this.set_x_labels(x_labels)
        this.set_dataset([data_set]);
        this.set_constant_line(150e3);
    };

    // Change dataset
    set_dataset = (datasets) => {

        // reset config.data.datasets field
        this._.data.datasets = [];

        // push datasets onto config.data.datasets field
        datasets.forEach((dataset, idx, datasets) => {

            // const color = (idx===0) ? window.chartColors.red : window.chartColors.green;
            let color;
            if (idx === 0)
                color = window.chartColors.red;
            else if (idx === 1)
                color = window.chartColors.green;
            else if (idx === 2)
                color = window.chartColors.blue;

            this._.data.datasets.push(
                {
                    label: null,
                    backgroundColor: color,
                    borderColor: color,
                    data: dataset,
                    fill: false,
                }
            );
        });
    };

    set_chart_type = (chart_type) => this._.type = graph_type;
    set_chart_title = (chart_title) => this._.options.title.text = chart_title;
    set_dataset_label = (dataset_label) => this._.data.datasets[0].label = dataset_label;
    set_y_label = (y_axis_label) => this._.options.scales.yAxes[0].scaleLabel.labelString = y_axis_label;
    set_x_labels = (x_labels) => this._.data.labels = x_labels;
    set_chart_type = (graph_type) => this._.type = graph_type;
    set_y_scale_type = (y_scale_type) => {
        this._.options.scales.yAxes[0].type = y_scale_type
       if(y_scale_type == 'linear') {
            this._.options.scales.yAxes[0].ticks = {
                beginAtZero: false,
                callback: (val, idx, vals) => numberWithCommas(val)
            }
        }
        else {
            this._.options.scales.yAxes[0].ticks = {
                autoSkip: false,
                beginAtZero: false,
                min: 1,
                max: 150e3,
                callback: (val, idx, vals) => {
                    if (val === 15e4 ||
                        val === 10e4 ||
                        val === 10e3 ||
                        val === 10e2 ||
                        val === 10e1 ||
                        val === 10e0
                    )
                        return numberWithCommas(val);
                }
            }
        }
    };
    clear_constant_line = () => this._.options.annotation = {};
    set_constant_line = (val) => {
        // https://github.com/chartjs/chartjs-plugin-annotation
        this._.options.annotation = {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: val,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 4,
                label: {
                enabled: false,
                content: 'Test label'
                }
            }]
        }
    };

    update_graph = () => {
        this.myLine.update();
    };
};
//===============================================
class Graph {
    name = '';
    constructor(name) {
        this.name = name;
    };
    
    config = null;
    x = [];
    dx = [];
    qx = [];
    get_x = function() {
        return[this.x.map(v => v.val),  this.x.map(v => v.date)];
    };
    get_dx = function() {
        return [this.dx.map(v => v.val), this.dx.map(v => v.date)];
    };
    get_qx = function() {
        return [this.qx.map(v => v.val), this.qx.map(v => v.date)];
    };
    get_current_x = function() {
        return this.x[this.x.length-1].val;
    };
    get_current_dx = function() {
        return this.dx[this.dx.length-1].val;
    };
    get_current_qx = function() {
        return this.qx[this.qx.length-1].val;
    };
    get_x_axis_for_sigmoidal_regression = function() {
        const new_length = 2*this.x.length-1;
        const new_x_axis = [];
        for (let i = 0; i < new_length; i++)
            new_x_axis.push(hard_coded_dates[i]);
        return new_x_axis;
    };
    
    init_config = (canvas_name) => {

        this.config =  new Config(
            this.get_x()[0],
            'line',
            'linear',
            this.get_x()[1],
            'Total Confirmed Cases',
            'Total Confirmed Cases',
            'Total Confirmed Cases'
        );

        // Bind to canvas context
        const ctx = document.getElementById(canvas_name).getContext('2d');
        //window.myLine = new Chart(ctx, this.config._);
        //window_my_line = new Chart(ctx, this.config._);
        this.config.myLine = new Chart(ctx, this.config._);

        //window.myLine.push(new Chart(ctx, this.config._));
        // console.log('window.myLine:');
        // console.dir(window.myLine);

        this.config.update_graph();

        // Click-Event callback [linear]
        document.getElementById(`pill-linear-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_x()[0]]);
                this.config.set_x_labels(this.get_x()[1]);
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('linear');
                this.config.set_constant_line(150e3);
                this.config.update_graph();
        });

        // Click-Event callback [logarithmic]
        document.getElementById(`pill-log-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_x()[0]]);
                this.config.set_x_labels(this.get_x()[1]);
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('logarithmic');
                this.config.set_constant_line(150e3);
                this.config.update_graph();
        });

        // Click-Event callback [change]
        document.getElementById(`pill-change-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_dx()[0]]);
                this.config.set_x_labels(this.get_dx()[1]);
                this.config.set_chart_type('bar');
                this.config.set_y_scale_type('linear');
                this.config.clear_constant_line();
                this.config.update_graph();
        });

        // Click-Event callback [growth-factor]
        document.getElementById(`pill-growth-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_qx()[0]]);
                this.config.set_x_labels(this.get_qx()[1]);
                this.config.set_chart_type('bar');
                this.config.set_y_scale_type('linear');
                this.config.set_constant_line(1);
                this.config.update_graph();
        });

        // Click-Event callback [growth-factor]
        document.getElementById(`pill-predict-${this.name}`)
            .addEventListener('click', () => {
                // const x = this.get_x()[0];
                // const mirrored = mirror(x);
                this.config.set_dataset([this.get_x()[0], sigmoidal_regression_03_30]);
                this.config.set_x_labels(this.get_x_axis_for_sigmoidal_regression());
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('linear');
                this.config.set_constant_line(300e3);
                this.config.update_graph();
        });

    };   
};
const confirmed = new Graph('confirmed');
const deaths = new Graph('death');
//===============================================
const recovered = {
    x: [{ date: '', val: null}],
    dx: [{ date: '', val: null}],
    qx: [{ date: '', val: null}]
};
//===============================================
//===============================================
setup_charts().catch(err => console.log(err));
//===============================================
async function get_data() {

    // Wait on retrieval of data before doing math
    const resp = await fetch(url);
    const data = await resp.json();

    // [x] Instantaneous
    data.US.forEach((elem, idx, arr) => {
        // Start on March 1st
        if(idx > 0) {
            confirmed.x.push({'date': elem.date, 'val': elem.confirmed});
            deaths.x.push({'date': elem.date, 'val': elem.deaths});

            //deaths.x.push({'date': elem.date, 'val': elem.deaths});
            //recovered.x.push({'date': elem.date, 'val': elem.recovered});
        }
    });

    // [dx] Change
    for (let i = 1; i < confirmed.x.length; ++i) {
        const x0 = confirmed.x[i-1].val;
        const x1 = confirmed.x[i].val;
        const date_x1 = confirmed.x[i].date;
        const dx = x1 - x0;
        confirmed.dx.push({'date': date_x1, 'val': dx});
        //deaths.dx.push({'date': date_x1, 'val': dx});
    }

    // [qx] Growth Factor
    for (let i = 1; i < confirmed.dx.length; ++i) {
        const dx0 = confirmed.dx[i-1].val;
        const dx1 = confirmed.dx[i].val;
        const date_dx1 = confirmed.dx[i].date;
        let growth_factor = dx1 / dx0;
        if (dx0 < 1e-6)
            growth_factor = null;       
        confirmed.qx.push({date: date_dx1, val: growth_factor});
        //deaths.qx.push({date: date_dx1, val: growth_factor});
    }

    // Total number of cases today:
    const yesterday_x = confirmed.get_current_x();

    // Number of new cases yesterday:
    const yesterday_dx = confirmed.get_current_dx();

    // Yesterdays growth rate:
    const yesterday_qx = confirmed.get_current_qx();

    // Expected new cases today (based on yesterdays growth-rate):
    const today_expected_dx = Math.round(yesterday_dx * yesterday_qx);

    // Expected total number of cases today:
    const today_expected_x = yesterday_x + today_expected_dx;

    // Display results
    const date = confirmed.get_x()[1][confirmed.get_x()[1].length-1].split('-');
    const yesterday = parseInt(date[2],10);
    const today = yesterday + 1;
    const month = months[parseInt(date[1],10)-1];

    document.getElementById('cases-text-current').innerHTML = 
        `Total Confirmed Cases Yesderday (${month}-${yesterday}): ${numberWithCommas(yesterday_x)}`;

    document.getElementById('cases-text-predicted').innerHTML = 
        `<u>Expected Total Cases Today</u> (${month}-${today}): 
            <u><b>${numberWithCommas(today_expected_x)}</b></u>`;
    
    document.getElementById('cases-text-growth-factor').innerHTML = 
        `Based on Yesterdays <a href="https://youtu.be/Kas0tIxDvrg?t=330">Growth Factor</a>: ${yesterday_qx.toFixed(2)}`;
}
//===============================================
async function setup_charts() {

    // Make request and wait on data
    await get_data().catch(err => console.log(err));

    // Initialize config object
    confirmed.init_config('canvas-confirmed');
    deaths.init_config('canvas-deaths');

    // Initialize deaths graph (with linear data)

    // Initialize (3rd) graph 
}
//===============================================


