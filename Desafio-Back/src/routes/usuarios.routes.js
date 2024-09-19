import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/usuarios.controller';

const router = Router();

router.post('/usuarios/register', registerUser);
router.post('/usuarios/login', loginUser);

export default router;