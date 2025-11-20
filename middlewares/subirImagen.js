import multer from "multer"

export function subirImgagen(){
    const storage = multer.diskStorage({
        destination:"./public/images",
        filename: function(req, file, cb){
            const archivo = file.originalname
            cb(null, Date.now()+archivo)
        }
    })
    const upload = multer({storage}).single("foto") //Single = 1 "single('campo')" ; array = varios "array('campo', maximo)"
    return upload
}