import mongoose from "mongoose";
import ITaskPersistence from "../../dataschema/ITaskPersistence";



const taskSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true },
        description: { type: String }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ITaskPersistence & mongoose.Document>('Task', taskSchema)