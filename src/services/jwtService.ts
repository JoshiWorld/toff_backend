import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (error: jwt.VerifyErrors | null, decodedToken: any) => {
      if (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      next();
    }
  );
}

export { verifyToken };
