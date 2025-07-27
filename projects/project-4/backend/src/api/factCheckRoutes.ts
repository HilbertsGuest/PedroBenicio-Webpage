import { Router } from 'express';
import multer from 'multer';
import { factCheckController } from '../controllers/factCheckController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('audio'), factCheckController);

export default router;
