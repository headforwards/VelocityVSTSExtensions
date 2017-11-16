/// <reference path="../node_modules/@types/google.visualization/index.d.ts" />

import Velocity = require("./velocity");
import IVelocityChart = require("./chart-interface");

class VelocityChart implements IVelocityChart {

    data: google.visualization.DataTable;
    outputLocation: Element;
    title: string = "";

    constructor(velocity: Velocity, divId: string, chartTitle: string) {

        this.outputLocation = document.getElementById(divId);
        this.title = chartTitle;
        this.data = new google.visualization.DataTable();

        this.data.addColumn("string", "Iteration"); // iteration.name
        this.data.addColumn("number", "Points Completed"); // iteration.pointsCompleted
        this.data.addColumn("number", "Average Velocity"); // velocity.rollingAverage
        this.data.addColumn({ type: "string", role: "annotation", label: "Annotation Indicator" });
        this.data.addColumn({ type: "string", role: "annotationText", label: "Annotation Tooltip" });
        this.data.addColumn({ type: "number", role: "interval", label: "Rolling Average Velocity LOW" }); // velocity.rollingAverage[n] - velocity.rollingStDev[n]
        this.data.addColumn({ type: "number", role: "interval", label: "Rolling Average Velocity HIGH" }); // velocity.rollingAverage[n] + velocity.rollingStDev[n]

        let counter = 0;
        velocity.iterations.forEach((iteration) => {
            this.data.addRow([
                iteration.name,
                iteration.totalPointsCompleted,
                velocity.rollingAverage[counter],
                ((counter === velocity.iterations.length - 2) ? "*" : undefined),
                "The current average velocity is " + velocity.rollingAverage[counter] + " ± " + ((velocity.rollingStDev[counter] === undefined) ? "" : velocity.rollingStDev[counter].toFixed(0)),
                velocity.rollingAverage[counter] - velocity.rollingStDev[counter],
                velocity.rollingAverage[counter] + velocity.rollingStDev[counter]
            ]);
            counter++;
        });
    }

    public draw() {

        // configure the required chart options
        let options: google.visualization.ComboChartOptions = {
            title: this.title,
            chartArea: {
                width: "90%",
                height: "80%"
            },
            bar: {
                groupWidth: "75%"
            },
            isStacked: true,
            legend: {
                position: "bottom",
                textStyle: {
                    fontSize: 10
                }
            },
            hAxis: {
                slantedText: true,
                slantedTextAngle: 90,
                showTextEvery: 1,
                minorGridlines: {
                    count: 1
                },
                title: "Iteration",
                titleTextStyle: {
                    fontSize: 10,
                    bold: true,
                    italic: false
                },
                textStyle: {
                    fontSize: 10
                }
            },
            vAxis: {
                title: "Story Points",
                gridlines: {
                    count: 7
                },
                viewWindow: {
                    min: 0
                },
                textStyle: {
                    fontSize: 10
                },
                titleTextStyle: {
                    fontSize: 10,
                    bold: true,
                    italic: false
                },
            },
            aggregationTarget: "category",
            seriesType: "bars",
            annotations: {
                style: "point",
                highContrast: true,
                textStyle: {
                    fontSize: 24,
                    bold: true,
                    italic: false
                },
                stem: {
                    length: 0,
                    color: "#3375FF" // blue
                }
    
            },
            series: {
                0: {
                    dataOpacity: 1.0,
                    color: "#64E44E" // green
                },
                1: {
                    type: "line",
                    color: "#3375FF", // blue
                    pointsVisible: false,
                    lineWidth: 3
                },
                2: {
                    type: "line",
                    lineDashStyle: [2, 2],
                    color: "#3375FF", // blue
                    pointsVisible: false,
                    lineWidth: 3
                },
                3: {
                    type: "line",
                    lineDashStyle: [2, 2],
                    color: "#3375FF", // blue
                    pointsVisible: false,
                    lineWidth: 3
                }
            }
        };

        // resize the chart location so that the chart resizes correctly
        var chartHeight: number = 300;
        var containerHeight = window.innerHeight;
        chartHeight = containerHeight * 0.9;
        this.outputLocation.setAttribute("style", "height: " + chartHeight + "px;");

        // draw the chart
        var comboChart = new google.visualization.ComboChart(this.outputLocation);
        comboChart.draw(this.data, options);
    }


}
export = VelocityChart;