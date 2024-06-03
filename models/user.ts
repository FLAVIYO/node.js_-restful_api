import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  first_name: string;
  last_name: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
