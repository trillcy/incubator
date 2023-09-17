"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
// export const app = express()
const port = 3003;
// app.use(express.json())
// export const RouterPaths = {
//   videos: '/videos',
//   testing: '/testing',
// }
// app.use(RouterPaths.videos, videosRouter(db))
// app.use(RouterPaths.testing, testingRouter(db))
app_1.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
