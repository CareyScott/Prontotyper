const { Schema, model } = require("mongoose");
const codeSchema = new Schema(
  {
    
    tagName: {
      type: String,
    },
    code: {
      type: String,
    }
    ,
    tagId: {
      type: String,
    },
    framework: {
      type: String,
    }
    
  },
);
module.exports = model("Code", codeSchema);