// ==============================================
const mirror = x => {
    const N = x.length;
    // Compute the second half 
    // (starting after current day: x[N-1])
    // Should have total number: 2*N - 1
    // [0:N-1]: N-elements, where N-1 is todays value (mirror point)
    // [N:2N-2]: (N-1)-elements
    //
    // e.g.: N=66 => 66*2-1 = 132-1 = 131
    //       [0:N-1] = [0:66-1]     = [0:65]   = (MATLAB)[1:66]
    //       [N:2N-2] = [66:2*66-2] = [66:130] = (MATLAB)[67:131]
    const X = x.slice(); // copy by value
    const N1 = N-1;
    const N2 = N-2;
    for (let i = 0; i < N-1; i++) {
        const change = X[N1-i] - X[N2-i];
        const prev = X[N1+i];
        X[N+i] = prev + change;
        //console.log(`x[(N-1)-i]: ${x[(N-1)-i]},     x[(N-2)-i]: ${x[(N-2)-i]}`);
    }
    return X;
};
// ==============================================