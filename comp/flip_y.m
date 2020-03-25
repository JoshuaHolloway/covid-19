function [x] = flip_y(x)

    N = length(x);
    N_2 = (N-1) / 2;
    origin_x = N_2 + 1;
    origin_y = 2* x(origin_x);

    for i = 1:N
       x(i) = origin_y - x(i);
    end

end