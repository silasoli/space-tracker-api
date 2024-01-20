import mongoose from 'mongoose';

export interface ILogin {
  _id?: mongoose.ObjectId | string;

  username: string;

  email: string;
}
