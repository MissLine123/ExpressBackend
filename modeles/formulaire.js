const mongoose = require('mongoose');

const formSchema = mongoose.Schema({
    prenom : {type: String},
    nom : {type: String},
    email : {type: String},
    age : {type: Number},
    message : {type: String}
});
module.exports = mongoose.model('Form', formSchema);
