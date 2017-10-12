define(["require", "exports"], function (require, exports) {
    "use strict";
    var VelocityChart = (function () {
        function VelocityChart(velocity, divId, chartTitle) {
            var _this = this;
            this.title = "";
            this.outputLocation = document.getElementById(divId);
            this.title == chartTitle;
            this.data = new google.visualization.DataTable();
            this.data.addColumn("string", "Iteration");
            this.data.addColumn("number", "Points Completed");
            this.data.addColumn("number", "Average Velocity");
            this.data.addColumn({ type: "string", role: "annotation" });
            this.data.addColumn({ type: "string", role: "annotationText" });
            this.data.addColumn({ type: "number", role: "interval" });
            this.data.addColumn({ type: "number", role: "interval" });
            var counter = 0;
            velocity.iterations.forEach(function (iteration) {
                _this.data.addRow([
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
        VelocityChart.prototype.draw = function () {
            var chartHeight = 300;
            var containerHeight = window.innerHeight;
            chartHeight = containerHeight * 0.9;
            this.outputLocation.setAttribute("style", "height: " + chartHeight + "px;");
            var comboChart = new google.visualization.ComboChart(this.outputLocation);
            comboChart.draw(this.data, this.options);
        };
        Object.defineProperty(VelocityChart.prototype, "options", {
            get: function () {
                return {
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
                            color: "#3375FF"
                        }
                    },
                    series: {
                        0: {
                            dataOpacity: 1.0,
                            color: "#64E44E"
                        },
                        1: {
                            type: "line",
                            color: "#3375FF",
                            pointsVisible: false,
                            lineWidth: 3
                        },
                        2: {
                            type: "line",
                            lineDashStyle: [2, 2],
                            color: "#3375FF",
                            pointsVisible: false,
                            lineWidth: 3
                        },
                        3: {
                            type: "line",
                            lineDashStyle: [2, 2],
                            color: "#3375FF",
                            pointsVisible: false,
                            lineWidth: 3
                        }
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        return VelocityChart;
    }());
    return VelocityChart;
});
//# sourceMappingURL=velocity-chart.js.map