import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes';
import sequelize from './config/database';
import { errorMiddleware } from './middleware/ErrorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorMiddleware);

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
