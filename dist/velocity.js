define(["require", "exports", "./math", "./sixsigma"], function (require, exports, MathHelper, SixSigma) {
    "use strict";
    var Velocity = (function () {
        function Velocity() {
            this.period = 5;
            this.iterations = new Array();
        }
        Object.defineProperty(Velocity.prototype, "rollingAverage", {
            get: function () {
                if (this.iterations === undefined) {
                    return [0];
                }
                else {
                    var data = this.iterations.map(function (iteration) {
                        return iteration.totalPointsCompleted;
                    });
                    return MathHelper.movingAverage(data, this.period);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Velocity.prototype, "rollingStDev", {
            get: function () {
                if (this.iterations === undefined) {
                    return [0];
                }
                else {
                    var data = this.iterations.map(function (iteration) {
                        return iteration.totalPointsCompleted;
                    });
                    return MathHelper.movingFunction(data, this.period, MathHelper.standardDeviation);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Velocity.prototype, "average", {
            get: function () {
                if (this.iterations === undefined) {
                    return 0;
                }
                else {
                    var data = this.iterations.map(function (iteration) {
                        return iteration.totalPointsCompleted;
                    });
                    return MathHelper.average(data);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Velocity.prototype, "sixSigma", {
            get: function () {
                var data = this.iterations.map(function (iteration) {
                    return iteration.totalPointsCompleted;
                });
                return new SixSigma(data, false);
            },
            enumerable: true,
            configurable: true
        });
        return Velocity;
    }());
    return Velocity;
});
//# sourceMappingURL=velocity.js.map