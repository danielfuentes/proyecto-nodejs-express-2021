const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const mantenimiento = require('../middlewares/mantenimiento');

const adminController = require(path.resolve(__dirname , '..','controllers','adminController'));

//Aquí dispongo la información del storage para tratamiento de guardado imagenes
//https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/images/platos'));    //Aquí deben indicar donde van a guardar la imagen
    },
    filename: function (req, file, cb) {
      cb(null, 'plato' + '-' + Date.now()+ path.extname(file.originalname));      //UNIQID() --- PHP
    }
  })
   
const upload= multer({ storage })

router.get('/administrar/buscar', adminController.search);
router.get('/administrar',mantenimiento, adminController.index);
router.get('/admin/create',  adminController.create);
router.post('/admin/create', upload.single('imagen'), adminController.save);
router.get('/admin/detail/:id', adminController.show);
router.get('/admin/delete/:id', adminController.destroy);
router.get('/admin/edit/:id', adminController.edit);
router.put('/admin/edit/:id', upload.single('imagen'),adminController.update);




module.exports = router;
