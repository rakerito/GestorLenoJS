import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
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
        unique: true,
    },
    contrasena: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    categoria:{
        type: Number,
        required: true,
        trim: true,
        unique: false
    }
})

export default mongoose.model('Usuarios', usuarioSchema)