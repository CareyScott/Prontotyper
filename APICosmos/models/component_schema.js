const { Schema, model } = require("mongoose");
const componentSchema = new Schema(
  {
    component_name: {
      type: String,
      required: [true, "name field is required"],
    },
    description: {
      type: String,
      required: [true, "file description field is required"],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "project is required"],
    },
    blob_name: {
      type: String,
      required: [true, "file description field is required"],
    },
    // prediction_id:{
    //   type: String,
    // }
  },
  {
    timestamps: true,
  }
);
module.exports = model("Component", componentSchema);
