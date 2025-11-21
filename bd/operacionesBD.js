import Clientes from "../models/clientes.js"
import Productos from "../models/producto.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import ventas from "../models/ventas.js"
import usuarios from "../models/usuarios.js"

// Obtener la ruta actual del proyecto (necesario en ES Modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//GENERALES

//CLIENTES
export async function nuevoCliente({nombre, correo, telefono}){
    const contacto = new Clientes({nombre, correo, telefono})
    const respuestaMongo = await contacto.save()
    return respuestaMongo
}

export async function enClientes() {
    const clientes = Clientes.find()
    return clientes
}

export async function cantClientes(){
    const nCli = await Clientes.countDocuments();
    return nCli;
}

export async function buscarCliente(id) {
    const cliente = await Clientes.findById(id)
    return cliente
}
export async function editarCliente({id, nombre, correo, telefono}) {
    const respuestaMongo = await Clientes.findByIdAndUpdate(id, {nombre, correo, telefono})
    return respuestaMongo
}

export async function editarVenta({id, idPro, nomPro, idCli, nomCli, cantidad}) {
    const resultado = await buscarVenta(id),
        idPro1 = resultado.idPro,
        actualizar = Number(cantidad),
        cantidad1 = Number(resultado.cantidad);
    var nuevaCant = 0

    console.log(resultado)

    if(cantidad1 < cantidad){
        nuevaCant = actualizar - cantidad1
        await Productos.findByIdAndUpdate(idPro, { $inc: { existencia: -nuevaCant } })
    }else{
        nuevaCant = cantidad1 - actualizar
        await Productos.findByIdAndUpdate(idPro, { $inc: { existencia: +nuevaCant } })
    }

    console.log(nuevaCant)

    const respuestaMongo = await ventas.findByIdAndUpdate(id, {idPro, nomPro, idCli, nomCli, cantidad})
    return respuestaMongo
}

export async function editarProducto({id, nombre, correo, telefono}) {
    const respuestaMongo = await Clientes.findByIdAndUpdate(id, {nombre, correo, telefono})
    return respuestaMongo
}

export async function borrarCliente(id) {
    const respuestaMongo = await Clientes.findByIdAndDelete(id)
    return respuestaMongo
}

//PRODUCTOS
export async function nuevoProducto({producto, categoria, existencia, precio, proveedor, imagen}) {
    const product = new Productos({producto, categoria, existencia, precio, proveedor, imagen})
    const respuestaMongo = await product.save()
    return respuestaMongo
}

export async function enProductos() {
    const productos = Productos.find()
    return productos
}

export async function enVentas() {
    const venta = ventas.find()
    return venta
}

export async function cantProductos() {
    const nPro = await Productos.countDocuments();
    return nPro || 0;
}

export async function cantProveedores() {
    const proveedores = await Productos.distinct('proveedor')
    return proveedores.length || 0
}

export async function sumaExistencias() {
    const resultado = await Productos.aggregate([
        {
            $group: {
                _id: null, // Agrupa todos los documentos en uno solo
                total: { $sum: "$existencia" } // Suma los valores del campo "existencia"
            }
        }
    ]);

    if (resultado.length > 0) {
        return resultado[0].total;
    } else {
        return 0; // Devuelve 0 si no hay productos
    }
}

export async function buscarProducto(id) {
    const producto = await Productos.findById(id)
    return producto
}

export async function editarProductoImagen({id, producto, categoria, existencia, precio, proveedor, imagen}) {
    const respuestaMongo = await Productos.findByIdAndUpdate(id, {producto, categoria, existencia, precio, proveedor, imagen})

    return respuestaMongo
}

export async function borrarProducto(id) {
    // Primero, obtener el producto para saber el nombre de la imagen
    borrarImagen(id)
    
    // Ahora borrar el documento de la base de datos
    const respuestaMongo = await Productos.findByIdAndDelete(id)
    return respuestaMongo
}

async function borrarImagen(id) {
    const producto = await Productos.findById(id)
    
    if (producto && producto.imagen) {
        // Construir la ruta completa de la imagen
        const rutaImagen = path.join(__dirname, '../public/images', producto.imagen)
        
        // Intentar borrar la imagen del sistema de archivos
        fs.unlink(rutaImagen, (err) => {
            if (err) {
                console.log(`Advertencia: No se pudo borrar la imagen ${producto.imagen}:`, err.message)
            } else {
                console.log(`Imagen ${producto.imagen} borrada correctamente`)
            }
        })
    }
}

