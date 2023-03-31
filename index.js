const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

//# Middleware:
app.use(cors());
app.use(express.json());

//* Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d0hszsm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//* Server function
async function run() {
  try {
    const userCollection = client.db("spendsavvy").collection("users");

    //* Starting Code:
    app.get("/", (req, res) => {
      res.send("Server is working");
    });

    //* Console Listing Code
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });

    //* Registration: if email exists will throw an error
    app.post("/registration", async (req, res) => {
      const { email, name } = req.body;
      const emailExist = await userCollection.findOne({ email });

      if (emailExist) {
        return res.status(409).send({ message: "Email is already registered" });
      }

      const newUser = { email, name };
      const result = await userCollection.insertOne(newUser);
      return res.status(201).send({
        message: "User created successfully",
      });
    });
    //* GOOGLE: if email exists will not throw an error
    app.post("/googleregistration", async (req, res) => {
      const { email, name } = req.body;
      const emailExist = await userCollection.findOne({ email });

      if (emailExist) {
        return res.status(200).send({ message: "Email is already registered" });
      }
      const newUser = { email, name };
      const result = await userCollection.insertOne(newUser);
      return res.status(201).send({
        message: "User created successfully",
      });
    });
  } catch (err) {
    console.error(err);
  }
}

(async () => {
  await run();
})();
