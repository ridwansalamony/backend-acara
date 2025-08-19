import mongoose from "mongoose";
import * as Yup from "yup";
import { IEvent } from "../interfaces/event.interface";

const Schema = mongoose.Schema;

export const eventDAO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  banner: Yup.string().required(),
  slug: Yup.string(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  location: Yup.object().required(),
  category: Yup.string().required(),
  createdBy: Yup.string().required(),
  isFeatured: Yup.boolean().required(),
  isOnline: Yup.boolean().required(),
  isPublish: Yup.boolean(),
});

const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },

    description: {
      type: Schema.Types.String,
      required: true,
    },

    banner: {
      type: Schema.Types.String,
      required: true,
    },

    slug: {
      type: Schema.Types.String,
      unique: true,
    },

    startDate: {
      type: Schema.Types.String,
      required: true,
    },

    endDate: {
      type: Schema.Types.String,
      required: true,
    },

    location: {
      type: {
        region: {
          type: Schema.Types.Number,
        },
        coordinates: {
          type: [Schema.Types.Number],
          default: [0, 0],
        },
      },
    },

    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    isFeatured: {
      type: Schema.Types.Boolean,
      required: true,
    },

    isOnline: {
      type: Schema.Types.Boolean,
      required: true,
    },

    isPublish: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.pre("save", function () {
  if (!this.slug) {
    const slug = this.name.split(" ").join("-").toLowerCase();

    this.slug = `${slug}`;
  }
});

const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;