export async function borrarImagen2(id) {
    const producto = await Productos.findById(id)
    
    if (producto && producto.imagen) {
        // Construir la ruta completa de la imagen
        const rutaImagen = path.join(__dirname, '../public/images', producto.imagen)
        
        // Intentar borrar la imagen del sistema de archivos
        fs.unlink(rutaImagen, (err) => {
            if (err) {
                console.log(`Advertencia: No se pudo borrar la imagen ${producto.imagen}:`, err.message)
            } else {
                console.log(`Imagen ${producto.imagen} borrada correctamente`)
            }
        })
    }
}

export async function realizarVenta(idPro, idCli, cantidad) {
   const productoDoc = await buscarProducto(idPro)
   const clienteDoc = await buscarCliente(idCli)
   const existencia = productoDoc.existencia
   const nombrePro = productoDoc.producto
   const nombreCli = clienteDoc.nombre

    if(existencia < cantidad){
        return "0"
    }else{
        const venta = new ventas({ idPro, nomPro: nombrePro, idCli, nomCli: nombreCli, cantidad})
        const respuestaMongo = await venta.save()
        await Productos.findByIdAndUpdate(idPro, { $inc: { existencia: -cantidad } })
        return respuestaMongo
    }
}

export async function buscarVenta(id) {
    const venta = ventas.findById(id)
    return venta
}

export async function borrarVenta(id) {
    const resultado = await buscarVenta(id),
        idPro = resultado.idPro,
        cantidad = Number(resultado.cantidad);

    console.log(resultado)

    await Productos.findByIdAndUpdate(idPro, { $inc: { existencia: +cantidad } })

    const respuestaMongo = await ventas.findByIdAndDelete(id)
    return respuestaMongo
}



//USUARIOS
export async function nuevoUsuario({nombre, correo, contraseña}) {
    const user = 2
    try{
        // Comprobar si ya existe un usuario con ese correo
        const existente = await usuarios.findOne({ correo: correo })
        if (existente) {
            // Ya existe: no crear y devolver cadena vacía como indicador
            return ""
        }

        const usuario = new usuarios({ nombre: nombre, correo: correo, contrasena: contraseña, categoria: user })
        const respuestaMongo = await usuario.save()
        return respuestaMongo
    }catch(err){
        console.error('Error en nuevoUsuario:', err.message)
        return ""
    }
}

export async function enUsuarios(nombre) {
    try{
        const usuario = await usuarios.find({nombre: nombre})
        return usuario
    }catch{
        return ""
    }
}

export async function enUsuarios1() {
    const usuario = await usuarios.find()
    return usuario
}

export async function buscarUsuario(id) {
    const usuario = await usuarios.findById(id)
    return usuario
}

export async function elevarUsuario(id, categoria) {
    const respuestaMongo = await usuarios.findByIdAndUpdate(id, {categoria: categoria})
    return respuestaMongo
}

export async function borrarUsuario(id) {
    const respuestaMongo = await usuarios.findByIdAndDelete(id)
    return respuestaMongo
}

//BÚSQUEDAS
export async function buscarClientes(campo) {
    const regex = { $regex: campo, $options: 'i' } 
    const clientesDoc = await Clientes.find({ $or: [ { nombre: regex }, { telefono: regex }, { correo: regex } ] })
    return clientesDoc
}

export async function buscarProductos(campo) {
    const regex = { $regex: campo, $options: 'i' } 
    const productoDoc = await Productos.find({$or: [{producto: regex}, {categoria: regex},{proveedor:regex}]})
    return productoDoc
}

export async function buscarVentas(campo) {
    const regex = { $regex: campo, $options: 'i' } 
    const ventasDoc = await ventas.find({$or: [{nomPro: regex}, {nomCli: regex}]})
    return ventasDoc
}

export async function buscarUsuarios(campo) {
    const regex = { $regex: campo, $options: 'i' } 
    const usuarioDoc = await usuarios.find({$or: [{nombre: regex}, {correo: regex}]})
    return usuarioDoc
}