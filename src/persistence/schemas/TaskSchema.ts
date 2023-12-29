import mongoose from "mongoose";
import ITaskPersistence from "../../dataschema/ITaskPersistence";

const taskSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true },
        taskDescription: { type: String },
        taskType: { type: String },
        taskState: { type: String },
        taskPickupRoom: { type: String },
        taskDeliveryRoom: { type: String },

        // Properties for Surveillance tasks
        taskBuilding: { type: String },
        taskFloor: { type: Number },
        taskContact: { type: String },

        // Properties for Pickup & Delivery tasks
        taskPickupContact: { type: String },
        taskDeliveryContact: { type: String },
        taskPickupCode: { type: Number },

        taskRequester: { type: String },
        taskRequestDate: { type: Date },
        taskRobotType: { type: String },
        taskRobot: { type: String },
        taskPath: { type: Array },
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITaskPersistence & mongoose.Document>('Task', taskSchema);
