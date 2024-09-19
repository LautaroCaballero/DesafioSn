import {Router} from 'express'
import {deleteDenuncia, getDenunciaByDNI, getDenuncias, postDenuncia, updateDenuncia} from '../controllers/denuncias.controller'
import upload from '../multerConfig'

const router = Router();

router.get('/denuncias', getDenuncias)

router.get('/denuncias/:dni', getDenunciaByDNI)

router.post('/denuncias', upload.fields([
    { name: 'factura', maxCount: 1 },
    { name: 'otraDocumentacion', maxCount: 1 }
  ]), postDenuncia);

router.delete('/denuncias/:id', deleteDenuncia)

router.put("/denuncias/:id", updateDenuncia);

export default router;