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
    modify_dataset = ([datasets]) => {

        // reset config.data.datasets field
        this._.data.datasets = null;

        // push datasets onto config.data.datasets field
    };

    // Update graph

    

    update_graph = () => {
        window.myLine.update();
    };
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
        const config___ = new Config(this.get_x()[0], 'line', 'linear', this.get_x()[1], 'Total Confirmed Cases', 'Total Confirmed Cases', 'Total Confirmed Cases');
        this.config =  config___;

        // bind to canvas context
        const ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, this.config._);
        confirmed.config.update_graph();
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

    // Initialize confirmed graph (with linear data)
    // const initialize_graph = _ => {
    //     var ctx = document.getElementById('canvas').getContext('2d');
    //     window.myLine = new Chart(ctx, confirmed.config.config);
    //     confirmed.config.update_graph();
    // };
    // initialize_graph(confirmed.get_x()[0], confirmed.get_x()[1]);  

    // Initialize deaths graph (with linear data)

    // Initialize (3rd) graph 

    // Setup click-event callbacks (confirmed)
    chart_callback__linear();
    chart_callback__log();
    // chart_callback__change();
}
//===============================================
const chart_callback__linear = () => {
    // If clicked on then update window display
    const pill = document.getElementById('pill-linear');
    pill.addEventListener('click', () => {
        confirmed.config.update_graph(confirmed.get_x()[0], 'line', 'linear', confirmed.get_x()[1]);
    });
};
//===============================================
const chart_callback__log = () => {
    const pill = document.getElementById('pill-log');
    pill.addEventListener('click', () => {
        console.log('CLICKED log');
        confirmed.config.update_graph(confirmed.get_x()[0], 'line', 'logarithmic', confirmed.get_x()[1]);
    });
};
//===============================================