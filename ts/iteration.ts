import Work_Contracts = require("TFS/Work/Contracts");
import WIT_Contracts = require("TFS/WorkItemTracking/Contracts");
import WIT_Client = require("TFS/WorkItemTracking/RestClient");
import Core_Contracts = require("TFS/Core/Contracts");
import Q = require("q");
import TfsConfig = require("./config");
import MathHelper = require("../node_modules/six-sigma-control-limits/ts/math");

class Iteration {
    id: string;
    name: string;
    path: string;
    url: string;
    startDate: Date;
    endDate: Date;

    numberItems: number;
    pointsCommitted: number;
    committedPointsCompleted: number;
    totalPoints: number;
    totalPointsCompleted: number;
    totalPointsClosed: number;

    workItemsAtStart: WIT_Contracts.WorkItem[] = new Array<WIT_Contracts.WorkItem>();
    workItemsAtEnd: WIT_Contracts.WorkItem[] = new Array<WIT_Contracts.WorkItem>();
    committedWorkItems: WIT_Contracts.WorkItem[] = new Array<WIT_Contracts.WorkItem>();
    completedWorkItems: WIT_Contracts.WorkItem[] = new Array<WIT_Contracts.WorkItem>();
    closedWorkItems: WIT_Contracts.WorkItem[] = new Array<WIT_Contracts.WorkItem>();

    reportStartDate: Date;
    reportEndDate: Date;

    private _context: TfsConfig;
    private _tfsIteration: Work_Contracts.TeamSettingsIteration;

    public constructor(iteration: Work_Contracts.TeamSettingsIteration, ctx: TfsConfig) {

        this._context = ctx;
        this._tfsIteration = iteration;

        this.id = iteration.id;
        this.name = iteration.name;
        this.path = iteration.path;
        this.url = iteration.url;
        this.startDate = iteration.attributes.startDate;
        this.endDate = iteration.attributes.finishDate;

    }

    public getWorkItemInformation(): Q.Promise<{}> {

        var deferred = Q.defer();
        var promises = [];

        promises.push(this.getWorkItemRefsInIterationAtStart());
        promises.push(this.getWorkItemRefsInIterationAtEnd());

        Q.all(promises).then((promiseResponse) => {

            var startIds = this.extractIdsFromQueryResult(<WIT_Contracts.WorkItemQueryResult>promiseResponse[0]);
            var endIds = this.extractIdsFromQueryResult(<WIT_Contracts.WorkItemQueryResult>promiseResponse[0]);

            // get the work items details
            var detailsPromises = [];

            if (startIds.length > 0) {
                detailsPromises.push(this.getWorkItemDetails(startIds, this.reportStartDate));
            }

            if (endIds.length > 0) {
                detailsPromises.push(this.getWorkItemDetails(endIds, this.reportEndDate));
            }

            Q.all(detailsPromises).then((responses) => {

                if (responses[0] != undefined) {
                    this.workItemsAtStart = <WIT_Contracts.WorkItem[]>responses[0];
                }

                if (responses[1] != undefined) {
                    this.workItemsAtEnd = <WIT_Contracts.WorkItem[]>responses[1];
                }

                this.calculateMetrics();

                deferred.resolve(this);

            });

        });

        return deferred.promise;
    }

    public calculateMetrics() {

        if (this.workItemsAtEnd === undefined || this.workItemsAtStart === undefined || this._context == undefined) {
            throw Error("One or more required properties are undefined.");
        } else {
            this.numberItems = (this.workItemsAtEnd.length > this.workItemsAtStart.length) ? this.workItemsAtEnd.length : this.workItemsAtStart.length;

            this.completedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.CompletedStates, this._context.StateField);
            this.totalPointsCompleted = this.calculateWorkItemTotal(this.completedWorkItems, this._context.Effort);

            this.totalPoints = this.calculateWorkItemTotal(this.workItemsAtEnd, this._context.Effort);

            this.committedWorkItems = this.extractWorkItems(this.workItemsAtStart, this._context.CommittedStates, this._context.StateField);
            this.pointsCommitted = this.calculateWorkItemTotal(this.committedWorkItems, this._context.Effort);

            // TODO For all work items that are in a CLOSED state
            // loop through the history in reverse and capture any work items that were NEW or COMMITTED in this iteration
            // if there are matches add the points to the totalPointsCompleted variable
            this.closedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.ClosedStates, this._context.StateField);
            this.totalPointsClosed = this.calculateWorkItemTotal(this.closedWorkItems, this._context.Effort);

