const express=require("express");
const crypto = require("crypto");

let Media = require(__dirname + "/../models/media.js");
let MediaHistory = require(__dirname + "/../models/mediaHistory.js");
let router = express.Router();

function getImageHash(imagen) {
    if (!imagen) {
        return null;
    }

    return crypto
        .createHash('sha256')
        .update(imagen)
        .digest('hex');
}

function prepararParaHistorial(media) {
    const objeto = media.toObject
        ? media.toObject()
        : { ...media };

    objeto.imagen = getImageHash(objeto.imagen);

    return objeto;
}

function obtenerCambios(objetoAnterior, objetoNuevo) {
    const cambios = [];

    const campos = new Set([
        ...Object.keys(objetoAnterior),
        ...Object.keys(objetoNuevo)
    ]);

    for (const campo of campos) {

        const valorAnterior = objetoAnterior[campo];
        const valorNuevo = objetoNuevo[campo];

        if (JSON.stringify(valorAnterior) !== JSON.stringify(valorNuevo)) {
            cambios.push({
                campo: campo,
                anterior: valorAnterior,
                nuevo: valorNuevo
            });
        }
    }

    return cambios;
}

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

router.post('/batch', async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: "ids must be an array" });
    }

    try {
        const medias = await Media.find({
            _id: { $in: ids }
        });
        
        const mediasOrdenadas = ids.map(id =>
            medias.find(m => m._id.toString() === id)
        ).filter(Boolean);

        res.status(200).send({ medias: mediasOrdenadas });

    } catch (error) {
        res.status(500).json({ error: 'Error retrieving medias' });
    }
});

router.get('/paginated', async (req, res) => {
    try {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 2500;

        const resultado = await Media.find()
            .skip(offset)
            .limit(limit);

        res.status(200).send({
            medias: resultado
        });

    } catch (error) {
        console.error("Error retrieving medias:", error);
        res.status(500).json({
            error: "Error retrieving medias"
        });
    }
});

router.get('/actividad', async (req, res) => {
    try {
        const resultado = await Media.find()
            .select('-imagen');

        res.status(200).send({
            medias: resultado
        });

    } catch (error) {
        console.error("Error retrieving media activity:", error);
        res.status(500).json({
            error: "Error retrieving media activity"
        });
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

        anotaciones:req.body.anotaciones,
        review:req.body.review,
        tiempoJuego:req.body.tiempoJuego,

        nombrePersonal:req.body.nombrePersonal

        
    });
    nuevoMedia.save().then(resultado => {
        res.sendStatus(200);
    }).catch(error => {
        console.error("Error añadiendo el media" + error);
    });
});

router.put('/:id', async (req, res) => {

    try {

        // 1. Obtener el objeto antiguo
        const mediaAnterior = await Media.findById(req.params.id);

        if (!mediaAnterior) {
            return res.status(404).json({
                error: "Media not found"
            });
        }

        // 2. Crear el objeto nuevo
        const objetoNuevo = {

            titulo: req.body.titulo,
            imagen: req.body.imagen,

            tipo: req.body.tipo,
            genero: req.body.genero,
            plataforma: req.body.plataforma,

            fechaLanzamiento: req.body.fechaLanzamiento,
            fechaTerminado: req.body.fechaTerminado,

            notaObjetiva: req.body.notaObjetiva,
            notaSubjetiva: req.body.notaSubjetiva,

            desarrolladora: req.body.desarrolladora,
            subgenero: req.body.subgenero,

            fechaCreacion: req.body.fechaCreacion,
            fechaModificacion: req.body.fechaModificacion,

            anotaciones: req.body.anotaciones,
            review: req.body.review,
            tiempoJuego: req.body.tiempoJuego,

            nombrePersonal: req.body.nombrePersonal
        };

        // 3. Preparar las copias para el historial
        //    (imagen -> hash)
        const objetoAnteriorHistorial =
            prepararParaHistorial(mediaAnterior);

        const objetoNuevoHistorial =
            prepararParaHistorial(objetoNuevo);

        // 4. Averiguar qué ha cambiado
        const cambios = obtenerCambios(
            objetoAnteriorHistorial,
            objetoNuevoHistorial
        );

        // 5. Actualizar el Media
        const resultado = await Media.findByIdAndUpdate(
            req.params.id,
            {
                $set: objetoNuevo
            },
            {
                new: true
            }
        );

        // 6. Crear el historial
        await MediaHistory.create({
            mediaId: resultado._id,

            fechaModificacion: resultado.fechaModificacion,

            objetoAnterior: objetoAnteriorHistorial,

            objetoNuevo: objetoNuevoHistorial,

            cambios: cambios
        });

        // 7. Responder a Angular
        res.status(200).send({
            media: resultado
        });

    } catch (error) {

        console.error("Error modifying media:", error);

        res.status(500).json({
            error: "Error modifying media",
            details: error.message
        });
    }
});

module.exports = router;