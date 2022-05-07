const { Schema, model } = require("mongoose");
const predictionSchema = new Schema({
  id: {
    type: String,
  },
  project: {
    type: String,
  },
  iteration: {
    type: String,
  },
  created: {
    type: String,
  },
  code: {
    type: Schema.Types.ObjectId,
    ref: "Code"
  },
  predictions: [
    {
      probability: String,
      tagId: String,
      tagName: { type: String},
      boundingBox: {
        left: String,
        top: String,
        width: String,
        height: String,
        elementLeft: String,
        range: String,
        pushLeft: String,
      },
      tagType: String,
      
    },
  ],
});
module.exports = model("Prediction", predictionSchema);
