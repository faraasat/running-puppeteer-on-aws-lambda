const AWS = require("aws-sdk");

AWS.config.loadFromPath(`./aws.config.json`);

exports.generatePdfFile = async ({ html }) => {
  try {
    const lambda = new AWS.Lambda({});

    // Invoke the Lambda function
    const lambdaResult = await lambda
      .invoke({
        FunctionName: "puppeteer-lambd",
        Payload: JSON.stringify({
          body: {
            html: html,
          },
        }),
      })
      .promise();

    if (lambdaResult.StatusCode === 200) {
      // The body contains the base64 encoded PDF
      const pdfBase64 = JSON.parse(lambdaResult.Payload);

      // Convert base64 string back to a buffer (binary data)
      const pdfBuffer = Buffer.from(pdfBase64, "base64");

      // Send the PDF buffer to the client
      return pdfBuffer;
    } else {
      console.log(responsePayload);
      throw Error("Error generating PDF");
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    throw Error("Error generating PDF");
  }
};
