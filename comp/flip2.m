clc, clear, close all;

X_gold = [5,4,3,4,5];
x      = [1,2,3,2,1];
x = do_flip(x);
stem(x, 'fill', 'k');

function [x] = do_flip(x)

    N = length(x);
    N_2 = (N-1) / 2;
    origin_x = N_2 + 1;
    origin_y = 2* x(origin_x);
    
    for i = 1:N
       x(i) = origin_y - x(i);
    end
    
end