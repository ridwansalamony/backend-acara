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
        identifier: "sayangkamu",
        password: "Sayangkamu00",
      },
      RegisterRequest: {
        fullname: "sayang kamu",
        username: "sayangkamu",
        email: "sayangkamu@yopmail.com",
        password: "Sayangkamu00",
        confirmPassword: "Sayangkamu00",
      },
      ActivationRequest: {
        code: "abcdef",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category Object.id",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region ID",
          coordinates: [0.0, 0.0],
        },
        isOnline: false,
        isFeatured: false,
      },
      DeleteMediaRequest: {
        fileUrl: "",
      },
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
