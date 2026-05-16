// middleware/validate.ts

import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodType) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    errors: result.error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                });
            }

            req.body = result.data;
            next();
        };