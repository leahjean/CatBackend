import express from 'express';
import downLoadImagesRoutes from './routes/downloadImages.routes'
import cors from 'cors'

const PORT = 5000;
const app = express();

const  corsOptions = {
    origin: ['http://localhost:5173']
}

app.use(cors(corsOptions));
app.use('/downloadImages', downLoadImagesRoutes);

const server = app.listen(PORT, () => console.log(`Server started on ${PORT}`));
export default server;