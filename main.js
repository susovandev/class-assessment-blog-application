import initializeApp from './src/app.js';
import { config } from './src/config/index.js';
import connectDB from './src/config/database.js';

export default function initializeServer() {
  const app = initializeApp();
  const port = config.PORT;
  connectDB()
    .then(() => {
      app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
    })
    .catch((error) => {
      console.error('Error connecting to database', error?.message);
      process.exit(1);
    });
}

initializeServer();
