define(["require", "exports", "TFS/WorkItemTracking/Contracts", "TFS/WorkItemTracking/RestClient", "q", "../node_modules/six-sigma-control-limits/ts/math"], function (require, exports, WIT_Contracts, WIT_Client, Q, MathHelper) {
    "use strict";
    var Iteration = (function () {
        function Iteration(iteration, ctx) {
            this.workItemsAtStart = new Array();
            this.workItemsAtEnd = new Array();
            this.committedWorkItems = new Array();
            this.completedWorkItems = new Array();
            this.closedWorkItems = new Array();
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
                    detailsPromises.push(_this.getWorkItemDetails(startIds, _this.reportStartDate));
                }
                if (endIds.length > 0) {
                    detailsPromises.push(_this.getWorkItemDetails(endIds, _this.reportEndDate));
                }
                Q.all(detailsPromises).then(function (responses) {
                    if (responses[0] != undefined) {
                        _this.workItemsAtStart = responses[0];
                    }
                    if (responses[1] != undefined) {
                        _this.workItemsAtEnd = responses[1];
                    }
                    _this.calculateMetrics();
                    deferred.resolve(_this);
                });
            });
            return deferred.promise;
        };
        Iteration.prototype.calculateMetrics = function () {
            if (this.workItemsAtEnd === undefined || this.workItemsAtStart === undefined || this._context == undefined) {
                throw Error("One or more required properties are undefined.");
            }
            else {
                this.numberItems = (this.workItemsAtEnd.length > this.workItemsAtStart.length) ? this.workItemsAtEnd.length : this.workItemsAtStart.length;
                this.completedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.CompletedStates, this._context.StateField);
                this.totalPointsCompleted = this.calculateWorkItemTotal(this.completedWorkItems, this._context.Effort);
                this.totalPoints = this.calculateWorkItemTotal(this.workItemsAtEnd, this._context.Effort);
                this.committedWorkItems = this.extractWorkItems(this.workItemsAtStart, this._context.CommittedStates, this._context.StateField);
                this.pointsCommitted = this.calculateWorkItemTotal(this.committedWorkItems, this._context.Effort);
                this.closedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.ClosedStates, this._context.StateField);
                this.totalPointsClosed = this.calculateWorkItemTotal(this.closedWorkItems, this._context.Effort);
                this.committedPointsCompleted = 0;
            }
        };
        Iteration.prototype.getWorkItemDetails = function (ids, date) {
            if (ids.length === 0) {
                return;
            }
            var client = WIT_Client.getClient();
            var expand = WIT_Contracts.WorkItemExpand.None;
            var errorPolicy = WIT_Contracts.WorkItemErrorPolicy.Omit;
            return client.getWorkItems(ids, this._context.Fields, date, expand, errorPolicy);
        };
        ;
        Iteration.prototype.getWorkItemRefsInIterationAtStart = function () {
            this.reportStartDate = this._tfsIteration.attributes.startDate.getNextWeekDayAtMidday();
            return this.getWorkItemReferencesInIterationAtDate(this.reportStartDate);
        };
        ;
        Iteration.prototype.getWorkItemRefsInIterationAtEnd = function () {
            this.reportEndDate = this._tfsIteration.attributes.finishDate.endOfDay();
            return this.getWorkItemReferencesInIterationAtDate(this.reportEndDate);
        };
        ;
        Iteration.prototype.getWorkItemReferencesInIterationAtDate = function (asOfDate) {
            var query = { query: "" };
            query.query = "SELECT [System.Id] From WorkItems WHERE ([System.WorkItemType] = 'User Story' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Defect' OR [System.WorkItemType] = 'Bug') AND [Iteration Path] = '" +
                this._tfsIteration.path + "' ASOF '" +
                asOfDate.toISOString() + "'";
            return WIT_Client.getClient().queryByWiql(query, this._context.TeamContext().projectId);
        };
        ;
        Iteration.prototype.extractIdsFromQueryResult = function (queryResult) {
            return queryResult.workItems.map(function (wi) {
                return wi.id;
            });
        };
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