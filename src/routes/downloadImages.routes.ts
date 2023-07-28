import {Router} from 'express';
import { downloadImages } from '../controllers/downloadImages.controller';

const router: Router = Router();
router.get('/', downloadImages);

export default router;