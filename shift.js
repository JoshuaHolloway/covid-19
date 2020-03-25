// ==============================================
const shift = (y, offset) => {
    let y_shifted = [];
    for (let i = 0; i < y.length; ++i)
        y_shifted.push(y[i] - offset);
    return y_shifted;
};
// ==============================================
const un_offset = (y_mirrored, offset) => {
    for (let i = 0; i < y_mirrored.length; i++)
        y_mirrored[i] += offset;
    return y_mirrored;
};
// ==============================================
const mirror = y => {
    const N = y.length;
    const offset = y[N-1];
    const y_shifted = shift(y, offset);
    console.log(y_shifted);


    for (let i = Math.ceil(N/2)-1; i >= 0; i--) 
        y_shifted.push(-y_shifted[i]);
    return un_offset(y_shifted, offset, N);
};
// ==============================================
let y_gold = [0,1,2,4,6,7,8];
let y = [0,1,1,2,4];
y_mirrored = mirror(y);
console.log(y_mirrored);