export default interface ICreateTaskDTO {
    taskDescription: string;
    taskType: string;
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
}
