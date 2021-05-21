const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const data = require("./data.json");
const app = express();
const port = process.env.PORT || 5000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "phantira Swagger",
      description: "Project API Information",
      servers: ["http://localhost:5000"]
    }
  },
  // ['.routes/*.js']
  apis: ["App.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// const corsOptions = {
//   origin: ["http://localhost:80","http://localhost:3000"],
//   optionsSuccessStatus: 200,
// };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Routes
/**
 * @swagger
 * /data:
 *  get:
 *    tags : ["Example"]
 *    description: Json ทั้งหมด
 *    responses:
 *      '200':
 *        description: อ่าน Api สำเร็จ
 */
/**
 * @swagger
 * /data2:
 *  get:
 *    tags : ["Example"]
 *    description: Json ทั้งหมด
 *    responses:
 *      '200':
 *        description: อ่าน Api สำเร็จ
 */
/**
 * @swagger
 * /data/{name}:
 *  get:
 *    tags : ["Example2"]
 *    parameters:
 *       - name: name
 *         in: path
 *         required: true
 *    description: Json บางส่วน
 *    responses:
 *      '200':
 *        description: อ่าน Api สำเร็จ
 */
app.get("/data",  (req, res) => {
  res.json(data);
});

app.get("/data2",  (req, res) => {
  res.json(data);
});

app.get("/data/:name", (req, res) => {
  const resalt = data.filter(function(data){return data.name == req.params.name})
  // console.log(resalt.length)
  if(resalt.length > 0){
    res.json(resalt[Math.floor(Math.random() * resalt.length)])
    // console.log(Math.floor(Math.random() * resalt.length))
 }else{
    res.json({})
  }
});

app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`);
  console.log(`Example app listening at http://localhost:${port}/swagger`);
  console.log(`Example app listening at http://localhost:${port}/data`);
});