import express, { Request, Response } from "express";
import router from "../routes/api";
import cors from "cors";
import { errorMiddleware } from "../middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../docs/swagger-output.json";
import fs from "fs";
import path from "path";

// swagger
const css = fs.readFileSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"), "utf-8");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorMiddleware);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerOutput, {
    customCss: css,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "Server is running!" });
});

export default app;
