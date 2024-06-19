import express, { Request, Response, Router } from "express";
import { verifyToken } from "../services/jwtService";
import { upload, deleteFile } from "../services/fileService";
import * as db from "../services/db";

const router: Router = express.Router();

/* GET users listing. */
router.get("/", async function (req: Request, res: Response) {
  const page: number = Number(req.query.page) || 1;
  const itemsPerPage: number = 5;

  db.getLiveBlogsPaginated(itemsPerPage, page).then((data) => res.json(data));
});

router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  function (req: Request, res: Response) {
    const createdItem: any = JSON.parse(req.body.liveblog);
    createdItem.isVideo = false;

    if (req.file) {
      console.log("FILE EXISTS");
      const fileExtension: string = req.file.originalname
        .split(".")
        .pop()!
        .toLowerCase();
      const videoExtensions: string[] = ["mp4", "avi", "mov", "mkv"];

      if (videoExtensions.includes(fileExtension)) {
        createdItem.mediaSource = req.file.path;
        createdItem.isVideo = true;
      } else {
        createdItem.imageSource = req.file.path;
        createdItem.isVideo = false;
      }
    }

    db.createLiveBlog(createdItem).then((data) => res.json(data));
  }
);

router.delete("/:id", verifyToken, function (req: Request, res: Response) {
    db.deleteLiveBlog(req.params.id).then((data) => res.json(data));
});

router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  function (req: Request, res: Response) {
    const updatedItem: any = JSON.parse(req.body.item);

    if (req.file) {
      if (updatedItem.imageSource) deleteFile(updatedItem.imageSource);
      if (updatedItem.mediaSource) deleteFile(updatedItem.mediaSource);

      const fileExtension: string = req.file.originalname
        .split(".")
        .pop()!
        .toLowerCase();
      const videoExtensions: string[] = ["mp4", "avi", "mov", "mkv"];

      if (videoExtensions.includes(fileExtension)) {
        updatedItem.mediaSource = req.file.path;
        updatedItem.isVideo = true;
        updatedItem.imageSource = null;
      } else {
        updatedItem.imageSource = req.file.path;
        updatedItem.isVideo = false;
        updatedItem.mediaSource = null;
      }
    }

    db.updateLiveBlog(req.params.id, updatedItem).then((data) => res.json(data));
  }
);

export default router;