            // TODO calculate how many points the team committed at the start of the
            // iteration were completed at the end of the iteration
            this.committedPointsCompleted = 0;
        }
    }


    /**
     * Returns a promise that retrieves the details of the specified work items
     */
    public getWorkItemDetails(ids: number[], date?: Date): IPromise<WIT_Contracts.WorkItem[]> {
        if (ids.length === 0) {
            return;
        }
        var client = WIT_Client.getClient();
        var expand = WIT_Contracts.WorkItemExpand.None;
        var errorPolicy = WIT_Contracts.WorkItemErrorPolicy.Omit;
        return client.getWorkItems(ids, this._context.Fields, date, expand, errorPolicy);
    };

    /**
     * Returns a promise that retrieves all the work item ids that were 
     * assigned to the iteration at the start of the iteration
     */
    public getWorkItemRefsInIterationAtStart(): IPromise<WIT_Contracts.WorkItemQueryResult> {
        this.reportStartDate = this._tfsIteration.attributes.startDate.getNextWeekDayAtMidday();
        return this.getWorkItemReferencesInIterationAtDate(this.reportStartDate);
    };

    /**
     * Returns a promise that retrieves all the work item ids that were 
     * assigned to the iteration at the end of the iteration
     */
    public getWorkItemRefsInIterationAtEnd(): IPromise<WIT_Contracts.WorkItemQueryResult> {
        this.reportEndDate = this._tfsIteration.attributes.finishDate.endOfDay();
        return this.getWorkItemReferencesInIterationAtDate(this.reportEndDate);
    };

    /**
     * Returns a promise that retrieves the work items assigned 
     * to an iteration at the specified date
     * @param asOfDate The date to use to query TFS
     */
    private getWorkItemReferencesInIterationAtDate(asOfDate: Date): IPromise<WIT_Contracts.WorkItemQueryResult> {

        var query: WIT_Contracts.Wiql = { query: "" };
        query.query = "SELECT [System.Id] From WorkItems WHERE ([System.WorkItemType] = 'User Story' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Defect' OR [System.WorkItemType] = 'Bug') AND [Iteration Path] = '" +
            this._tfsIteration.path + "' ASOF '" +
            asOfDate.toISOString() + "'";

        // Get a WIT client to make REST calls to VSTS
        return WIT_Client.getClient().queryByWiql(query, this._context.TeamContext().projectId);
    };

    /**
     * Extracts the id field from a work item query result and returns it as a number[]
     * @param queryResult the results to process
     */
    private extractIdsFromQueryResult(queryResult: WIT_Contracts.WorkItemQueryResult): number[] {
        return queryResult.workItems.map((wi) => {
            return wi.id;
        });
    }

    /**
     * Extracts a subset of work items from an array which have a specified state
     * @param workItems the array of work items to process
     * @param states the array of states to match on
     * @param stateField the work item field to use to match with the states 
     */
    private extractWorkItems(workItems: WIT_Contracts.WorkItem[], states: string[], stateField: string): WIT_Contracts.WorkItem[] {

        // create a subset of the work items to include only those which had the provided state
        var wis = workItems.map((wi: WIT_Contracts.WorkItem) => {
            if (wi.fields[stateField] != undefined && states.indexOf(wi.fields[stateField].toLowerCase()) >= 0) {
                // this work item state is a completed state
                return wi;
            }
        });

        // remove any undefined elements from the array these are created
        // when the work item doesn't match the query criteria above
        return wis.filter((item) => {
            return item != undefined;
        });
    }

    /**
     * Extracts the valueField from an array of work items and returns the total
     * @param workItems the work items to process
     * @param valueField the work item field to total
     */
    private calculateWorkItemTotal(workItems: WIT_Contracts.WorkItem[], valueField: string): number {

        // from the subset of work items create an array of the values
        var values = workItems.map((wi: WIT_Contracts.WorkItem) => {
            if (wi != undefined) {
                return wi.fields[valueField];
            } else {
                return 0;
            }
        });

        // Calculate the total value for all subset work items
        return MathHelper.sum(values);
    }
}
export = Iteration;