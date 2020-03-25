// ==============================================
const size = (x, y) => {
    if (x.length !== y.length)
        return null;

    // Ensure odd length
    if (x.length % 2 === 0)
        return null;

    const N = x.length;
    return [(N-1) / 2, N];
};
// ==============================================
const shift = (x, y) => {

    const [N_size, N] = size(x, y);
    const center = [x[N_size], y[N_size]];
    console.log(center);

    let x_shifted = [];
    let y_shifted = [];
    for (let i = 0; i < N; ++i) {
        x_shifted.push(x[i] - center[0]);
        y_shifted.push(y[i] - center[1]);
    }

    return [x_shifted, y_shifted];
};
// ==============================================
const truncate = (x, y) => {

    const [N_size, N] = size(x, y);
    let x_trunc = [];
    let y_trunc = [];
    for (let i = 0; i <= N_size; ++i) {
        x_trunc.push(x[i]);
        y_trunc.push(y[i]);
    }
    return [x_trunc, y_trunc];
};
// ==============================================
const mirror = (x_shifted, y_shifted) => {

    [x_shifted, y_shifted] = shift(x, y);
    [x_trunc, y_trunc] = truncate(x_shifted, y_shifted);

    let y_mirrored = y_trunc.slice();
    y_mirrored.push(-y_trunc[2]);
    y_mirrored.push(-y_trunc[1]);
    y_mirrored.push(-y_trunc[0]);

    return y_mirrored;
};
// ==============================================
let x = [0,1,2,3,4,5,6];
let y = [0,1,2,4,6,7,8];

y_mirrored = mirror(x, y);
console.log(y_mirrored);