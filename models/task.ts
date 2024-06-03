import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  date_time: Date;
  status: string; 
  next_execute_date_time?: Date; // Add this field
}

const TaskSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  date_time: { type: Date, required: true },
  status: { type: String, required: true },
  next_execute_date_time: { type: Date }, // Add this field
}, {
  timestamps: true,
});

export default mongoose.model<ITask>('Task', TaskSchema);
