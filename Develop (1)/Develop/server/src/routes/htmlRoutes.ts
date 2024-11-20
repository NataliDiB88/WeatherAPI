import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

router.get('/butter', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/secret.html'));
});

export default router;