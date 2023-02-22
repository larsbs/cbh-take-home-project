# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

I'm gonna assume that no SQL operations are done by hand and that instead, an ORM (for example TypeORM) or similar is being used.

I'm also gonna assume the following structure is already in place (irrelevant properties and methods ommited for clarity):

*entities/Agent.ts*
```ts
import { Entity } from 'typeorm';
import { Shift } from './Shift';

@Entity()
class Agent {
  @PrimaryGeneratedColumn() // this would be the internal id we use for the agents
  id!: number;

  @OneToMany(() => Shift, (shift) => shift.agent)
  shifts!: Array<Shift>;
}
```

*entities/Facility.ts*
```ts
import { Entity } from 'typeorm';
import { Shift } from './Shift';

@Entity()
class Facility {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Shift, (shift) => shift.facility)
  shifts!: Array<Shift>;
}
```

*entities/Shift.ts*
```ts
import { Entity } from 'typeorm';
import { Agent } from './Agent';
import { Facility } from './Facility';

@Entity()
class Shift {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Agent, (agent) => agent.shifts)
  agent!: Agent;

  @ManyToOne(() => Facility, (facility) => facility.shifts)
  facility!: Facility;
}
```

As we can see, we connect *Agents* and *Facilities* through *Shifts*. So, with that in mind, the most logical place to put the custom id for the agents is inside the `Shift` entity, since it holds all the data related to the relationship `Agent -> Facility`.

If we had decided instead to put the custom id inside the `Agent` entity, the custom id wouldn't be able to be customized by each facility as it would only hold a single value. This would result in a unique value per Agent, pretty much covering the same use case as our internal id and thus, rendering this addition redundant.

Similarly, if we had decided to put this custom id inside the `Facility` entity, every agent working for that facility would have had the same id thereby making the reports useless.

Another thing that we need to know is if each *Agent* always have the same id in the same *Facility* or if the ids can vary between *Shifts* according to the criteria of the facility. Since nothing has been mentioned about it, we'll assume that it's either managed internally by the facility (they have their own methods of assigning always the same id to the same agent) or that ids can vary between shifts. We take this assumption since it leads to a simpler implementation without straying away from the real purpose of this exercise.

With that in mind and the structure described above in place, I propose the following tickets (Since no specific ticket format has been specified I'll go with my own):

## Tickets

### Ticket: #1 Add agentId field to Shift

Add an `agentId` field to shifts so facilities can edit this field and assign their own ids to the agents.

**Aceptance Criteria**:
 - A new field called `agentId` has been added to the `Shift` entity.
 - The `agentId` field is optional and can be empty.
 - A migration script that allows to rollforward/rollback the changes exists.
 - The `agentId` field is included in the agent metadata returned by `getShiftsByFacility`.

**Estimation**: 1h
 - Schema update and testing: 0.25h
 - `getShiftsByFacility` update: 0.25h
 - Testing: 0.5h

**Implementation details**:
 - Add a new `string` field called `agentId` to the `Shift` entity.
 - Update database migration scripts to include the new `agentId` field.
 - Update `getShiftsByFacility` and return `agentId` as part of the agent metadata inside each shift.


### Ticket: #2 Add text input to customize agentId field

Add a new text input to the admin panel so that facilities can edit the `agentId` for a specific agent during a shift.

**Aceptance Criteria**:
 - The new text input is visible and editable by facilities in their admin panel.
 - The new text input can be left blank.
 - The value of the new text input is properly saved and restored.

**Estimation**: 1.5h
 - Update to include the field in the admin panel: 0.5h
 - Back-end integration: 0.5h
 - Testing: 0.5h

**Implementation details**:
 - Add a new input component to facilities shift admin panel.
 - Update API calls to save and fetch the `agentId` in/from the back-end.


### Ticket: #3 Update generateReport to use custom agent ids

Update the `generateReport` function to take into account agents having a unique identifier for a particular shift and uses that id to generate the report when it is available.

**Aceptance Criteria**:
 - The `agentId` is displayed in the report when not null.
 - The internal db id is displayed in the report when `agentId` is null.

**Estimation**: 1h
 - Updates to the function: 0.5h
 - Testing: 0.5h

**Implementation details**:
 - Update `generateReport` to use `agentId` when present.


### Ticket: #4 Update documentation

Update documentation to include information about the new `agentId` field and its usage.

**Aceptance Criteria**:
 - The documentation includes information about `agentId`.

**Estimation**: 0.5h
 - Updates documentation: 0.5h

**Implementation details**:
 - Add a description of the `agentId` field in the API documentation.
 - Explain how facilities can set/update the `agentId`.

### Ticket: #5 Update integration tests

Update integration tests to take into account the newly included field `agentId`.

**Aceptance Criteria**:
 - Generating a report without custom `agentId` is tested and passing.
 - Generating a report with custom `agentId` is tested and passing.
 - The result of the rest of the integration tests is unchanged.

**Estimation**: 1h
 - Update integration tests: 1h

**Implementation details**:
 - Add a new test to test generating reports with a custom `agentId`.
 - No modification should be necessary in the existing tests.


## Comments

As can be seen, I've chosen to categorize the tickets primarily based on the team responsible for handling them. Dividing the tickets in this manner offers a significant advantage in that, despite some interdependencies between them, a well-organized product team can work on all of them concurrently. This is possible because all the necessary information and dependencies are clearly outlined, allowing each engineer assigned to a ticket to simulate the required information until integration with the rest becomes necessary.

In this particular use case, the integration step has not been specified as its own ticket, and instead, it has been included as a step in the front-end related ticket. However, for more complex use cases or features, the integration step could be its own ticket with its corresponding estimation, acceptance criteria, etc.

The proposed action plan would be:

- **Step 1**: Assign `#1`, `#2`, `#3`, `#4` to their respective engineers. `#2` and `#3` can simulate the required agentId while waiting for `#1` to be completed.
- **Step 2**: After `#1` is finished, `#2` and `#3` can work on integrating with the actual agentId data.
- **Step 3**: Once `#1`, `#2`, and `#3` are completed, `#4` is likely close to completion as well. While someone is working on `#5`, the person working on `#4` can double-check the information for accuracy.

Overall, this is just one of many ways to divide and assign tickets and tasks. The approach used depends on various factors, such as the team composition, individual expertise levels, company organization, and so on.

For instance, in a more agile-oriented company/team, a full-stack engineer may only require a single ticket with a problem description and some acceptance criteria to implement the feature appropriately. However, in a task-based team or one with front-end and back-end divisions, multiple tickets like those written above may be necessary.
