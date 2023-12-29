export default interface ITaskPersistence {
    id: string;
    taskDescription: string;
    taskType: string;
    taskState: string;
    taskPickupRoom: string;
    taskDeliveryRoom: string;

    // Properties for Surveillance tasks
    taskBuilding?: string;
    taskFloor?: number;
    taskContact?: string;

    // Properties for Pickup & Delivery tasks
    taskPickupContact?: string;
    taskDeliveryContact?: string;
    taskPickupCode?: number;

    taskRequester: string;
    taskRequestDate: Date;
    taskRobotType: string;
    taskRobot: string;
    taskPath: string[];
}