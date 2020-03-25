clc, clear, close all;

X_gold = [1,4,3,4,5];
x      = [1,2,3];
figure(1),
subplot(3,1,1),
stem(x, 'fill', 'k');

% Step 1: Flip-y
x_1 = flip_y(x);
figure(1),
subplot(3,1,2),
stem(x_1, 'fill', 'k');

% Step 2: Flip-x (discarding modified center value)
x_2 = [x_1, 0, 0];
x_3 = flip_x(x_2);
N = length(x_2);


% figure(1),
% subplot(3,1,2),
% stem(x_1, 'fill', 'k');