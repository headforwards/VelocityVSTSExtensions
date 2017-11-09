define(["require", "exports", "q", "../node_modules/six-sigma-control-limits/ts/math", "./vsts-api"], function (require, exports, Q, MathHelper, VSTSApi) {
    "use strict";
    var Iteration = (function () {
        function Iteration(iteration, ctx) {
            this.workItemsAtStart = new Array();
            this.workItemsAtEnd = new Array();
            this.committedWorkItems = new Array();
            this.completedWorkItems = new Array();
            this.closedWorkItems = new Array();
            this.completedAndClosedWorkItems = new Array();
            this._context = ctx;
            this._tfsIteration = iteration;
            this.id = iteration.id;
            this.name = iteration.name;
            this.path = iteration.path;
            this.url = iteration.url;
            this.startDate = iteration.attributes.startDate;
            this.endDate = iteration.attributes.finishDate;
        }
        Iteration.prototype.getWorkItemInformation = function () {
            var _this = this;
            var deferred = Q.defer();
            var promises = [];
            promises.push(this.getWorkItemRefsInIterationAtStart());
            promises.push(this.getWorkItemRefsInIterationAtEnd());
            Q.all(promises).then(function (promiseResponse) {
                var startIds = _this.extractIdsFromQueryResult(promiseResponse[0]);
                var endIds = _this.extractIdsFromQueryResult(promiseResponse[0]);
                var detailsPromises = [];
                if (startIds.length > 0) {
                    detailsPromises.push(VSTSApi.getWorkItemDetails(startIds, _this._context.Fields, _this.reportStartDate));
                }
                if (endIds.length > 0) {
                    detailsPromises.push(VSTSApi.getWorkItemDetails(endIds, _this._context.Fields, _this.reportEndDate));
                }
                Q.all(detailsPromises).then(function (responses) {
                    if (responses[0] != undefined) {
                        _this.workItemsAtStart = responses[0];
                    }
                    if (responses[1] != undefined) {
                        _this.workItemsAtEnd = responses[1];
                    }
                    _this.getWorkItemsCompletedAndClosedInIteration(_this.workItemsAtEnd).then(function () {
                        _this.calculateMetrics();
                        deferred.resolve(_this);
                    });
                });
            });
            return deferred.promise;
        };
        Iteration.prototype.calculateMetrics = function () {
            if (this.workItemsAtEnd === undefined || this.workItemsAtStart === undefined || this._context === undefined || this.completedAndClosedWorkItems === undefined) {
                throw Error("One or more required properties are undefined.");
            }
            else {
                this.numberItems = (this.workItemsAtEnd.length > this.workItemsAtStart.length) ? this.workItemsAtEnd.length : this.workItemsAtStart.length;
                this.completedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.CompletedStates, this._context.StateField);
                this.totalPointsCompleted = this.calculateWorkItemTotal(this.completedWorkItems, this._context.EffortField);
                this.totalPoints = this.calculateWorkItemTotal(this.workItemsAtEnd, this._context.EffortField);
                this.committedWorkItems = this.extractWorkItems(this.workItemsAtStart, this._context.CommittedStates, this._context.StateField);
                this.pointsCommitted = this.calculateWorkItemTotal(this.committedWorkItems, this._context.EffortField);
                this.closedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.ClosedStates, this._context.StateField);
                this.totalPointsClosed = this.calculateWorkItemTotal(this.closedWorkItems, this._context.EffortField);
                var completedAndClosedPoints = this.calculateWorkItemTotal(this.completedAndClosedWorkItems, this._context.EffortField);
                this.totalPointsCompleted += completedAndClosedPoints;
                this.committedPointsCompleted = 0;
            }
        };
        Iteration.prototype.getWorkItemsCompletedAndClosedInIteration = function (workItems) {
            var _this = this;
            var deferred = Q.defer();
            var promises = [];
            var closedWorkItems = this.extractWorkItems(workItems, this._context.ClosedStates, this._context.StateField);
            promises = closedWorkItems.map(function (value, index, array) {
                return VSTSApi.getWorkItemRevisions(value.id);
            });
            Q.all(promises).then(function (responses) {
                var committedAndCompletedStates = _this._context.CommittedStates.concat(_this._context.CompletedStates).concat(_this._context.NewStates);
                if (responses != undefined) {
                    responses.forEach(function (element) {
                        var revisions = element;
                        if (_this.workItemComittedDuringIteration(revisions, committedAndCompletedStates, _this._context.StateField, _this.startDate)) {
                            _this.completedAndClosedWorkItems.push(revisions[0]);
                        }
                    });
                }
                deferred.resolve(_this);
            });
            return deferred.promise;
        };
        Iteration.prototype.getWorkItemRefsInIterationAtStart = function () {
            this.reportStartDate = this._tfsIteration.attributes.startDate.getNextWeekDayAtMidday();
            return VSTSApi.getWorkItemReferencesInIterationAtDate(this.reportStartDate, this._tfsIteration.path, this._context.TeamContext().projectId);
        };
        ;
        Iteration.prototype.getWorkItemRefsInIterationAtEnd = function () {
            this.reportEndDate = this._tfsIteration.attributes.finishDate.endOfDay();
            return VSTSApi.getWorkItemReferencesInIterationAtDate(this.reportEndDate, this._tfsIteration.path, this._context.TeamContext().projectId);
        };
        ;
        Iteration.prototype.workItemComittedDuringIteration = function (workItemRevisions, states, stateField, iterationStartDate) {
            var foundMatch = false;
            for (var i = workItemRevisions.length; i > 0; i--) {
                if (foundMatch)
                    break;
                var rev = workItemRevisions[i - 1];
                var changedDate = rev.fields["System.ChangedDate"];
                if (changedDate < iterationStartDate) {
                    break;
                }
                if (rev.fields[stateField] != undefined &&
                    states.indexOf(rev.fields[stateField].toLowerCase()) >= 0) {
                    foundMatch = true;
                    break;
                }
            }
            return foundMatch;
        };
        ;
        Iteration.prototype.extractIdsFromQueryResult = function (queryResult) {
            return queryResult.workItems.map(function (wi) {
                return wi.id;
            });
        };
        ;
        Iteration.prototype.extractWorkItems = function (workItems, states, stateField) {
            var wis = workItems.map(function (wi) {
                if (wi.fields[stateField] != undefined && states.indexOf(wi.fields[stateField].toLowerCase()) >= 0) {
                    return wi;
                }
            });
            return wis.filter(function (item) {
                return item != undefined;
            });
        };
        Iteration.prototype.calculateWorkItemTotal = function (workItems, valueField) {
            var values = workItems.map(function (wi) {
                if (wi != undefined) {
                    return wi.fields[valueField];
                }
                else {
                    return 0;
                }
            });
            return MathHelper.sum(values);
        };
        return Iteration;
    }());
    return Iteration;
});
//# sourceMappingURL=iteration.js.map