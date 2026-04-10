const { default: mongoose } = require("mongoose");

let listsSchema = new mongoose.Schema({

    nombre: {
        type:String,
        minlength:1,
        trim:true
    },
    medias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media"
    }],
    fechaCreacion:{
        type:Date
    },
    fechaModificacion:{
        type:Date
    },
    descripcion:{
        type:String,
        minlength:1,
        trim:true
    },
    tipoLista:{
        type:String
    }
});

let List = mongoose.model('lists', listsSchema)

module.exports = List