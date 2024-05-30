bun:

```bash
bun install
bunx prisma db push
bun run dev
```

npm:

```bash
npm install
npx prisma db push
npm run dev
```

open `http://localhost:4321`

## Routes

### `GET /posts`

- Respose: `200`

```json
{
    "id": 0,
    "title": "",
    "message": "",
    "category": ""
}[]
```

### `GET /posts/:id`

- Param `id` -> **Number**

- Response: `200`

```json
{
    "id": 0,
    "title": "",
    "message": "",
    "category": ""
}
```

- On Error: `400`

```json
{
    "message": ""
}
```

### `POST /posts`

- Body:

```json
{
    "title": "",
    "message": "",
    "category": "",
}
```

- Response: `201` (no body)

- On Error: `400`, `500`

```json
{
    "message": ""
}
```

### `DELETE /posts/:id`

Param `id` -> **Number**

- Response: `201` (no body)

- On Error: `400`, `500`

```json
{
    "message": ""
}
```

### `PUT /posts/:id`

Param `id` -> **Number**

- Response: `200` (no body)

- On Error: `400`, `500`

```json
{
    "message": ""
}
```
