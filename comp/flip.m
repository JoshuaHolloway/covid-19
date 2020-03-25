clc, clear, close all;

x = [1,2,3,4,0,0,0];
x = do_flip(x);
stem(x, 'fill', 'k');

function [x] = do_flip(x)

    N = length(x);
    N_2 = (N-1)/2;
    K = N_2 + 1
    
    for i = 1:N_2
       x(K + i) = x(K - i);
    end
    
end