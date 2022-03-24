const { Schema, model } = require("mongoose");
const codeSchema = new Schema(
  {
    framework: {
      type: String,
    },
    tagName: {
      type: String,
    },
    code: {
      type: String,
    }
    ,
    tagId: {
      type: String,
    }
  },
);
module.exports = model("Code", codeSchema);