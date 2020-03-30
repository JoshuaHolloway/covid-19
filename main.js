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

    // Constructor (initialize graph)
    constructor(data_set, graph_type, y_scale_type='linear', y_labels=null, title=null, label=null, y_axis_label=null) {
        this._.options.title.text = title;
        this._.data.datasets[0].label = label;
        this._.options.scales.yAxes[0].scaleLabel.labelString = y_axis_label;
        this._.options.scales.yAxes[0].type = y_scale_type;
        this._.data.labels = y_labels;
        this._.type = graph_type;
        this._.data.datasets[0].data = data_set;
    };

    // Change dataset
    set_dataset = (datasets) => {

        // reset config.data.datasets field
        this._.data.datasets = [];
        //this._.data.datasets[0].data = datasets.pop();

        // push datasets onto config.data.datasets field
        datasets.forEach((dataset, idx, datasets) => {
            this._.data.datasets.push(
                {
                    label: null,
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: dataset,
                    fill: false,
                }
            );
        });
    };

    set_x_labels = (x_labels) => this._.data.labels = x_labels;
    set_chart_type = (graph_type) => this._.type = graph_type;
    set_y_scale_type = (y_scale_type) => this._.options.scales.yAxes[0].type = y_scale_type;
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

    update_graph = () => window.myLine.update();
};
//===============================================
class Confirmed {
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
    get_current_qx = function() {
        return this.qx[this.qx.length-1].val;
    };
    init_config = () => {

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
        const ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, this.config._);
        confirmed.config.update_graph();

        // Click-Event callback [linear]
        document.getElementById('pill-linear')
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_x()[0]]);
                this.config.set_x_labels(this.get_x()[1]);
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('linear');
                this.config.clear_constant_line();
                this.config.update_graph();
        });

        // Click-Event callback [logarithmic]
        document.getElementById('pill-log')
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_x()[0]]);
                this.config.set_x_labels(this.get_x()[1]);
                this.config.set_chart_type('line');
                this.config.set_y_scale_type('logarithmic');
                this.config.clear_constant_line();
                this.config.update_graph();
        });

        // Click-Event callback [change]
        document.getElementById('pill-change')
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_dx()[0]]);
                this.config.set_x_labels(this.get_dx()[1]);
                this.config.set_chart_type('bar');
                this.config.set_y_scale_type('linear');
                this.config.clear_constant_line();
                this.config.update_graph();
        });

        // Click-Event callback [growth-factor]
        document.getElementById('pill-growth')
            .addEventListener('click', () => {
                this.config.set_dataset([this.get_qx()[0]]);
                this.config.set_x_labels(this.get_qx()[1]);
                this.config.set_chart_type('bar');
                this.config.set_y_scale_type('linear');
                this.config.set_constant_line(1);
                this.config.update_graph();
        });

    };   
};
const confirmed = new Confirmed();
//===============================================
const deaths = {
    x: [{ date: '', val: null}],
    dx: [{ date: '', val: null}],
    qx: [{ date: '', val: null}]
};
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
        if(idx > 38) {
            confirmed.x.push({'date': elem.date, 'val': elem.confirmed});
            deaths.x.push({'date': elem.date, 'val': elem.deaths});
            recovered.x.push({'date': elem.date, 'val': elem.recovered});
        }
    });

    // [dx] Change
    for (let i = 1; i < confirmed.x.length; ++i) {
        const x0 = confirmed.x[i-1].val;
        const x1 = confirmed.x[i].val;
        const date_x1 = confirmed.x[i].date;
        const dx = x1 - x0;
        confirmed.dx.push({'date': date_x1, 'val': dx});
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
    }
}
//===============================================
async function setup_charts() {

    // Make request and wait on data
    await get_data().catch(err => console.log(err));

    // Initialize config object
    confirmed.init_config();

    // Initialize deaths graph (with linear data)

    // Initialize (3rd) graph 


}
//===============================================