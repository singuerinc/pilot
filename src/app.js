import dotenv from 'dotenv';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import cors from 'cors';
import schema from './schema';

dotenv.config();

const credentials = Buffer.from(
  `${process.env.USERNAME}:${process.env.PASSWORD}`,
  'ascii'
).toString('base64');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.options('/graphql', cors());
app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
    context: {
      credentials
    }
  })
);

app.listen(PORT, () => {
  console.log(`Server listen ${PORT}`);
});
