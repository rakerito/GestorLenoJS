import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    producto:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    categoria:{
        type: String,
        required: true,
        trim: true,
        unique: false,
    },
    existencia:{
        type: Number,
        required: true,
        trim: true,
        unique: false,
    },
    precio:{
        type: Number,
        required: true,
        trim: true,
        unique: false
    },
    proveedor:{
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    imagen:{
        type:String,
        required: true,
        trim: false,
        unique: true,
    }
})

export default mongoose.model('Productos', productoSchema)