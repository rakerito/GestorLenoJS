import mongoose from "mongoose"

async function conectarBD(){
    try{
        const respuestaMongo = await mongoose.connect(process.env.SECRET_MONGO)
        console.log("Conexión con Mongo DB Atlas")
    }catch(e){
        console.log("Error " + e)
    }
}

export default conectarBD