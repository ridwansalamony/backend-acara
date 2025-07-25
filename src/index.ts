import express, { Request, Response } from "express";
import router from "./routes/api";
import db from "./utils/database";

async function init() {
  try {
    const result = await db();

    console.log("database status: " + result);

    const app = express();
    const PORT = 3000;

    app.use(express.json());

    app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ status: "Server is running!" });
    });

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    const err = error as Error;
    console.log(err.message);
  }
}

init();
