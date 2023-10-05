import prisma from "./lib/index.js";
import bcrypt from "bcrypt";
import { router } from "./authors.js";

//  log in
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAuthor = await prisma.author.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingAuthor) {
      res.status(400).json({
        message: "User does not exist",
      });
    }

    // check password
    const ispasswordCorrect = await bcrypt.compare(
      password,
      existingAuthor.password
    );

    if (!ispasswordCorrect) {
      res.status(400).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {}
});
