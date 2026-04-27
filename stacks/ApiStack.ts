import { Api, StackContext } from "sst/constructs";

export function ApiStack({ stack }: StackContext) {
  const api = new Api(stack, "TaskflowApi", {
    cors: {
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
    routes: {
      "GET /health": "functions/health.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
