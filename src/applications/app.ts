import express, { Request, Response } from "express";
import router from "../routes/api";
import cors from "cors";
import { errorMiddleware } from "../middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../docs/swagger-output.json";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "Server is running!" });
});

export default app;
