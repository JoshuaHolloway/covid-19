clc, clear, close all;


% Original data
N = 67;
orig_x = [1:N];
orig_y = [1, 2, 2, 5, 5, 5, 5, 5, 7, 8, 8, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 15, 15, 15, 51, 51, 57, 58, 60, 68, 74, 98, 118, 149, 217, 262, 402, 518, 583, 959, 1281, 1663, 2179, 2727, 3499, 4632, 6421, 7783, 13677, 19100, 25489, 33276, 43847, 53740, 65778, 83836, 101657, 121478, 140886];
y_mirrored_part_2 = [160294, 180115, 197936, 215994, 228032, 237925, 248496, 256283, 262672, 268095, 273989, 275351, 277140, 278273, 279045, 279593, 280109, 280491, 280813, 281189, 281254, 281370, 281510, 281555, 281623, 281654, 281674, 281698, 281704, 281712, 281714, 281715,281721,281721,281757,281757,281757,281759,281759,281759,281759,281759,281759,281759,281759,281760,281760,281761,281761,281761,281761,281761,281761,281761,281761,281764,281764,281765,281767,281767,281767,281767,281767,281770,281770,281771];
    

% Shift x-axis to center
orig_x__ = orig_x - orig_x(N);

% Mirrored data
mirrored_x = [1:2*N-1];
mirrored_y = [orig_y, y_mirrored_part_2];

% Shift x-axis to center
mirrored_x__ = mirrored_x - mirrored_x(N);

figure, 
subplot(4,1,1); stem(orig_x, orig_y, 'k', 'fill');
subplot(4,1,2); stem(orig_x__, orig_y, 'k', 'fill');
subplot(4,1,3), stem(mirrored_x, mirrored_y, 'k', 'fill'); 
subplot(4,1,4), stem(mirrored_x__, mirrored_y, 'k', 'fill');


% General model:
%      f(x) = a/(1+exp(-b*x))
% Coefficients (with 95% confidence bounds):
%        a =   2.796e+05  (2.782e+05, 2.809e+05)
%        b =      0.2922  (0.2792, 0.3052)
% 
% Goodness of fit:
%   SSE: 3.594e+09
%   R-square: 0.9985
%   Adjusted R-square: 0.9985
%   RMSE: 5238
a =   2.796e+05;
b =      0.2922;
x = mirrored_x__;
[y] = sig(a,b,x);


figure(2),
plot(x, y);

% Print out comma seperated:
allOneString = sprintf('%.0f,', y);
allOneString = allOneString(1:end-1) % strip final comma

function [y] = sig(a, b, x)
    y = a ./ (1+exp(-b*x));
end

