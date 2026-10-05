# Note2Flash Backend

The Express API stores flashcards in MongoDB through Mongoose.

## Configure MongoDB

1. Start a local MongoDB Community Server, or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` in this folder.
3. Set `MONGODB_URI` in `.env` to your local MongoDB URI or Atlas connection string. Keep `.env` private and do not commit it.

For Atlas, allow the development machine's IP address in the cluster network access rules and create a database user. Do not put the connection string in the mobile app.

## Run

From the repository root:

```sh
npm start --prefix Backend
```

The API listens on port 5000 by default. Android Emulator reaches the development computer through `10.0.2.2`, which is already configured in the mobile app's API service.

## Test

```sh
npm test --prefix Backend
```