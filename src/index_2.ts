import express from 'express';
import { userRouter } from './routes/traffic-routes';
import { groupRouter } from './routes/group-routes';
import { logger } from './services/winston-logger-service';
import './services/error-handling-service';
import responseTime from 'response-time';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(responseTime((req: express.Request, res: express.Response, time: number) => {
    logger.info(`${req.method} ${req.originalUrl} ${time.toPrecision(5)}ms`);
}));

app.use('/user', userRouter);
app.use('/group', groupRouter);

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
});
