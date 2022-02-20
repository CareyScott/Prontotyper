const { Schema, model } = require("mongoose")
const projectSchema = new Schema({
    project_name:{
        type: String,
         required: [true, 'Name field is required']
    },
    project_framework:{
        type: String,
         required: [true, 'framework field is required']
    },
    
    components:{
        type: String,
         required: [true, 'Component field is required']
    },
    // description:{
    //     type: String,
    //      required: [true, 'Description field is required']
    // },
    // user_id:{
    //     type: String,
    //      required: [true, 'User ID field is required']
    // },
    date:{
        type: Date,
        default: Date.now 
    }

}
)
module.exports = model("Project", projectSchema);
