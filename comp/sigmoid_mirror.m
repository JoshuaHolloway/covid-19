clc, clear, close all;

x = -20:0.5:20;
y = logsig(x) + 0.05*randn(1,length(x));
figure(1), 
subplot(3,1,1),
scatter(x, y, 'fill', 'k')

% -1 for the zero value
N = length(y) - 1;
N_2 = N/2;

y_half = y(1 : N_2);
x_half = x(1 : N_2);

figure(1),
subplot(3,1,2),
xxx = 1:2*length(x_half);
scatter(xxx, [y_half,zeros(1,length(x_half))], 'fill', 'k');

x_recon = 1:2*length(x_half);
y_recon = [y_half, flip(y_half)];
figure(1),
subplot(3,1,3),
scatter(x_recon, y_recon, 'fill', 'k')