import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
    idPro:{
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    nomPro:{
        type: String,
        required: true,
        trim: true,
        unique: false,
    },
    idCli:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    nomCli:{
        type: String,
        required: true,
        trim: true,
        unique: false,
    },
    cantidad: {
        type: Number,
        required: true,
        trim: true,
        unique: false
    }
})

export default mongoose.model('Ventas', ventaSchema)