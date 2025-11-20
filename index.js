import express from 'express'
import rutas from "./routes/rutas.js"
import conectarBD from './bd/bd.js';
import session from "express-session"
import 'dotenv/config'

async function conexion(){
    await conectarBD();
}


conexion();

const app = express()

app.use(session({
    secret: process.env.SECRET_SESSION,
    name: "inicioSesion",
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false, path:"/"}
}))

app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs")
// Servir archivos estáticos (CSS, JS, imágenes) desde la carpeta `public`
app.use(express.static('public'))
app.use("/", rutas)

const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log("https://localhost:" + PORT)
})