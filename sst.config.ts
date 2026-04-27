import { SSTConfig } from "sst";

import { ApiStack } from "./stacks/ApiStack";

export default {
  config() {
    return {
      name: "taskflow",
      region: "ap-south-1",
    };
  },
  stacks(app) {
    app.stack(ApiStack);
  },
} satisfies SSTConfig;
