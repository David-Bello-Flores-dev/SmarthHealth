import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import clinicalRecordRoutes from './routes/clinicalRecordRoutes.js';
import citasRoutes from './routes/citasRoutes.js';
import recetasRoutes from './routes/recetasRoutes.js';
import pacientesRoutes from './routes/pacientesRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', clinicalRecordRoutes);
app.use('/api', citasRoutes);
app.use('/api', recetasRoutes);
app.use('/api', pacientesRoutes);


// Healthcheck simple para confirmar que el server está vivo
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
