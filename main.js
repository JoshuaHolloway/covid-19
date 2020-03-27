//===============================================
const url = 'https://pomber.github.io/covid19/timeseries.json';
//===============================================
const confirmed = {
    x: [],
    dx: [],
    qx: [],
    get_x: function() {
        return[this.x.map(v => v.val),  this.x.map(v => v.date)];
    },
    get_dx: function() {
        return [this.dx.map(v => v.val), this.dx.map(v => v.date)];
    },
    get_qx: function() {
        return [this.qx.map(v => v.val), this.qx.map(v => v.date)];
    },
    get_current_x: function() {
        return this.x[this.x.length-1].val;
    },
    get_current_qx: function() {
        return this.qx[this.qx.length-1].val;
    }
};
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
//===============================================
const update_graph = (data_set, graph_type, y_scale_type='linear', y_labels=confirmed.get_x[1], title=null, label=null, y_axis_label=null) => {
    config.options.title.text = title;
    config.data.datasets[0].label = label;
    config.options.scales.yAxes[0].scaleLabel.labelString = y_axis_label;

    config.options.scales.yAxes[0].type = y_scale_type;
    config.data.labels = y_labels;
    config.type = graph_type;
    config.data.datasets[0].data = data_set;
    window.myLine.update();
};
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

    const Ep = confirmed.get_current_qx();
    const Nd = confirmed.get_current_x();
    let Nd_1 = null;
    if ( Ep > 1.0)
        Nd_1 = Nd * Ep;
    else {
        const factor = 1.0 - Ep;
        Nd_1 = (1 + factor) * Nd;
    }
    Nd_1 = Math.round(Nd_1);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];
    const date = confirmed.get_x()[1][confirmed.get_x()[1].length-1].split('-');
    const yesterday = parseInt(date[2],10);
    const today = yesterday + 1;
    const month = months[parseInt(date[1],10)-1];

    function numberWithCommas(x) {
        x = parseInt(x,10);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const num_cases_yesterday = numberWithCommas(Nd);
    const expected_num_cases_today = numberWithCommas(Nd_1);
    
    document.getElementById('cases-text-current').innerHTML = 
        `Total Confirmed Cases Yesderday (${month}-${yesterday}): ${num_cases_yesterday}`;

    document.getElementById('cases-text-predicted').innerHTML = 
        `<u>Expected Total Cases Today</u> (${month}-${today}): 
            <u><b>${expected_num_cases_today}</b></u>`;
    
    document.getElementById('cases-text-growth-factor').innerHTML = 
        `Based on Yesterdays <a href="https://youtu.be/Kas0tIxDvrg?t=330">Growth Factor</a>: ${confirmed.get_current_qx().toFixed(2)}`;
}
//===============================================
async function setup_charts() {

    // Make request and wait on data
    await get_data().catch(err => console.log(err));

    // Initialize graph
    const initialize_graph = _ => {
        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config);
        update_graph(confirmed.get_x()[0], 'line', 'linear', confirmed.get_x()[1], 'Total Confirmed Cases', 'Total Confirmed Cases', 'Total Confirmed Cases');
    };
    initialize_graph(confirmed.get_x()[0], confirmed.get_x()[1]);  

    // Setup click-callbaks
    chart_callback__linear();
    chart_callback__change();
}
//===============================================
const chart_callback__linear = () => {

    // If clicked on then update window display
    const pill = document.getElementById('pill-linear');
    pill.addEventListener('click', () => {
        update_graph(confirmed.get_x()[0], 'line', 'linear', confirmed.get_x()[1]);
    });
};
//===============================================
const chart_callback__change = () => {

    const pill = document.getElementById('pill-change');
    pill.addEventListener('click', () => {
        update_graph(confirmed.get_dx()[0], 'bar', 'logarithmic', confirmed.get_dx()[1]);
    });
};
//===============================================
