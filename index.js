const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser');

const app = express()
const port = 8081

const db_link = "mongodb://mongo:27017/customerdb";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(db_link, options).then(function () {
  console.log('MongoDB is connected');
})
  .catch(function (err) {
    console.log(err);
  });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Customer API",
      description: "Customer Class",
      contact: {
        name: "PaoCS"
      },
      servers: ["http://localhost:8081"]
    }
  },
  apis: ["index.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

let Schema = mongoose.Schema;

let customerSchema = new Schema({
  id: { type: String },
  name: { type: String },
  age: { type: Number }
}, { versionKey: false })

let Customer = mongoose.model('Customers', customerSchema)

/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/customers", (req, res) => {
  Customer.find({})
    .exec((err, customers) => {
      if (err)
        res.status(400).send('Oops! Something went wrong!');
      else
        res.status(200).send(customers);
    })
});

app.post("/customer", (req, res) => {
  let newCustomer = req.body;
  Customer.create(newCustomer, (err, customer) => {
    if (err)
      res.status(400).send('Oops! Something went wrong!');
    else
      res.status(201).send(customer);
  })
})

/**
 * @swagger
 * /customers:
 *  delete:
 *    description: Used to delete a customer based on one id
 *    responses:
 *      '202':
 *        description: A successful delete
 *      '400':
 *        description: An error ocurred
 */
app.delete("/customer", (req, res) => {
  // {id: "newId"}
  let filterId = req.body;
  Customer.deleteOne(filterId, (err, customer) => {
    if (err)
      res.status(400).send('Oops! Something went wrong!');
    else
      res.status(202).send(customer);
  })
});


/**
 * @swagger
 * /customers:
 *    put:
 *      description: Use to modify an existing customer
 *    parameters:
 *      - name: id
 *        in: body
 *        description: id of customer
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created customer
 */
app.put("/customer/:id", (req, res) => {
  let id = req.params.id;
  let newCustomer = req.body;
  Customer.findOneAndUpdate({ id }, newCustomer, (err, customer) => {
    if (err)
      res.status(400).send('Oops! Something went wrong!');
    else
      res.status(200).send(customer);
  })
});

app.listen(port, () => {
  console.log(`Example app listening at 8081`)
})