# US 470 - As a Task manager, I pretend to aprove or deny a requisition

## 1. Context

* First time that this user story is being implemented.
* This task is relative to system user.

## 2. Requirements

**US 470-** As a Task manager, I pretend to aprove or deny a requisition

**Dependencies:**

**US 460 -** As the system user I intend to request a task, specify the parameters necessary for its execution,
namely the starting point and term point and what is the intended task

## 3. Analysis

**Analyzing this User Story we understand that:**

As a Task manager, an actor of the system, I should have the possibility to see every task which hasn't been
aprove or denied and aprove or deny those tasks.

### 3.1. Domain Model Excerpt

![DomainModelExcerpt](Diagrams/DomainModelExcerpt.svg)

## 4. Design

For this use case we will implement a service which will receive the id of that task and update its state,
to aprove or denied.

### 4.1. Realization

### Level1

#### LogicalView

![LogicalView](Diagrams/Level1/LogicalView.svg)

#### SceneryView

![SceneryView](Diagrams/Level1/SceneryView.svg)

#### ProcessView

![ProcessView](Diagrams/Level1/ProcessView.svg)

### Level2

#### LogicalView

![LogicalView](Diagrams/Level2/LogicalView.svg)

#### ImplementationView

![ImplementationView](Diagrams/Level2/ImplementationView.svg)

#### PhysicalView

![PhysicalView](Diagrams/Level2/PhysicalView.svg)

#### ProcessView

![ProcessView](Diagrams/Level2/ProcessView.svg)

### Level3

#### LogicalView

![LogicalView](Diagrams/Level3/LogicalView.svg)

#### ImplementationView

![ImplementationView](Diagrams/Level3/ImplementationView.svg)

#### ProcessView

![ProcessView](Diagrams/Level3/ProcessView.svg)

### 4.3. Applied Patterns

### 4.4. Tests

## 5. Implementation

## 6. Integration/Demonstration
