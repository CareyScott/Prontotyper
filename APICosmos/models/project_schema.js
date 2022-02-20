const { Schema, model } = require("mongoose")
const projectSchema = new Schema({
    name: {
        type: String,
         required: [true, 'title field is required']
    },
    user_id: {
        type: String,
         required: [true, 'title field is required']
    },
    components: {
        type: String,
         required: [true, 'title field is required']
    },
    description: {
        type: String,
         required: [true, 'title field is required']
    },
    date: {
        type: String,
         required: [true, 'title field is required']
    },

}
)
module.exports = model("Project", projectSchema);
