const data_arr = [];
const y_axis_labels = [];
const data__confirmed = [];
const data__confirmed__change = [];
const data__confirmed__growth_factor = [];
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
            label: 'Total Confirmed Cases',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: null,
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
//===============================================
const update_graph = (data_set, graph_type, y_scale_type='linear', y_labels=y_axis_labels) => {
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
        data_arr.push(elem);
        y_axis_labels.push(elem.date);
        data__confirmed.push(elem.confirmed);

        confirmed.x.push({'date': elem.date, 'val': elem.confirmed});
        deaths.x.push({'date': elem.date, 'val': elem.deaths});
        recovered.x.push({'date': elem.date, 'val': elem.recovered});
    });

    // [dx] Change
    for (let i = 1; i < data__confirmed.length; ++i) {
        //const x0 = data__confirmed[i-1];
        const x0 = confirmed.x[i-1].val;

        //const x1 = data__confirmed[i];
        const x1 = confirmed.x[i].val;
        const date_x1 = confirmed.x[i].date;
        const dx = x1 - x0;
        data__confirmed__change.push(dx);
        confirmed.dx.push({'date': date_x1, 'val': dx});
    }

    // [qx] Growth Factor
    for (let i = 1; i < data__confirmed__change.length; ++i) {
        //const dx0 = data__confirmed__change[i-1];
        const dx0 = confirmed.dx[i-1].val;
        
        //const dx1 = data__confirmed__change[i];
        const dx1 = confirmed.dx[i].val;
        const date_dx1 = confirmed.dx[i].date;
        
        let growth_factor = dx1 / dx0;
        if (dx0 < 1e-6)
            growth_factor = null;
        
        data__confirmed__growth_factor.push(growth_factor);
        confirmed.qx.push({date: date_dx1, val: growth_factor});
    }

    const Ep = data__confirmed__growth_factor[data__confirmed__growth_factor.length - 1];
    const Nd = data__confirmed[data__confirmed.length - 1];
    // const Nd_1 = Nd + Ep * Nd;

    let Nd_1 = null;
    if ( Ep > 1.0)
        Nd_1 = Nd * Ep;
    else {
        const factor = 1.0 - Ep;
        Nd_1 = (1 + factor) * Nd;
    }
    Nd_1 = Math.round(Nd_1);

    // console.log(`Current Growth Factor: ${Ep}`);
    // console.log(`Number of cases yesterday: ${Nd}`);
    // console.log(`Expected cases today ${Nd_1}`);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];
    const date = y_axis_labels[y_axis_labels.length-1].split('-');
    const today = parseInt(date[2],10);
    const tomorrow = today + 1;
    const month = months[parseInt(date[1],10)-1];
    
    document.getElementById('cases-text-current').innerHTML = 
        `Total Confirmed Cases Yesderday (${month}-${today}): ${Nd}`;

    document.getElementById('cases-text-predicted').innerHTML = 
        `<u>Expected Total Cases Today</u> (${month}-${tomorrow}): 
            <u><b>${Nd_1}</b></u>`;
    
    document.getElementById('cases-text-growth-factor').innerHTML = 
        `Based on Yesterdays <a href="https://youtu.be/Kas0tIxDvrg?t=330">Growth Factor</a>: ${Ep.toFixed(3)}`;

}
//===============================================
async function setup_charts() {

    // Make request and wait on data
    await get_data().catch(err => console.log(err));

    // Initialize graph
    const initialize_graph = _ => {
        var ctx = document.getElementById('canvas').getContext('2d');
        window.myLine = new Chart(ctx, config);
        update_graph(confirmed.get_x()[0], 'line', 'linear', confirmed.get_x()[1]);
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
