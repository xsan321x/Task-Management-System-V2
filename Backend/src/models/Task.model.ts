import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  status: 'not-started' | 'in-progress' | 'review' | 'completed';
  dueDate?: Date;
  categories: string[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'review', 'completed'],
      default: 'not-started',
    },
    dueDate: {
      type: Date,
    },
    categories: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>('Task', taskSchema);
