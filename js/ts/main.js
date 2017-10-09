define(["require", "exports", "TFS/WorkItemTracking/RestClient", "TFS/Work/RestClient", "./datetimeHelper"], function (require, exports, WIT_Client, Work_Client, DateTimeHelper) {
    "use strict";
    var Main = (function () {
        function Main() {
        }
        Main.getTeamContext = function () {
            var ctx = VSS.getWebContext();
            return {
                projectId: ctx.project.id,
                teamId: ctx.team.id,
                project: ctx.project.name,
                team: ctx.team.name
            };
        };
        Main.prototype.test = function () {
            console.log("I am in the testing method");
        };
        Main.prototype.getWorkItemsInIterationAtEnd = function (iteration) {
            var query;
            query.query = "SELECT [System.Id] From WorkItems WHERE ([System.WorkItemType] = 'User Story' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Defect' OR [System.WorkItemType] = 'Bug') AND [Iteration Path] = '" +
                iteration.path + "' ASOF '" +
                DateTimeHelper.getNextWeekDayAtMidday(iteration.attributes.finishDate).toISOString() + "'";
            return WIT_Client.getClient().queryByWiql(query, Main.getTeamContext().projectId);
        };
        Main.getWorkItemsInIterationAtStart = function (iteration) {
            var query;
            query = { query: "" };
            query.query = "SELECT [System.Id] From WorkItems WHERE ([System.WorkItemType] = 'User Story' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Defect' OR [System.WorkItemType] = 'Bug') AND [Iteration Path] = '" +
                iteration.path + "' ASOF '" +
                DateTimeHelper.endOfDay(iteration.attributes.startDate).toISOString() + "'";
            return WIT_Client.getClient().queryByWiql(query, this.getTeamContext().projectId);
        };
        Main.prototype.getVelocityData = function () {
            console.log("In getVelocityData");
            var velocity;
            var workApiClient = Work_Client.getClient();
            var witApiClient = WIT_Client.getClient();
            var iterations = workApiClient.getTeamIterations(Main.getTeamContext());
            var workItemsInIterationQuery;
            console.log("execute iterations query");
            iterations.then(function (i) {
                console.log("Retrieved iterations");
                i.forEach(function (element) {
                    Main.getWorkItemsInIterationAtStart(element).then(function (iter) {
                        console.log(iter);
                    });
                });
                console.log("Done");
            });
        };
        return Main;
    }());
    return Main;
});
//# sourceMappingURL=main.js.map