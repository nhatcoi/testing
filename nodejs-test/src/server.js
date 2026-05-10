import { createApp } from './app.js';
import { createProductStore } from './productStore.js';

const PORT = process.env.PORT || 3001;
const store = createProductStore();
const app = createApp(store);

app.listen(PORT, () => {
  console.log(`nodejs-test listening on http://localhost:${PORT}`);
});
