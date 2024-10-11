// index.js

const express = require("express");

const { generatePdfFile } = require("./utils");

const app = express();

const PORT = 3000;

app.use("/get-pdf", async (req, res) => {
  // Your html here...
  const html = "<h1>Hello World</h1>";

  const pdf = await generatePdfFile({ html });

  res.contentType("application/pdf");
  return res.send(pdf);
});

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}...`);
});
