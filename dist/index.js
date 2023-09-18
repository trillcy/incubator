"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
// export const app = express()
const port = 3004;
const app = (0, app_1.startApp)();
// app.use(express.json())
// export const RouterPaths = {
//   videos: '/videos',
//   testing: '/testing',
// }
// app.use(RouterPaths.videos, videosRouter(db))
// app.use(RouterPaths.testing, testingRouter(db))
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
