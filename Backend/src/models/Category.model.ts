import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
  color: {
    type: String,
    required: [true, 'Category color is required'],
    default: '#FFD700',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICategory>('Category', categorySchema);
