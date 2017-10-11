import Core_Contracts = require("TFS/Core/Contracts");

class TfsConfig {

    public TeamContext(): Core_Contracts.TeamContext {
        var ctx = VSS.getWebContext();
        return {
            projectId: ctx.project.id,
            teamId: ctx.team.id,
            project: ctx.project.name,
            team: ctx.team.name
        };
    };

    public Fields = [
        "System.Id",
        "System.Title",
        "System.State",
        "System.BoardColumn",
        "Microsoft.VSTS.Scheduling.Effort",
        "Microsoft.VSTS.Scheduling.StoryPoints",
        "System.WorkItemType"
    ];

    public NewStates = [
        "new",
        "approved",
        "ready for review",
        "1. new", // Column name in TFS changed on 21/09/2017
        "2. ready for review", // Column name in TFS changed on 21/09/2017
        "3. approved", // Column name in TFS changed on 21/09/2017
    ];

    public CommittedStates = [
        "committed",
        "4. committed" // Column name in TFS changed on 21/09/2017 
    ];

    public CompletedStates = [
        "deployed to staging" ,
        "ready for release" ,
        "ready for staging" , // Ready for Release column name in TFS changed on 21/07/2016
        "ready for environments team", // Ready for Staging column name in TFS changed on 21/07/2016
        "5. ready for environments team", // Ready for Staging column name in TFS changed on 21/09/2017
        "6. deployed to staging", // Column name in TFS changed on 21/09/2017
        "ready for uat" // Used by Online Servicing team
    ];

    public ClosedStates = [
        "done",
        "released/done", // last column name in TFS changed on 21/07/2016
        "deployed to production", // this is the TFS default column for completed work items
        "7. released/done", // column name in TFS changed on 21/09/2017
    ];

    public Effort = "Microsoft.VSTS.Scheduling.StoryPoints";

    public StateField = "System.BoardColumn";
}
export = TfsConfig;