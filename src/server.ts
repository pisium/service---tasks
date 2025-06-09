import express from "express";
import { taskRoutes } from "./presentation/routes/task.routes";

const app = express();
app.use(express.json());

app.use('/tasks', taskRoutes);

app.listen(3002, () => console.log('Server online na porta 3002 ✅'));
