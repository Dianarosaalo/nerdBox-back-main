const mongoose = require("mongoose");

const mediaHistorySchema = new mongoose.Schema({
    mediaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    fechaModificacion: {
        type: Date,
        required: true
    },

    objetoAnterior: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    objetoNuevo: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    cambios: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }
});

const MediaHistory = mongoose.model('mediaHistory', mediaHistorySchema);

module.exports = MediaHistory;