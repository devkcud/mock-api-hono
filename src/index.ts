import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/posts",
  cors({
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
  }),
);

const prisma = new PrismaClient();

app.get("/health", function (c) {
  return c.text("Hello Hono!");
});

app.get("/posts", async function (c) {
  const posts = await prisma.post.findMany();
  return c.json(posts, 200);
});

app.get("/posts/:id", async function (c) {
  const id = Number(c.req.param().id);
  const posts = await prisma.post.findFirst({ where: { id } });
  return c.json(posts, 200);
});

app.post("/posts", async function (c) {
  try {
    const data = await c.req.json();
    const { title, message, category } = data;

    if (!title || !message || !category) {
      return c.json(
        { message: "Title and content and category are required" },
        400,
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        message,
        category,
      },
    });

    return c.json(post, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.delete("/posts", async function (c) {
  try {
    const data = await c.req.json();
    const { id } = data;

    if (!id) {
      return c.json({ message: "ID is required" }, 400);
    }

    if ((await prisma.post.count({ where: { id } })) === 0) {
      return c.json({ message: "ID not found" }, 400);
    }

    await prisma.post.delete({ where: { id } });

    return c.json({ message: "Deleted" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.put("/posts", async function (c) {
  try {
    const data = await c.req.json();
    const { id, title, message, category } = data;

    if (!id || !title || !message || !category) {
      return c.json(
        { message: "ID, title, message and category are required" },
        400,
      );
    }

    await prisma.post.update({
      where: { id },
      data: { title, message, category },
    });

    return c.json({ message: "Deleted" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

const port = 4321;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
