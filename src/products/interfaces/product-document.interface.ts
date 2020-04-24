import { Document } from 'mongoose';

export interface ProductDoc extends Document {
  id: string;
  title: string;
  description: string;
  price: number;
}
