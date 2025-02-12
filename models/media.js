const { default: mongoose } = require("mongoose");

let mediasSchema= new mongoose.Schema({

    titulo:{
        type:String,
        minlength:1,
        trim:true
    },
    imagen:{
        type:String,
    },
    tipo:{
        type:String,
    },
    genero:{
        type:String,
    },
    plataforma:{
        type:String,
    },
    fechaLanzamiento:{
        type:Date
    },
    fechaTerminado:{
        type:[{
            fecha:Date,
            estado:String
        }]
    },
    notaObjetiva:{
        type:Number
    },
    notaSubjetiva:{
        type:Number,
    },
    desarrolladora:{
        type:String
    },
    subgenero:{
        type:String
    },
    fechaCreacion:{
        type:Date
    },
    fechaModificacion:{
        type:Date
    },
    review:{
        type:String
    },
    anotaciones:{
        type:String
    },
    tiempoJuego:{
        type:Number
    }
});

let Media = mongoose.model('medias', mediasSchema);

module.exports = Media;