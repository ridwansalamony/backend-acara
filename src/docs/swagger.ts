import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/api"];
const doc = {
  info: {
    version: "1.0.0",
    title: "API Acara Documentation",
    description: "API Acara Documentation",
  },

  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://backend-acara-virid.vercel.app/api",
      description: "Deploy Server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "ridwansalamony",
        password: "SVJ-w65Czm2t32",
      },
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
