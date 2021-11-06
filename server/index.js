/* eslint-disable no-console */
import express from 'express';
import authRouter from './routes/routes';

const app = express();

app.use('/', authRouter);

app.listen(8080, () => console.log('alive on http://localhost:8080'));

export default app;
