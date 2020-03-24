const button_click_callback = (event) => {
console.log('CORONA button click!');
const url = 'https://pomber.github.io/covid19/timeseries.json';
fetch(url)
    .then(res => res.json())
    .then(data => {
    console.log(data);
    });
};
//===============================================
const button_elem = document.getElementById('josh');
button_elem.addEventListener('click', button_click_callback);
//===============================================