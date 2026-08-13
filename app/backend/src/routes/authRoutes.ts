import express from "express";
import auth from '../controllers/authController.ts';

const router = express.Router();

router.post('/register', auth.register);

router.post('/login', auth.login);

router.post('/verifyToken', auth.verifyToken); 

export default router;