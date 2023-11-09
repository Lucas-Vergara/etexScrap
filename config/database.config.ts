// database.config.ts
export default {
  uri: process.env.MONGO_CONNECTION,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
