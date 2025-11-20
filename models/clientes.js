import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    correo:{
        type: String,
        required: true,
        trim: true,
        unique: false,
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
        unique: false
    }
})

export default mongoose.model('Clientes', clienteSchema)