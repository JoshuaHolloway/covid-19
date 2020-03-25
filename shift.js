// ==============================================
const half = (x, y) => {
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

    const [N_half, N] = half(x, y);
    const center = [x[N_half], y[N_half]];
    console.log(center);

    let x_shifted = [];
    let y_shifted = [];
    for (let i = 0; i < N; ++i) {
        x_shifted.push(x[i] - center[0]);
        y_shifted.push(y[i] - center[1]);
    }

    console.log(x_shifted);
    console.log(y_shifted);

    return [x_shifted, y_shifted];
};
// ==============================================
const truncate = (x, y) => {

    const [N_half, N] = half(x, y);
    let x_trunc = [];
    let y_trunc = [];
    for (let i = 0; i <= N_half; ++i) {
        x_trunc.push(x[i]);
        y_trunc.push(y[i]);
    }
    return [x_trunc, y_trunc];
};
// ==============================================
x = [0,1,2,3,4,5,6];
y = [0,1,2,4,6,7,8];
[x_shifted, y_shifted] = shift(x, y);
[x_trunc, y_trunc] = truncate(x_shifted, y_shifted);

console.log(x_trunc);
console.log(y_trunc);