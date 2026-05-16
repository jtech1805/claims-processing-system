import { Request, Response } from "express";

export const createClaim = async (
    req: Request,
    res: Response
) => {
    res.status(201).json({
        success: true,
        message: "Claim created successfully",
        data: req.body
    });
};