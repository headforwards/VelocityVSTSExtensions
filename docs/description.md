# Velocity Control Charts

This extension adds the ability to display your teams' historical velocity as a dashboard widget. There are two visualisation options:

1. A simple velocity bar chart showing the velocity for each iteration as well as a line chart overlay showing the rolling average for the past 5 iterations.
2. A six sigma style control chart showing the velocity for each iteration which highlights any iterations where the velocity is a potential outlier.

The chart can be easily resized to display as a small summary widget or a larger widget showing more detail.

## Velocity Chart
The velocity chart displays the number of points completed for each iteration as well as the rolling 5-iteration average. It also highlights the latest rolling average to make it easy to identify how much work your team are likely to deliver in the next iteration.

![Velocity Chart Example](img/velocity.png)

## Control Chart
The control chart automatically calculates six sigma control limits across your historic velocity data and highlights any iterations that violate the following rules:

* [WESTERN ELECTRIC ASYMETRIC CONTROL LIMIT RULES](https://en.wikipedia.org/wiki/Western_Electric_rules)
* [NELSON CONTROL LIMIT RULES](https://en.wikipedia.org/wiki/Nelson_rules)

This provides a quick indicator of any iteration that is outside the bounds of the normal variation of the dataset and can be helpful to trigger retrospective discussions within the team. The calculated centre line is the long-term average velocity for your team and is useful to use for long-term forecasting.

![Control Chart Example](img/control.png)