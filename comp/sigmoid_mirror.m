clc, clear, close all;

x = -20:0.5:20;
y = logsig(x) + 0.05*randn(1,length(x));
figure(1), 
subplot(3,1,1),
scatter(x, y, 'fill', 'k')

% -1 for the zero value
N = length(y) - 1;
N_2 = N/2;




% TODO: Grab the zeroth value on left side
%       by grabbing one less value at begginning of sequence.
START = 1;
END   =  START + (length(y)-1) / 2;

y_half = y(START : END);
x_half = x(START : END);

yyy   = [y_half,zeros(1,length(x_half))];
scatter(xxx, yyy, 'fill', 'k');

x_recon = 1:2*length(x_half);
y_recon = [y_half, flip(y_half)];
figure(1),
subplot(3,1,3),
scatter(x_recon, y_recon, 'fill', 'k')