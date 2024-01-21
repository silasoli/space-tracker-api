import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type RentalDocument = Rental & Document;
@Schema()
export class Rental {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  document: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  checkInDate: Date;

  @Prop({ required: true })
  checkOutDate: Date;

  @Prop({ type: [Date], default: [] })
  dates: Date[];
}

export const RentalSchema = SchemaFactory.createForClass(Rental);

