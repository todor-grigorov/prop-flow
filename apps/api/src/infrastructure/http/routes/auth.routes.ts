import { Router } from "express";
import { z } from "zod";
import { container } from "../../container.js";

export const authRouter = Router();

const devLoginSchema = z.object({
  email: z.string().email(),
  tenantId: z.string().uuid().optional(),
});

authRouter.post("/dev-login", async (req, res, next) => {
  try {
    const input = devLoginSchema.parse(req.body);

    const result = await container.devLoginUseCase.execute(input);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
