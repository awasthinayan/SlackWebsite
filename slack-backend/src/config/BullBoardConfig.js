import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import mailQueue from "../queues/mailQueue.js";

const bullserverAdapter = new ExpressAdapter(); 
bullserverAdapter.setBasePath("/Ui");

createBullBoard({
  queues: [new BullAdapter(mailQueue)],
  serverAdapter: bullserverAdapter
});

export default bullserverAdapter;