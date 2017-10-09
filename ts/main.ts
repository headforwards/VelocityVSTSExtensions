import Q = require("q");
import WIT_Client = require("TFS/WorkItemTracking/RestClient");
import Work_Client = require("TFS/Work/RestClient");
import WIT_Contracts = require("TFS/WorkItemTracking/Contracts");
import Work_Contracts = require("TFS/Work/Contracts");
import Core_Contracts = require("TFS/Core/Contracts");
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import Velocity = require("./velocity");
import "./date";

class Main {

    private static getTeamContext(): Core_Contracts.TeamContext {
        var ctx = VSS.getWebContext();
        return {
            projectId: ctx.project.id,
            teamId: ctx.team.id,
            project: ctx.project.name,
            team: ctx.team.name
        };
    }

    public test() {
        console.log("I am in the testing method");
    }

    // public tfsFields = [
    //     "System.Id",
    //     "System.Title",
    //     "System.State",
    //     "System.BoardColumn",
    //     "Microsoft.VSTS.Scheduling.Effort",
    //     "Microsoft.VSTS.Scheduling.StoryPoints",
    //     "System.WorkItemType"
    // ];

    /**
     * Returns a promise that retrieves the work items assigned to an iteration at the end of the iteration
     * @param iteration The iteration to process
     */
    private getWorkItemsInIterationAtEnd(iteration: Work_Contracts.TeamSettingsIteration): IPromise<WIT_Contracts.WorkItemQueryResult> {

        var query: WIT_Contracts.Wiql;
        query.query = "SELECT [System.Id] From WorkItems WHERE ([System.WorkItemType] = 'User Story' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Defect' OR [System.WorkItemType] = 'Bug') AND [Iteration Path] = '" +
            iteration.path + "' ASOF '" +
            iteration.attributes.finishDate.getNextWeekDayAtMidday().toISOString() + "'";

        // Get a WIT client to make REST calls to VSTS
        return WIT_Client.getClient().queryByWiql(query, Main.getTeamContext().projectId);
    }

    /**
     * Returns a promise that retrieves the work items assigned to an iteration at the start of the iteration
     * @param iteration The iteration to process
     */
    public static getWorkItemsInIterationAtStart(iteration: Work_Contracts.TeamSettingsIteration): IPromise<WIT_Contracts.WorkItemQueryResult> {

        var query: WIT_Contracts.Wiql;
        query = {query:""};
        query.query = "SELECT [System.Id] From WorkItems WHERE ([System.WorkItemType] = 'User Story' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Defect' OR [System.WorkItemType] = 'Bug') AND [Iteration Path] = '" +
            iteration.path + "' ASOF '" +
            iteration.attributes.startDate.endOfDay().toISOString() + "'";
        // Get a WIT client to make REST calls to VSTS
        return WIT_Client.getClient().queryByWiql(query, this.getTeamContext().projectId);
    }

    public getVelocityData() {
        console.log("In getVelocityData");
        // get data from TFS :-)
        var velocity: Velocity;

        // connect to TFS and retrieve all the iterations
        // build Iteration[]{startDate, endDate, id, name}
        var workApiClient = Work_Client.getClient();
        var witApiClient = WIT_Client.getClient();
        var iterations = workApiClient.getTeamIterations(Main.getTeamContext());
        var workItemsInIterationQuery: IPromise<WIT_Contracts.WorkItemQueryResult[]>;

        console.log("execute iterations query");

        iterations.then(function (i) {
            
            console.log("Retrieved iterations");

            i.forEach(element => {
                Main.getWorkItemsInIterationAtStart(element).then(function(iter){
                    console.log(iter);
                })
            });

            // console.log("waiting for Q");
            // Q.all(workItemsInIterationQuery).then((values) => {
    
            //     console.log("Q complete");
            //     console.log(values[0]);
            //     console.log(values[1]);
            //     console.log(values[2]);
    
            // });
    
            console.log("Done");
        })

        

        // for each iteration LOOP

        // get the work items in the iteration at the start of the iteration 23:59 ON THE START DATE

        // get the work items in the iteration at the end LUNCHTIME ON THE NEXT WEEKDAY AFTER THE END DATE

        // For all work items that are in a CLOSED state
        // loop through the history in reverse and capture any work items that were NEW or COMMITTED in this iteration
        // if there are matches add the points to the totalPointsCompleted variable


    }
}
export = Main;