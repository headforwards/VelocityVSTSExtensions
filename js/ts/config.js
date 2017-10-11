define(["require", "exports"], function (require, exports) {
    "use strict";
    var TfsConfig = (function () {
        function TfsConfig() {
            this.Fields = [
                "System.Id",
                "System.Title",
                "System.State",
                "System.BoardColumn",
                "Microsoft.VSTS.Scheduling.Effort",
                "Microsoft.VSTS.Scheduling.StoryPoints",
                "System.WorkItemType"
            ];
            this.NewStates = [
                "new",
                "approved",
                "ready for review",
                "1. new",
                "2. ready for review",
                "3. approved",
            ];
            this.CommittedStates = [
                "committed",
                "4. committed"
            ];
            this.CompletedStates = [
                "deployed to staging",
                "ready for release",
                "ready for staging",
                "ready for environments team",
                "5. ready for environments team",
                "6. deployed to staging",
                "ready for uat"
            ];
            this.ClosedStates = [
                "done",
                "released/done",
                "deployed to production",
                "7. released/done",
            ];
            this.Effort = "Microsoft.VSTS.Scheduling.StoryPoints";
            this.StateField = "System.BoardColumn";
        }
        TfsConfig.prototype.TeamContext = function () {
            var ctx = VSS.getWebContext();
            return {
                projectId: ctx.project.id,
                teamId: ctx.team.id,
                project: ctx.project.name,
                team: ctx.team.name
            };
        };
        ;
        return TfsConfig;
    }());
    return TfsConfig;
});
//# sourceMappingURL=config.js.map