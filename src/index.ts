import app from "./applications/app";
import db from "./applications/database";

async function init() {
  try {
    const result = await db();
    console.log("Database status: ", result);

    const PORT = 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const err = error as Error;
    console.log(err.message);
  }
}

init();
