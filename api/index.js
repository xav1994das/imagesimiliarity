import Router from "router";
import finalhandler from "finalhandler";
import upsertEmbeddings from "../services/upsertEmbeddings.js";
import queryEmbeddings from "../services/queryEmbeddings.js";
import { allowCors } from "../utils/utils.js";

const router = Router();
router.post("/api/upsertEmbeddings", upsertEmbeddings);
router.post("/api/queryEmbeddings", queryEmbeddings);
function getRoutes(req, res) {
  console.log(`Received request: ${req.method} ${req.url}`);
  router(req, res, finalhandler(req, res));
}

export default allowCors(getRoutes);
//export default getRoutes;
