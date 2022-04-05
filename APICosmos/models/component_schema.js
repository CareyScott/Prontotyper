const { Schema, model } = require("mongoose");
const componentSchema = new Schema(
  {
    component_name: {
      type: String,
      required: [true, "name field is required"],
    },
    // file_url: {
    //   type: String,
    //   required: [true, "file Url field is required"],
    // },
    description: {
      type: String,
      required: [true, "file description field is required"],
    },
    // code_output_url: {
    //   type: String,
    //   //  required: [true, 'Code Url field is required']
    // },
    // prediction: {
    //   type: Object,
    // },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "project is required"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("Component", componentSchema);
