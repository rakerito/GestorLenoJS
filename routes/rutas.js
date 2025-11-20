import {Router} from "express"
import { cantClientes, cantProductos, enClientes, enProductos, nuevoCliente, nuevoProducto, sumaExistencias, cantProveedores, buscarCliente, buscarProducto, editarCliente, borrarCliente, borrarProducto, editarProductoImagen, borrarImagen2, enVentas, realizarVenta, borrarVenta, buscarVenta, editarVenta, enUsuarios, nuevoUsuario, enUsuarios1, buscarUsuario, elevarUsuario, borrarUsuario, buscarClientes } from "../bd/operacionesBD.js"
import session from "express-session"
import 'dotenv/config'
import { subirImgagen } from "../middlewares/subirImagen.js"
import usuarios from "../models/usuarios.js"

const router = Router()

router.get("/", (req, res)=>{
    res.render("home")
})

router.post("/comprobar", async (req, res)=>{
    if(req.body.usuario == "admin" || req.body.usuario == "user"){
        if(req.body.usuario == "admin" && req.body.password == "12345"){
            req.session.inicio = 1;
            res.redirect("/publicidad")
        }else if(req.body.usuario == "user" && req.body.password == "12345"){
            req.session.inicio = 2;
            res.redirect("/publicidad")
        }else{  
            req.session.inicio = false;
            res.redirect("/")
        }
    }else{
        const usuario = (await enUsuarios(req.body.usuario))[0]
        const user = usuario.nombre,
            contrasena = usuario.contrasena;
        const password = req.body.password
        if(usuario){
            if(contrasena == password){
                req.session.inicio = Number(usuario.categoria)
                res.redirect("/publicidad")
            }else{
                console.log(user)
                res.redirect("/")
            }
            console.log(usuario)
        }else{
            res.redirect("/")
        }
    }
})

router.get("/publicidad", (req, res)=>{
    if(req.session.inicio){
        res.render("publicidad");
    }else{
        res.redirect("/")
    }
})

router.get("/dashboard", async (req, res) =>{
    const nCli = await cantClientes() || 0,
        nPro = await cantProductos() || 0,
        nProv = await cantProveedores() || 0,
        exTot = await sumaExistencias() || 0,
        clientes = await enClientes(),
        productos = await enProductos(),
        ventas = await enVentas();
    if(req.session.inicio == 1){
        const usuarios = await enUsuarios1()
        res.render("dashboard", {nCli, nPro, nProv, exTot, clientes, productos, ventas, usuarios})
    }else if(req.session.inicio == 2){
        res.render("dashboardUser", {nCli, nPro, nProv, exTot, clientes, productos, ventas})
    }else{
        res.redirect("/")
    }
})

router.get("/nCli", (req, res) => {
    if(req.session.inicio == 1){
        res.render("nCli")
    }else{
        res.redirect("/")
    }
})

router.get("/nPro",(req, res) => {
    if(req.session.inicio == 1){
        res.render("nPro")
    }else{
        res.redirect("/")
    }
})

router.get("/nVen", async (req, res) => {
    if (req.session.inicio == 1) {
        const cli = await enClientes();
        const pro = await enProductos();
        res.render("nVen", { cli, pro })
    } else {
        res.redirect("/")
    }
})

router.post("/snu", async (req, res) =>{
    const nombre = req.body.nombre,
        correo = req.body.correo,
        contraseña = req.body.contraseña;

    await nuevoUsuario({nombre, correo, contraseña})

    res.redirect("/")
})

router.post("/snc", async (req, res) =>{
    if(req.session.inicio == 1){
        const nombre = req.body.nombre,
            correo = req.body.correo,
            telefono = req.body.telefono;

        await nuevoCliente({nombre, correo, telefono})

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.post("/snp", subirImgagen(),async (req, res) => {
    if(req.session.inicio == 1){
        const datos = req.file
        const producto = req.body.producto,
            categoria = req.body.categoria,
            existencia = req.body.existencia,
            precio = req.body.precio,
            proveedor = req.body.proveedor,
            imagen = datos.filename;
        
        await nuevoProducto({producto, categoria, existencia, precio, proveedor, imagen})

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.post("/snv", async (req, res) =>{
    const idPro = req.body.producto, idCli = req.body.cliente;
    const producto = await buscarProducto(idPro),
        cliente = await buscarCliente(idCli),
        nProducto = producto._id,
        nCliente = cliente._id,
        cantidad = Number(req.body.cantidad);
        console.log(req.body.producto)
    if(req.session.inicio == 1){
        if(cantidad > producto.existencia){
            res.send('<script>alert("Existencia insuficiente"); window.location="/dashboard";</script>')
        }else{
            await realizarVenta(nProducto, nCliente, cantidad)
            console.log(producto.existencia)
        }

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/qr", (req, res) => {
    if(req.session.inicio){
        res.render("qr")
    }else{
        res.redirect("/")
    }
})

router.get("/editarCliente/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const cliente = await buscarCliente(id)

        res.render("eCli", {cliente})
    }else{
        res.redirect("/")
    }
})

router.get("/editarProducto/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const product = await buscarProducto(id)

        res.render("ePro", {product})
    }else{
        res.redirect("/")
    }
})

router.get("/editarVenta/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const venta = await buscarVenta(id)

        res.render("eVen", {venta})
    }else{
        res.redirect("/")
    }
})
router.get("/cambiarUS/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const usuario = (await buscarUsuario(id))
        var categoria = 0;

        if(usuario.categoria == 2){
            categoria = 1
        }else{
            categoria = 2
        }

        await elevarUsuario(id, categoria)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.post("/ec", async (req, res) => {
    if(req.session.inicio == 1){
        const respuestaMongo = await editarCliente(req.body)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.post("/ep", subirImgagen(), async (req, res) => {
    if(req.session.inicio == 1){
        const dato = req.file
        const producto = req.body.producto,
            categoria = req.body.categoria,
            existencia = req.body.existencia,
            precio = req.body.precio,
            proveedor = req.body.proveedor,
            id = req.body.id,
            imagen = dato ? dato.filename : (req.body.imagenVi || "");
        
        if(dato != null){
            await borrarImagen2(id)
        }
        
        await editarProductoImagen({id, producto, categoria, existencia, precio, proveedor, imagen})

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.post("/ev", async (req, res) => {
    if(req.session.inicio == 1){
        console.log(req.body)
        const respuestaMongo = await editarVenta(req.body)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/borrarCliente/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const respuestaMongo = await borrarCliente(id)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/borrarProducto/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const respuestaMongo = await borrarProducto(id)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})
router.get("/borrarVenta/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        console.log(id)
        const respuestaMongo = await borrarVenta(id)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})
router.get("/borrarUsuario/:id", async (req, res) => {
    if(req.session.inicio == 1){
        const id = req.params.id
        const respuestaMongo = await borrarUsuario(id)

        res.redirect("/dashboard")
    }else{
        res.redirect("/")
    }
})

router.get("/salir", (req, res) => {
    if(req.session.inicio){
        req.session.destroy()
        res.clearCookie("inicioSesion",{path:"/"})
        res.redirect("/")
    }else{
        res.redirect("/")
    }
})

router.get("/crearCuenta", (req, res)=>{
    res.render("crearCuenta")
})

//Búsquedas
router.post("/bsCli", async (req, res)=>{
    const clientes = await buscarClientes(req.body.bsClie)
    console.log(clientes)
    if(req.session.inicio == 1){
        res.render("BuscarCliente", {clientes})
    }
})

export default router