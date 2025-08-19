import * as Yup from "yup";
import { eventDAO } from "../models/event.model";
import { ObjectId } from "mongoose";

export type TEvent = Yup.InferType<typeof eventDAO>;

export interface IEvent extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}
