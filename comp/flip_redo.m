% ===========================
clc, clear, close all;
% ===========================
x = [0,1,2,3,4,5,6];
y = [0,1,2,4,6,7,8];
% ===========================
figure(1),
stem(x,y,'fill','k');
% ===========================
[x_shifted, y_shifted] = shift(x,y);
figure(1),
stem(x_shifted, y_shifted, 'fill', 'k');
% ===========================
function [o] = origin(x, y)
    N = length(y);
    N_2 = (N-1)/2;
    N_half = N_2 + 2;
    
    o = [x(N_half), y(N_half)];
end
% ===========================
function [x_shifted, y_shifted] = shift(x,y)
    orig = origin(x,y)
    xo = orig(1);
    yo = orig(2);
    x_shifted = x - xo + 1;
    y_shifted = y - yo;
end
% ===========================