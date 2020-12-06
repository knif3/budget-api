import express, { Request, Response } from 'express';
import fsWatcher from './services/fsWatcher';
import cors from 'cors';
import responseTime from 'response-time';
import { logger } from './services/core/winston-logger-service';
import { trafficRouter } from './routes/traffic-routes';
import { userRouter } from './routes/user-routes';
import { budgetRouter } from './routes/budget-routes';
import { companyRouter } from './routes/company-routes';

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(responseTime((req: express.Request, res: express.Response, time: number) => {
  logger.info(`${req.method} ${req.originalUrl} ${time.toPrecision(5)}ms`);
}));

app.use('/user', userRouter);
app.use('/budget', budgetRouter);
app.use('/company', companyRouter);
app.use('/traffic', trafficRouter);

// app.get('/', (req: Request, res: Response) => {
//   res.json({
//     'result': 'done',
//   });
// });
//
// app.get('/items', (req: Request, res: Response) => {
//   const basic = {
//     id: '4',
//     title: 'impostor 2',
//     amount: 9,
//   };
//
//   let items = [
//     {
//       id: '1',
//       title: 'gas',
//       amount: 987,
//     },
//     {
//       id: '2',
//       title: 'petrol',
//       amount: 66,
//     },
//     {
//       id: '3',
//       title: 'impostor',
//       amount: 1,
//     },
//     {
//       id: '4',
//       title: 'impostor 2',
//       amount: 9,
//     },
//   ];
//
//   items.push({
//     ...basic,
//     id: '5',
//     amount: Math.floor(Math.random() * 100)
//   })
//
//   items.sort(() => Math.random() - 0.5);
//
//   res.json(items);
// });

//const INotifyWait = require('inotifywait');


//let watch1 = new INotifyWait('/app/var/dummy/', {recursive: false});
//watch1.on('ready', (filename: string) => {
//  console.log('watcher is watching');
//});
//watch1.on('add', (filename: string) => {
//  console.log(filename + ' added');
//  watch1.close();
//});

// fsWatcher.listen();


// start the express server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
