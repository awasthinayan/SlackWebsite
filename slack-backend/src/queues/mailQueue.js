import Queue from "bull";

import { REDIS_HOST, REDIS_PORT } from "../config/serverConfig.js";

export default new Queue("mailQueue",{
    redis:{
        port:REDIS_PORT,
        host:REDIS_HOST
    }
});