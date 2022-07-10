import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import responseTime from 'response-time';
import { logger } from './services/core/winston-logger-service';
import {
  userRouter,
  trafficRouter,
  companyRouter,
  budgetRouter,
  groupRouter,
} from './routes';

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    logger.info(`${req.method} ${req.originalUrl} ${time.toPrecision(5)}ms`);
  })
);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/group', groupRouter);
app.use('/api/v1/budget', budgetRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/traffic', trafficRouter);

// start the express server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
