import express, { Request, Response, Router } from "express";
import * as db from "../services/db";
import * as jwt from "jsonwebtoken";

const router: Router = express.Router();

router.post("/create", function (req: Request, res: Response) {
    db.createMaster(req.body.user).then((data) => res.json(data));
});

router.post("/", function (req: Request, res: Response) {
  const password = req.body.password;

  db.getMaster("admin", password).then((data) => {
    // Master record found, generate JWT token
    // @ts-expect-error || @ts-ignore
    const payload = { id: data.role };
    const secretKey = process.env.JWT_SECRET; // Replace with your own secret key
    const options = { expiresIn: "30d" }; // Set expiration time as desired

    jwt.sign(payload, secretKey!, options, (err, token) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Error generating JWT token", error: err });
        return;
      }

      // Include the token in the response
      res.json({ token: token });
    });
  });
});

router.get("/verify", function (req: Request, res: Response) {
  const token = req.query.token?.toString();

  jwt.verify(token!, process.env.JWT_SECRET!, (error) => {
    if (error) {
      // If verification fails, the token is invalid or expired
      res.status(401).json({ message: "Unauthorized" });
    } else {
      res.status(200).json({ token: token });
    }
  });
});

export default router;
