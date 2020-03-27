const data_arr = [];
const y_axis_labels = [];
const data__confirmed = [];
const data__confirmed__change = [];
const data__confirmed__growth_factor = [];
const url = 'https://pomber.github.io/covid19/timeseries.json';
//===============================================
let config = {
    type: 'line',
    data: {
        labels: y_axis_labels,
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
const initialize_graph = (data_set) => {
    config.data.datasets[0].data = data_set;
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
};
//===============================================
const update_graph = (data_set, graph_type, y_scale_type='linear', y_labels=y_axis_labels) => {
    config.options.scales.yAxes.type = y_scale_type;
    config.data.labels = y_labels;
    config.type = graph_type;
    config.data.datasets[0].data = data_set;
    window.myLine.update();
};
//===============================================
use_data().catch(err => console.log(err));
//===============================================
async function get_data() {
    const resp = await fetch(url);
    const data = await resp.json();

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

    const Ep = data__confirmed__growth_factor[data__confirmed__growth_factor.length - 1];
    const Nd = data__confirmed[data__confirmed.length - 1];
    // const Nd_1 = Nd + Ep * Nd;

    let Nd_1 = null;
    if ( Ep > 1.0) {
        Nd_1 = Nd * Ep;
    }
    else {
        const factor = 1.0 - Ep;
        Nd_1 = (1 + factor) * Nd;
    }
    Nd_1 = Math.round(Nd_1);

    console.log(`Current Growth Factor: ${Ep}`);
    console.log(`Number of cases yesterday: ${Nd}`);
    console.log(`Expected cases today ${Nd_1}`);

    const date = y_axis_labels[y_axis_labels.length-1];
    document.getElementById('cases-text-current').innerHTML = 
        `Total Confirmed Cases Yesderday (${date}): ${Nd}`;

    const x = date.split('-');
    console.log(x);
    document.getElementById('cases-text-predicted').innerHTML = 
        `<u>Expected Total Cases Today</u> (${x[0]}-${x[1]}-${parseInt(x[2],10)+1}): 
            <u><b>${Nd_1}</b></u>`;
    
    document.getElementById('cases-text-growth-factor').innerHTML = 
        `Based on Yesterdays <a href="https://youtu.be/Kas0tIxDvrg?t=330">Growth Factor</a>: ${Ep.toFixed(3)}`;

}
//===============================================
async function use_data() {

    // Make request and wait on data
    await get_data().catch(err => console.log(err));

    // Initialize graph
    initialize_graph(data__confirmed);

    // Setup click-callbaks
    chart_callback__linear();
    chart_callback__change();
}
//===============================================
const chart_callback__linear = () => {

    // If clicked on then update window display
    const pill = document.getElementById('pill-linear');
    pill.addEventListener('click', () => {
        update_graph(data__confirmed, 'line');
    });
};
//===============================================
const chart_callback__change = () => {

    // TODO: Get more accurate with the slice indices
    const y_sliced = y_axis_labels.slice(0,y_axis_labels.length); 
    const x_change_sliced = data__confirmed__change.slice(0,
                            data__confirmed__change.length);

    const pill = document.getElementById('pill-change');
    pill.addEventListener('click', () => {

        update_graph(x_change_sliced, 'bar');
    });
};
//===============================================
