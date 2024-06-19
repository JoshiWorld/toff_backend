import express, { Request, Response, Router } from "express";
import * as db from "../services/db";
import { verifyToken } from "../services/jwtService";

const router: Router = express.Router();

router.get("/", function (res: Response) {
    db.getStats().then((data) => res.json(data));
});

router.post("/create", verifyToken, function (req: Request, res: Response) {
    db.createStats(req.body.stats).then((data) => res.json(data));
});

router.put("/:id", verifyToken, function (req: Request, res: Response) {
  const updatedItem = req.body.stats;

    db.updateStats(req.params.id, updatedItem).then((data) => res.json(data));
});

router.delete("/:id", verifyToken, function (req: Request, res: Response) {
    db.deleteStats(req.params.id).then((data) => res.json(data));
});

export default router;
