define(["require", "exports"], function (require, exports) {
    "use strict";
    var VelocityControlChart = (function () {
        function VelocityControlChart(velocity, divId, chartTitle) {
            var _this = this;
            this.title = "";
            this.outputLocation = document.getElementById(divId);
            this.title == chartTitle;
            this.data = new google.visualization.DataTable();
            this.data.addColumn("string", "Iteration");
            this.data.addColumn("number", "Points Completed");
            this.data.addColumn({ type: "string", role: "annotation", label: "anyPointGreaterThanThreeSigmaLimit" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "twoConsecutivePointsAboveTwoSigmaLimit" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "threeConsecutivePointsAboveOneSigmaLimit" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "sevenConsecutivePointsFallingAboveCL" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "tenConsecutivePointsFallingBelowCL" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "fourConsecutivePointsBelowTwoSigmaLowerLimit" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "sixConsecutivePointsBelowOneSigmaLowerLimit" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "sixPointsInARowContinuallyIncresingOrDecresing" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "fourteenPointsInARowAlternateUpAndDown" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "fifteenPointsInARowWithinOneSigmaLimitOnEitherSideOfCentreLine" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "annotation", label: "eightPointsInARowOutsideOneSigmaOfCentreLineAndPointsAreBothSideOfCentreLine" });
            this.data.addColumn({ type: "string", role: "annotationText", label: "Control Limit Description" });
            this.data.addColumn({ type: "string", role: "style" });
            this.data.addColumn("number", "CL");
            this.data.addColumn("number", "1σ LCL");
            this.data.addColumn("number", "1σ HCL");
            this.data.addColumn("number", "2σ LCL");
            this.data.addColumn("number", "2σ HCL");
            this.data.addColumn("number", "LCL");
            this.data.addColumn("number", "HCL");
            var counter = 0;
            velocity.iterations.forEach(function (iteration) {
                var highlighPointStyling = "";
                if ((velocity.sixSigma.anyPointGreaterThanThreeSigmaLimit[counter] != undefined) ||
                    (velocity.sixSigma.twoConsecutivePointsAboveTwoSigmaLimit[counter] != undefined) ||
                    (velocity.sixSigma.threeConsecutivePointsAboveOneSigmaLimit[counter] != undefined) ||
                    (velocity.sixSigma.sevenConsecutivePointsFallingAboveCL[counter] != undefined) ||
                    (velocity.sixSigma.tenConsecutivePointsFallingBelowCL[counter] != undefined) ||
                    (velocity.sixSigma.fourConsecutivePointsBelowTwoSigmaLowerLimit[counter] != undefined) ||
                    (velocity.sixSigma.sixConsecutivePointsBelowOneSigmaLowerLimit[counter] != undefined) ||
                    (velocity.sixSigma.sixPointsInARowContinuallyIncresingOrDecresing[counter] != undefined) ||
                    (velocity.sixSigma.fourteenPointsInARowAlternateUpAndDown[counter] != undefined) ||
                    (velocity.sixSigma.fifteenPointsInARowWithinOneSigmaLimitOnEitherSideOfCentreLine[counter] != undefined) ||
                    (velocity.sixSigma.eightPointsInARowOutsideOneSigmaOfCentreLineAndPointsAreBothSideOfCentreLine[counter] != undefined)) {
                    highlighPointStyling = "point {visible: true; fill-color: #FF0000}";
                }
                _this.data.addRow([
                    iteration.name,
                    iteration.totalPointsCompleted,
                    velocity.sixSigma.anyPointGreaterThanThreeSigmaLimit[counter],
                    "Point is greater than 3 sigma upper limit",
                    velocity.sixSigma.twoConsecutivePointsAboveTwoSigmaLimit[counter],
                    "2 consecutive points above 2σ upper limit",
                    velocity.sixSigma.threeConsecutivePointsAboveOneSigmaLimit[counter],
                    "3 consecutive points above 1σ upper limit",
                    velocity.sixSigma.sevenConsecutivePointsFallingAboveCL[counter],
                    "7 consecutive points above centre line",
                    velocity.sixSigma.tenConsecutivePointsFallingBelowCL[counter],
                    "10 consecutive points below centre line",
                    velocity.sixSigma.fourConsecutivePointsBelowTwoSigmaLowerLimit[counter],
                    "4 consecutive points below 2σ lower limit",
                    velocity.sixSigma.sixConsecutivePointsBelowOneSigmaLowerLimit[counter],
                    "6 consecutive points below 1σ lower limit",
                    velocity.sixSigma.sixPointsInARowContinuallyIncresingOrDecresing[counter],
                    "6 points in a row continually increasing or decreasing",
                    velocity.sixSigma.fourteenPointsInARowAlternateUpAndDown[counter],
                    "14 points in a row alternating up and down",
                    velocity.sixSigma.fifteenPointsInARowWithinOneSigmaLimitOnEitherSideOfCentreLine[counter],
                    "15 points in a row are all within 1σ of the centre line and on either side of the centre line.",
                    velocity.sixSigma.eightPointsInARowOutsideOneSigmaOfCentreLineAndPointsAreBothSideOfCentreLine[counter],
                    "8 points in a row exist, but none within 1σ of the centre line, and the points are in both directions from the centre line.",
                    highlighPointStyling,
                    velocity.sixSigma.centreConfidenceLimit,
                    velocity.sixSigma.oneSigmaLowerConfidenceLimit,
                    velocity.sixSigma.oneSigmaUpperConfidenceLimit,
                    velocity.sixSigma.twoSigmaLowerConfidenceLimit,
                    velocity.sixSigma.twoSigmaUpperConfidenceLimit,
                    velocity.sixSigma.lowerConfidenceLimit,
                    velocity.sixSigma.upperConfidenceLimit
                ]);
                counter++;
            });
        }
        VelocityControlChart.prototype.draw = function () {
            var options = {
                legend: {
                    position: "bottom",
                    textStyle: {
                        fontSize: 10
                    }
                },
                chartArea: {
                    width: "90%",
                    height: "70%"
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
                    textStyle: {
                        fontSize: 10
                    },
                    titleTextStyle: {
                        fontSize: 10,
                        bold: true,
                        italic: false
                    }
                },
                annotations: {
                    style: "point",
                    highContrast: true,
                    textStyle: {
                        fontSize: 24,
                        bold: true,
                        italic: false,
                        color: "#FF0000"
                    },
                    boxStyle: {},
                    stem: {
                        length: 0,
                        color: "#FF0000"
                    }
                },
                series: {
                    0: {
                        type: "line",
                        color: "#33FF57",
                        pointsVisible: true,
                        pointSize: 5,
                        pointShape: "diamond",
                        pointColor: "#FF0000",
                        lineWidth: 2
                    },
                    1: this.controlLimitFormat(0),
                    2: this.controlLimitFormat(1),
                    3: this.controlLimitFormat(1),
                    4: this.controlLimitFormat(2),
                    5: this.controlLimitFormat(2),
                    6: this.controlLimitFormat(3),
                    7: this.controlLimitFormat(3)
                }
            };
            var chartHeight = 300;
            var containerHeight = window.innerHeight;
            chartHeight = containerHeight * 0.9;
            this.outputLocation.setAttribute("style", "height: " + chartHeight + "px;");
            var comboChart = new google.visualization.LineChart(this.outputLocation);
            comboChart.draw(this.data, options);
        };
        VelocityControlChart.prototype.controlLimitFormat = function (sigma) {
            return {
                type: "line",
                color: "#3375FF",
                pointsVisible: false,
                lineWidth: 2,
                lineDashStyle: [sigma, sigma],
                visibleInLegend: true
            };
        };
        return VelocityControlChart;
    }());
    return VelocityControlChart;
});
//# sourceMappingURL=velocity-control-chart.js.map