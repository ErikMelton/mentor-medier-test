import dotenv from 'dotenv';
import express, { Express } from 'express'

import * as todoModels from './models/todo';
import todoRouter from './api/v1/todo';
import sequelize from './db'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// TODO-Extended: use sequelize-cli to create and manage migrations, or another migration tool
// TODO-Extended: Reduce some code duplication in handlers/todos.ts
(async () => {
  await sequelize.sync();
})();

app.use(express.json());
app.use('/todo', todoRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

export default app;
