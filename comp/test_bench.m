clc, clear, close all;
N = 66;
orig_x = [1:N];
orig_y = [1, 1, 2, 2, 5, 5, 5, 5, 5, 7, 8, 8, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 15, 15, 15, 51, 51, 57, 58, 60, 68, 74, 98, 118, 149, 217, 262, 402, 518, 583, 959, 1281, 1663, 2179, 2727, 3499, 4632, 6421, 7783, 13677, 19100, 25489, 33276, 43847, 53740, 65778, 83836, 101657];

% Shift to center
orig_x__ = orig_x - orig_x(N);
orig_y__ = orig_y - orig_y(N);


mirrored_x = [1:2*N-1];
mirrored_y = [1, 1, 2, 2, 5, 5, 5, 5, 5, 7, 8, 8, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 15, 15, 15, 51, 51, 57, 58, 60, 68, 74, 98, 118, 149, 217, 262, 402, 518, 583, 959, 1281, 1663, 2179, 2727, 3499, 4632, 6421, 7783, 13677, 19100, 25489, 33276, 43847, 53740, 65778, 83836, 101657, 119478, 137536, 149574, 159467, 170038, 177825, 184214, 189637, 195531, 196893, 198682, 199815, 200587, 201135, 201651, 202033, 202355, 202731, 202796, 202912, 203052, 203097, 203165, 203196, 203216, 203240, 203246, 203254, 203256, 203257, 203263, 203263, 203299, 203299,...
            203299, 203301, 203301, 203301, 203301, 203301, 203301, 203301, 203301, 203302, 203302, 203303, 203303, 203303, 203303, 203303, 203303, 203303,203303, 203306,203306, 203307,203309, 203309,203309, 203309,203309, 203312,203312, 203313,203313];

mirrored_x__ = mirrored_x - mirrored_x(66);
mirrored_y__ = mirrored_y - mirrored_y(66);

figure, 
subplot(4,1,1); stem(orig_x, orig_y, 'k', 'fill');
subplot(4,1,2); stem(orig_x__, orig_y__, 'k', 'fill');
subplot(4,1,3), stem(mirrored_x, mirrored_y, 'k', 'fill'); 
subplot(4,1,4), stem(mirrored_x__, mirrored_y__, 'k', 'fill'); 