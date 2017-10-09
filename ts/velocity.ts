/// <reference path="iteration.ts" />
/// <reference path="../node_modules/six-sigma-control-limits/ts/math.ts" />
/// <reference path="../node_modules/six-sigma-control-limits/ts/sixsigma.ts" />

import Iteration = require("./iteration");
import MathHelper = require("../node_modules/six-sigma-control-limits/ts/math");
import SixSigma = require("../node_modules/six-sigma-control-limits/ts/sixsigma");

class Velocity {
    
    readonly period: number = 5; // the number of previous values to use in the rolling average calculation
    
    /**
     * The array of iterations in the project
     */
    public iterations: Iteration[];
    
    /**
     * Calculates a rolling average for the data array
     */
    public get rollingAverage(): number[] {

        if (this.iterations === undefined){
            // there are no iterations defined so return an array of zeros for average
            return [0];
        }
        else {
            // create data array of just the total points completed to average
            var data = this.iterations.map(function (iteration){
                return iteration.totalPointsCompleted;
            })

            // return the average
            return MathHelper.movingAverage(data, this.period);
        }//
    }

    /**
     * Calculates the average number of points completed in all the iterations
     */
    public get average(): number {

        if (this.iterations === undefined){
            // there are no iterations defined so return zero for average
            return 0;
        }
        else {
            // create data array of just the total points completed to average
            var data = this.iterations.map(function (iteration){
                return iteration.totalPointsCompleted;
            })

            // return the average
            return MathHelper.average(data);
        }
    }

    public get sixSigma(): SixSigma {

        var data = this.iterations.map(function (iteration){
            return iteration.totalPointsCompleted;
        });

        return new SixSigma(data, false);
    }
}

export = Velocity;