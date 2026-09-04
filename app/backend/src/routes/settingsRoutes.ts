import express from "express";
import settings from '../controllers/setttingsController.ts';

const router = express.Router();

router.post('/username', settings.changeUsername);

router.post('/password', settings.changePassword);

router.delete('/delete', settings.deleteAccount);

export default router;