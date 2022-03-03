const { Schema, model } = require("mongoose");
const projectSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userID are required"],
    },
    project_name: {
      type: String,
      required: [true, "Name field is required"],
    },
    project_framework: {
      type: String,
      required: [true, "framework field is required"],
    },
    components: {
      type: [Schema.Types.ObjectId],
      ref: "Component",
      required: [true, "components are required"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("Project", projectSchema);