/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./math.ts" />

import Work_Contracts = require("TFS/Work/Contracts");
import WIT_Contracts = require("TFS/WorkItemTracking/Contracts");
import WIT_Client = require("TFS/WorkItemTracking/RestClient");
import Core_Contracts = require("TFS/Core/Contracts");
import Q = require("q");
import ITfsConfig = require("./config");
import MathHelper = require("./math");
import VSTSApi = require("./vsts-api");

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
    completedAndClosedWorkItems: WIT_Contracts.WorkItem[] = new Array<WIT_Contracts.WorkItem>();

    reportStartDate: Date;
    reportEndDate: Date;

    private _context: ITfsConfig;

    public constructor(iteration: Work_Contracts.TeamSettingsIteration, ctx: ITfsConfig) {

        this._context = ctx;

        this.id = iteration.id;
        this.name = iteration.name;
        this.path = iteration.path;
        this.url = iteration.url;
        this.startDate = iteration.attributes.startDate;
        this.endDate = iteration.attributes.finishDate;
        this.reportStartDate = iteration.attributes.startDate.endOfDay();
        this.reportEndDate = iteration.attributes.finishDate.getNextWeekDayAtMidday();

    }

    public getWorkItemInformation(): Q.Promise<{}> {

        var deferred = Q.defer();
        var promises = [];

        promises.push(this.getWorkItemRefsInIterationAtStart());
        promises.push(this.getWorkItemRefsInIterationAtEnd());

        Q.all(promises).then((promiseResponse) => {

            var startIds = this.extractIdsFromQueryResult(<WIT_Contracts.WorkItemQueryResult>promiseResponse[0]);
            var endIds = this.extractIdsFromQueryResult(<WIT_Contracts.WorkItemQueryResult>promiseResponse[1]);

            // get the work items details
            var detailsPromises = [];

            if (startIds.length > 0) {
                detailsPromises.push(VSTSApi.getWorkItemDetails(startIds, this._context.Fields, this.reportStartDate));
            }

            if (endIds.length > 0) {
                detailsPromises.push(VSTSApi.getWorkItemDetails(endIds, this._context.Fields, this.reportEndDate));
            }

            Q.all(detailsPromises).then((responses) => {

                if (responses[0] != undefined) {
                    this.workItemsAtStart = <WIT_Contracts.WorkItem[]>responses[0];
                }

                if (responses[1] != undefined) {
                    this.workItemsAtEnd = <WIT_Contracts.WorkItem[]>responses[1];
                }

                // get the work items that were closed at the end of the iteration 
                // but were also worked on in the iteration 
                this.getWorkItemsCompletedAndClosedInIteration(this.workItemsAtEnd).then(() => {
                    
                    this.calculateMetrics();
                    deferred.resolve(this);

                });

            });

        });

        return deferred.promise;
    }

    /**
     * Calculates the total number of points completed within the iteration
     */
    public calculateMetrics() {

        if (this.workItemsAtEnd === undefined || this.workItemsAtStart === undefined || this._context === undefined || this.completedAndClosedWorkItems === undefined) {
            throw Error("One or more required properties are undefined.");
        } else {
            this.numberItems = (this.workItemsAtEnd.length > this.workItemsAtStart.length) ? this.workItemsAtEnd.length : this.workItemsAtStart.length;

            this.completedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.CompletedStates, this._context.StateField);
            this.totalPointsCompleted = this.calculateWorkItemTotal(this.completedWorkItems, this._context.EffortField);

            this.totalPoints = this.calculateWorkItemTotal(this.workItemsAtEnd, this._context.EffortField);

            this.committedWorkItems = this.extractWorkItems(this.workItemsAtStart, this._context.CommittedStates, this._context.StateField);
            this.pointsCommitted = this.calculateWorkItemTotal(this.committedWorkItems, this._context.EffortField);

            this.closedWorkItems = this.extractWorkItems(this.workItemsAtEnd, this._context.ClosedStates, this._context.StateField);
            this.totalPointsClosed = this.calculateWorkItemTotal(this.closedWorkItems, this._context.EffortField);

            // update the points completed during the iteration with the work items that 
            // were worked on during the iteration but closed before the end of the iteration
            var completedAndClosedPoints = this.calculateWorkItemTotal(this.completedAndClosedWorkItems, this._context.EffortField);
            this.totalPointsCompleted += completedAndClosedPoints;

            // TODO calculate how many points the team committed at the start of the
            // iteration were completed at the end of the iteration
            this.committedPointsCompleted = 0;
        }
    }

    /**
     * Return a new filtered array of the supplied work items containing all work items that were both 
     * closed at the end of the iteration and also worked on during the iteration
     * @param workItems: the work items array to filter
     */
    public getWorkItemsCompletedAndClosedInIteration(workItems: WIT_Contracts.WorkItem[]): Q.Promise<{}> {
        
        var deferred = Q.defer();
        var promises = [];

        // filter the provided work items to only those with a closed status
        var closedWorkItems = this.extractWorkItems(workItems, this._context.ClosedStates, this._context.StateField);

        // for each closed work item get the revision history 
        promises = closedWorkItems.map(function(value: WIT_Contracts.WorkItem, index: number, array: WIT_Contracts.WorkItem[]): any {
            return VSTSApi.getWorkItemRevisions(value.id);
        });

        // wait for all the promises to return
        Q.all(promises).then((responses) => {
            
            // we need to check whether the work item was either committed or completed
            // during the iteration so concatenate both sets of statuses to ease the comparison logic
            var committedAndCompletedStates: string[] = this._context.CommittedStates.concat(this._context.CompletedStates).concat(this._context.NewStates);

            // check whether the work item was worked on during the iteration
            // if so add the latest revision to the class property
            if (responses != undefined) {
                responses.forEach(element => {
                    var revisions: WIT_Contracts.WorkItem[] = <WIT_Contracts.WorkItem[]>element;
                    if (this.workItemComittedDuringIteration(revisions, committedAndCompletedStates, this._context.StateField, this.startDate)) {
                        this.completedAndClosedWorkItems.push(revisions[0]);
                    }
                });
            }

            deferred.resolve(this);
        });

        return deferred.promise;
    }

     /**
     * Returns a promise that retrieves all the work item ids that were 
     * assigned to the iteration at the start of the iteration
     */
    public getWorkItemRefsInIterationAtStart(): IPromise<WIT_Contracts.WorkItemQueryResult> {
        return VSTSApi.getWorkItemReferencesInIterationAtDate(this.reportStartDate, this.path, this._context.TeamContext().projectId);
    };

    /**
     * Returns a promise that retrieves all the work item ids that were 
     * assigned to the iteration at the end of the iteration
     */
    public getWorkItemRefsInIterationAtEnd(): IPromise<WIT_Contracts.WorkItemQueryResult> {
        return VSTSApi.getWorkItemReferencesInIterationAtDate(this.reportEndDate, this.path, this._context.TeamContext().projectId);
    };

    /**
     * Returns true if the work item had one of the provided states during the iteration
     * @param workItemRevisions an array of work item revisions
     * @param states the array of states to check for
     * @param stateField the field to check the states against
     * @param iterationStartDate the start date of the iteration
     */
    private workItemComittedDuringIteration(workItemRevisions: WIT_Contracts.WorkItem[], states: string[], stateField: string, iterationStartDate: Date): boolean {
        
        var foundMatch: boolean = false;

        for (var i = workItemRevisions.length; i > 0; i--) {
            // exit if we have already found a match
            if (foundMatch) break;

            var rev: WIT_Contracts.WorkItem = workItemRevisions[i - 1];
            var changedDate = rev.fields["System.ChangedDate"];
            
            if (changedDate < iterationStartDate)
            {
                // this revision was made before the iteration started so exit loop
                break;
            }

            if (rev.fields[stateField] != undefined && 
                states.indexOf(rev.fields[stateField].toLowerCase()) >= 0) {
                // this work item revision state is committed or completed
                // so it was worked on during this iteration so we can exit
                foundMatch = true;
                break;
            }
         }

        return foundMatch;
    };

    /**
     * Extracts the id field from a work item query result and returns it as a number[]
     * @param queryResult the results to process
     */
    private extractIdsFromQueryResult(queryResult: WIT_Contracts.WorkItemQueryResult): number[] {
        return queryResult.workItems.map((wi) => {
            return wi.id;
        });
    };

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