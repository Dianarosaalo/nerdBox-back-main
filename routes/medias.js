const express=require("express");

let Media = require(__dirname + "/../models/media.js");
let router = express.Router();


router.get('/', (req, res) => {
    Media.find().then(resultado => {
        res.status(200)
            .send({medias: resultado});
    }); 
});

router.get('/busqueda', async (req, res) => {
    const titulo = req.query.titulo;

    try {
        const query = {};
        if (titulo) {
            query.titulo = { $regex: new RegExp(titulo, 'i') };
        }

        const resultado = await Media.find(query);
        res.send({ medias: resultado });
        
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving media.' });
    }
});

router.get('/:id', (req, res) => {
    Media.findById(req.params['id']).then(resultado => {
        res.status(200).send({media: resultado});
    });
});

router.delete('/:id', (req, res) => {
    Media.findByIdAndDelete(req.params.id).then(resultado => {
        res.sendStatus(200);
    }).catch(error => {
        console.error("Error eliminando el media" + error);
    });
});


router.post('/', (req, res) => {
    let nuevoMedia = new Media({

        titulo:req.body.titulo,
        imagen:req.body.imagen,

        tipo:req.body.tipo,
        genero:req.body.genero,
        plataforma:req.body.plataforma,

        fechaLanzamiento:req.body.fechaLanzamiento,
        fechaTerminado:req.body.fechaTerminado,

        notaObjetiva:req.body.notaObjetiva,
        notaSubjetiva:req.body.notaSubjetiva,

        desarrolladora:req.body.desarrolladora,
        subgenero:req.body.subgenero,

        fechaCreacion:req.body.fechaCreacion,
        fechaModificacion:req.body.fechaModificacion,

        review:req.body.review,
        tiempoJuego:req.body.tiempoJuego

        
    });
    nuevoMedia.save().then(resultado => {
        res.sendStatus(200);
    }).catch(error => {
        console.error("Error añadiendo el media" + error);
    });
});

router.put('/:id', (req, res) => {
    Media.findByIdAndUpdate(req.params.id, {
        $set: {

        titulo:req.body.titulo,
        imagen:req.body.imagen,

        tipo:req.body.tipo,
        genero:req.body.genero,
        plataforma:req.body.plataforma,

        fechaLanzamiento:req.body.fechaLanzamiento,
        fechaTerminado:req.body.fechaTerminado,

        notaObjetiva:req.body.notaObjetiva,
        notaSubjetiva:req.body.notaSubjetiva,

        desarrolladora:req.body.desarrolladora,
        subgenero:req.body.subgenero,

        fechaCreacion:req.body.fechaCreacion,
        fechaModificacion:req.body.fechaModificacion,

        review:req.body.review,
        tiempoJuego:req.body.tiempoJuego
        
        }
    }, {new: true}).then(resultado => {
       
    }).catch(error => {
        console.error({error: "Error modificando media"});
    });
});

module.exports = router;