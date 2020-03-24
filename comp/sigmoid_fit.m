clear, clc, close all;

x = -10:0.01:10;
y = logsig(x) + 0.05*randn(1,length(x));
scatter(x,y)

% General model:
%      f(x) = a/(1+exp(-b*x))
% Coefficients (with 95% confidence bounds):
%        a =       1.001  (0.9974, 1.004)
%        b =       1.008  (0.9855, 1.03)

a = 1.001; % (0.9974, 1.004)
b = 1.008; % (0.9855, 1.03)
y_tild = a./(1+exp(-b*x));

figure,
scatter(x,y_tild)
