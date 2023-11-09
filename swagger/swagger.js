const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const options = {
  info: {
    title: "Errands_app API Docs",
    description: "Errands_app api 문서입니다",
  },
  servers: [
    {
      url: "http://13.125.221.221",
    },
  ],
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "./swagger/swagger-output.json";
const endpointsFiles = ["../index.ts"];
swaggerAutogen(outputFile, endpointsFiles, options);
