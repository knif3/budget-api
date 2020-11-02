import express, { Request, Response } from 'express';
import path from "path";

const app = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.json({
    'result': 'ok',
  });
});

// start the express server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
