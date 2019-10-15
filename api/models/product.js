const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, require: true },
    nombre: { type: mongoose.Schema.Types.String, require: true },
    precio: { type: Number, default: 0 },
    descripcion: { type: String, default: '' },
    imagenPath: { type: String, default: 'https://picsum.photos/id/216/200/300' },
    booleano: { type: Boolean, default: false },
});


module.exports = mongoose.model('Product', productSchema);

