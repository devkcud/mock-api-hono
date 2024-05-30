import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/posts/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
  }),
);

const prisma = new PrismaClient();

app.get("/posts", async function (c) {
  const posts = await prisma.post.findMany();
  return c.json(posts, 200);
});

app.get("/posts/:id", async function (c) {
  const id = Number(c.req.param().id);

  if (isNaN(id)) {
    return c.json({ message: "Couldn't remove id that isn't a number" }, 400);
  }

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

    await prisma.post.create({
      data: {
        title,
        message,
        category,
      },
    });

    return c.json({ message: "Created" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.delete("/posts/:id", async function (c) {
  try {
    const id = Number(c.req.param().id);

    if (isNaN(id)) {
      return c.json({ message: "Couldn't remove id that isn't a number" }, 400);
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

app.put("/posts/:id", async function (c) {
  try {
    const id = Number(c.req.param().id);

    if (isNaN(id)) {
      return c.json({ message: "Couldn't remove id that isn't a number" }, 400);
    }

    const data = await c.req.json();
    const { title, message, category } = data;

    const old = await prisma.post.findFirst({ where: { id } });

    if (!old) {
      return c.json({ message: "Couldn't find item by id" }, 400);
    }

    await prisma.post.update({
      where: { id },
      data: {
        title: title ?? old.title,
        message: message ?? old.message,
        category: category ?? old.category,
      },
    });

    return c.json({ message: "Updated" }, 200);
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
