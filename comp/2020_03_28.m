function [fitresult, gof] = createFit(mirrored_x__, mirrored_y)
%CREATEFIT(MIRRORED_X__,MIRRORED_Y)
%  Create a fit.
%
%  Data for 'ddd' fit:
%      X Input : mirrored_x__
%      Y Output: mirrored_y
%  Output:
%      fitresult : a fit object representing the fit.
%      gof : structure with goodness-of fit info.
%
%  See also FIT, CFIT, SFIT.

%  Auto-generated by MATLAB on 28-Mar-2020 13:14:22


%% Fit: 'ddd'.
[xData, yData] = prepareCurveData( mirrored_x__, mirrored_y );

% Set up fittype and options.
ft = fittype( 'a/(1+exp(-b*x))', 'independent', 'x', 'dependent', 'y' );
opts = fitoptions( 'Method', 'NonlinearLeastSquares' );
opts.Display = 'Off';
opts.StartPoint = [0.950222048838355 0.0344460805029088];

% Fit model to data.
[fitresult, gof] = fit( xData, yData, ft, opts );

% Plot fit with data.
figure( 'Name', 'ddd' );
h = plot( fitresult, xData, yData );
legend( h, 'mirrored_y vs. mirrored_x__', 'ddd', 'Location', 'NorthEast', 'Interpreter', 'none' );
% Label axes
xlabel( 'mirrored_x__', 'Interpreter', 'none' );
ylabel( 'mirrored_y', 'Interpreter', 'none' );
grid on


