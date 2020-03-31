//===============================================
const url = 'https://pomber.github.io/covid19/timeseries.json';
//===============================================
class Config {
    // Properties
    x_line = 0;
    dx_line = 0;
    qx_line = 0;
    px_line = 0;
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
    constructor(x_line, qx_line, px_line, data_set, chart_type, y_scale_type='linear', x_labels=null, chart_title=null, y_axis_label=null) {
        this.set_chart_type(chart_type);
        this.set_chart_title(chart_title);
        this.set_y_label(y_axis_label);
        this.set_y_scale_type(y_scale_type);
        this.set_x_labels(x_labels)
        this.set_dataset([data_set], []); // [data_set], [dataset_Label]
        this.set_constant_line(x_line);
        this.x_line = x_line;
        this.qx_line = qx_line;
        this.px_line = px_line;
    };

    // Change dataset
    set_dataset = (datasets, datasets_labels) => {

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

            // set label
            console.log(datasets_labels);
            if (datasets_labels.length === 0)
                this._.options.legend = { display: false };
            else {
                this._.options.legend = { display: true };
                this._.data.datasets[idx].label = datasets_labels[idx];
            }
        });
    };
    set_chart_type = chart_type => this._.type = chart_type;
    set_chart_title = chart_title => this._.options.title.text = chart_title;
    
    set_y_label = y_axis_label => this._.options.scales.yAxes[0].scaleLabel.labelString = y_axis_label;
    set_x_labels = x_labels => this._.data.labels = x_labels;
    set_y_scale_type = y_scale_type => {
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
                max: this.x_line,
                callback: (val, idx, vals) => {
                    if (val === this.x_line ||
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
    clear_constant_line = _ => this._.options.annotation = {};
    set_constant_line = val => {
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
    update_graph = _ => this.myLine.update();
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
    
    init_config = (y_axis_label, x_line, qx_line, px_line) => {

        this.config =  new Config(
            x_line, qx_line, px_line,
            this.get_x()[0],            // data_set
            'line',                     // chart_type
            'linear',                   // y_scale_type='linear'
            this.get_x()[1],            // x_labels=null
            'Total Confirmed Cases',    // chart_title=null
            y_axis_label                // y_axis_label=null            
        );

        // Bind to canvas context and render initialized graph
        console.log(`canvas-${this.name}`);
        const ctx = document.getElementById(`canvas-${this.name}`).getContext('2d');
        this.config.myLine = new Chart(ctx, this.config._);
        this.config.update_graph();

        // Click-Event callback [linear]
        document.getElementById(`pill-linear-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_x()[0]], []);
                this.config.set_x_labels(this.get_x()[1]);
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('linear');
                this.config.set_constant_line(this.config.x_line);
                this.config.update_graph();
        });

        // Click-Event callback [logarithmic]
        document.getElementById(`pill-log-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_x()[0]], []);
                this.config.set_x_labels(this.get_x()[1]);
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('logarithmic');
                this.config.set_constant_line(this.config.x_line);
                this.config.update_graph();
        });

        // Click-Event callback [change]
        document.getElementById(`pill-change-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_dx()[0]], []);
                this.config.set_x_labels(this.get_dx()[1]);
                this.config.set_chart_type('bar');
                this.config.set_y_scale_type('linear');
                this.config.clear_constant_line();
                this.config.update_graph();
        });

        // Click-Event callback [growth-factor]
        document.getElementById(`pill-growth-${this.name}`)
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_qx()[0]], []);
                this.config.set_x_labels(this.get_qx()[1]);
                this.config.set_chart_type('bar');
                this.config.set_y_scale_type('linear');
                this.config.set_constant_line(this.config.qx_line);
                this.config.update_graph();
        });

        // Click-Event callback [prediction]
        document.getElementById(`pill-predict-${this.name}`)
            .addEventListener('click', () => {
                // const x = this.get_x()[0];
                // const mirrored = mirror(x);
                this.config.set_dataset([this.get_x()[0], sigmoidal_regression_03_30], ['dataset-1', 'datset-2']);
                this.config.set_x_labels(this.get_x_axis_for_sigmoidal_regression());
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('linear');
                this.config.set_constant_line(this.config.px_line);
                this.config.update_graph();
        });

    };

    do_math = (name) => {
        const yesterday_x = this.get_current_x();
        const yesterday_dx = this.get_current_dx();
        const yesterday_qx = this.get_current_qx();
        const today_expected_dx = Math.round(yesterday_dx * yesterday_qx);
        const today_expected_x = yesterday_x + today_expected_dx;

        // Display results
        const date = this.get_x()[1][this.get_x()[1].length-1].split('-');
        const yesterday = parseInt(date[2],10);
        const today = yesterday + 1;
        const month = months[parseInt(date[1],10)-1];

        document.getElementById(`text-${name}-1`).innerHTML = 
            `(${month}-${yesterday}): ${numberWithCommas(yesterday_x)}`;

        document.getElementById(`text-${name}-2`).innerHTML = 
            `(${month}-${today}): 
                <u><b>${numberWithCommas(today_expected_x)}</b></u>`;
        
        document.getElementById(`text-${name}-3`).innerHTML = 
            `${yesterday_qx.toFixed(2)}`;

    };
};
//===============================================
const confirmed = new Graph('confirmed');
const deaths = new Graph('deaths');
const recovered = new Graph('recovered');
//===============================================
setup_charts().catch(err => console.log(err));
//===============================================
async function get_data() {

    // Wait on retrieval of data before doing math
    const resp = await fetch(url);
    const data = await resp.json();

    // [x] Instantaneous
    data.US.forEach((elem, idx, arr) => {
        if(idx > 0) {
            confirmed.x.push({'date': elem.date, 'val': elem.confirmed});
            deaths.x.push({'date': elem.date, 'val': elem.deaths});
            recovered.x.push({'date': elem.date, 'val': elem.recovered});
        }
    });

    // [dx] Change
    for (let i = 1; i < confirmed.x.length; ++i) {
        confirmed.dx.push({'date': confirmed.x[i].date, 'val': confirmed.x[i].val - confirmed.x[i-1].val});
        deaths.dx.push({'date': deaths.x[i].date, 'val': deaths.x[i].val - deaths.x[i-1].val});
        recovered.dx.push({'date': recovered.x[i].date, 'val': recovered.x[i].val - recovered.x[i-1].val});
    }

    // [qx] Growth Factor
    for (let i = 1; i < confirmed.dx.length; ++i) {
        let growth_factor = confirmed.dx[i].val / confirmed.dx[i-1].val;
        if (confirmed.dx[i-1].val < 1e-6) growth_factor = null;
        confirmed.qx.push({date: confirmed.dx[i].date, val: growth_factor});

        growth_factor = deaths.dx[i].val / deaths.dx[i-1].val;
        if (deaths.dx[i-1].val < 1e-6) growth_factor = null;
        deaths.qx.push({date: deaths.dx[i].date, val: growth_factor});

        growth_factor = recovered.dx[i].val / recovered.dx[i-1].val;
        if (recovered.dx[i-1].val < 1e-6) growth_factor = null;
        recovered.qx.push({date: recovered.dx[i].date, val: growth_factor});
    }

    confirmed.do_math('confirmed');
    deaths.do_math('deaths');
    recovered.do_math('recovered');
}
//===============================================
async function setup_charts() {

    // Make request and wait on data
    await get_data().catch(err => console.log(err));

    // Initialize config objects
    confirmed.init_config('Total Confirmed Cases', 200e3, 1, 300e3);
    deaths.init_config('Total Deaths', 3.5e3, 1, 50e3);
    recovered.init_config('Total Recovered', 1, 1, 1);
}
//===============================================


