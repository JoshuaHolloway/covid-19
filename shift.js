// ==============================================
const size = y => {
    const N = y.length;
    return [(N-1) / 2, N];
};
// ==============================================
const shift = (y, offset, N) => {
    let y_shifted = [];
    for (let i = 0; i < N; ++i)
        y_shifted.push(y[i] - offset);
    return y_shifted;
};
// ==============================================
const truncate = (y, N_size) => {
    let y_trunc = [];
    for (let i = 0; i <= N_size; ++i)
        y_trunc.push(y[i]);
    return y_trunc;
};
// ==============================================
const un_offset = (y_mirrored, offset, N) => {

    for (let i = 0; i < N; i++)
        y_mirrored[i] += offset;
    return y_mirrored;
};
// ==============================================
const mirror = y => {

    const [N_half, N] = size(y);
    const offset = y[N_half];

    const y_shifted = shift(y, offset, N);
    const y_trunc = truncate(y_shifted, N_half);

    const y_mirrored = y_trunc.slice();

    for (let i = N_half-1; i >= 0; i--) 
        y_mirrored.push(-y_trunc[i]);

    const y_final = un_offset(y_mirrored, offset, N);

    return y_final;
};
// ==============================================
let y = [0,1,2,4,6,7,8];

y_mirrored = mirror(y);
console.log(y_mirrored);