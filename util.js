//===============================================
function numberWithCommas(x) {
    x = parseInt(x,10);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//===============================================
const months = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];