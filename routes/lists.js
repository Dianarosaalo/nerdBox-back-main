const express=require("express");

let List = require(__dirname + "/../models/list.js");
let router = express.Router();

router.get('/', (req, res) => {
    List.find().then(resultado => {
        res.status(200)
            .send({lists: resultado});
    }); 
});

router.get('/busqueda', async (req, res) => {
    const nombre = req.query.nombre;

    try {
        const query = {};
        if (nombre) {
            query.nombre = { $regex: new RegExp(nombre, 'i') };
        }

        const resultado = await List.find(query);
        res.send({ lists: resultado });
        
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving list.' });
    }
});

router.get('/:id', (req, res) => {
    List.findById(req.params['id']).then(resultado => {
        res.status(200).send({list: resultado});
    });
});

router.post('/', (req, res) => {
    let nuevaLista = new List({

        nombre:req.body.nombre,
        medias:req.body.medias,
        
        fechaCreacion:req.body.fechaCreacion,
        fechaModificacion:req.body.fechaModificacion,

        descripcion:req.body.descripcion,
        tipoLista:req.body.tipoLista

    });
    nuevaLista.save().then(resultado => {
        res.sendStatus(200);
    }).catch(error => {
        console.error("Error añadiendo el media" + error);
    });
});

router.put('/:id', (req, res) => {
    List.findByIdAndUpdate(req.params.id, {
        $set: {

        nombre:req.body.nombre,
        medias:req.body.medias,
        
        fechaCreacion:req.body.fechaCreacion,
        fechaModificacion:req.body.fechaModificacion,

        descripcion:req.body.descripcion,
        tipoLista:req.body.tipoLista
        
        }
    }, {new: true}).then(resultado => {
       
    }).catch(error => {
        console.error({ error: "Error modifying media", details: error });
    });
});

module.exports = router;