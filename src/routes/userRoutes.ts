import express from "express";
const router = express.Router();

import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);

export default router;
