const express = require("express");

let MediaHistory = require(__dirname + "/../models/mediaHistory.js");
let router = express.Router();

router.get('/', async (req, res) => {

    try {

        const histories = await MediaHistory.find()
            .sort({ fechaModificacion: -1 });

        res.status(200).send({
            histories: histories
        });

    } catch (error) {

        console.error("Error retrieving media histories:", error);

        res.status(500).json({
            error: "Error retrieving media histories"
        });

    }

});


router.get('/:mediaId', async (req, res) => {

    try {

        const histories = await MediaHistory.find({
            mediaId: req.params.mediaId
        }).sort({
            fechaModificacion: -1
        });

        res.status(200).send({
            histories: histories
        });

    } catch (error) {

        console.error("Error retrieving media history:", error);

        res.status(500).json({
            error: "Error retrieving media history"
        });

    }

});


module.exports = router;