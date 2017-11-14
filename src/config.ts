/// <reference path="../typings/tsd.d.ts" />

import Core_Contracts = require("TFS/Core/Contracts");

interface ITfsConfig {
    TeamContext(): Core_Contracts.TeamContext;
    Fields: string[];
    NewStates: string[];
    CommittedStates: string[];
    CompletedStates: string[];
    EffortField: string;
    StateField: string;
}

class TfsConfig implements ITfsConfig {

    constructor(newStates: string, committedStates: string, completedStates: string, closedStates: string, effortField: string, stateField: string, returnFields: string) {
        
        this.NewStates = this.parseString(newStates, ",");
        this.CommittedStates = this.parseString(committedStates, ",");
        this.CompletedStates = this.parseString(completedStates, ",");
        this.ClosedStates = this.parseString(closedStates, ",");
        this.Fields = this.parseString(returnFields, ",");

        // the effort and state fields in the settings only
        // store an id rather than the actual field name
        let effort = (effortField === undefined) ? "" : effortField.trim();
        if (effort == "vsts-effort") {
            this.EffortField = "Microsoft.VSTS.Scheduling.StoryPoints";
        } else {
            this.EffortField = "Microsoft.VSTS.Scheduling.Effort";
        }
        
        // currently the only available option for state is System.BoardColumn
        let state = (stateField === undefined) ? "" : stateField.trim();
        if(state == "") {
            this.StateField = "System.BoardColumn";
        } else {
            this.StateField = "System.BoardColumn";
        }
    }

    public NewStates: string[];
    public CommittedStates: string[];
    public CompletedStates: string[];
    public ClosedStates: string[];
    public EffortField: string;
    public StateField: string;
    public Fields: string[];

    private parseString(data: string, separator: string): string[] {
        if (data === undefined) return [];
        return data.split(separator).map( (item) => {
            return item.trim();
        });
    }

    public TeamContext(): Core_Contracts.TeamContext {
        var ctx = VSS.getWebContext();
        return {
            projectId: ctx.project.id,
            teamId: ctx.team.id,
            project: ctx.project.name,
            team: ctx.team.name
        };
    };
}
export = TfsConfig;