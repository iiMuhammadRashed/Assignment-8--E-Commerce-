import 'dotenv/config';
import express from 'express';
import { connection } from './database/dbConnection.js';
import { bootstrap } from './src/bootstrap.js';
import { globalErrorHandler } from './src/utils/globalErrorHandler.js';
const app = express();
const port = 4000 || process.env.PORT;
app.use(express.json());
app.use(express.static('uploads'));
bootstrap(app);
connection();
app.use(globalErrorHandler);
app.listen(port, () => console.log(` app listening on port 4000!`));

export default app;
