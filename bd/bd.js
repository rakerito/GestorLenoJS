import mongoose from "mongoose"

async function conectarBD(){
    //mongoose.connect("mongodb://localhost:27017/backend1") LOCAL
    //mongoose.connect("mongodb+srv://root:root@cluster0.09dgql3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    try{
        const respuestaMongo = await mongoose.connect(process.env.SECRET_MONGO)
        console.log("Conexión con Mongo DB Atlas")
    }catch(e){
        console.log("Error " + e)
    }
}

export default conectarBD