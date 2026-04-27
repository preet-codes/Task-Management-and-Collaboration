import { createRequire as topLevelCreateRequire } from 'module';
const require = topLevelCreateRequire(import.meta.url);
import { fileURLToPath as topLevelFileUrlToPath, URL as topLevelURL } from "url"
const __dirname = topLevelFileUrlToPath(new topLevelURL(".", import.meta.url))

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// functions/health.ts
async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      service: "taskflow-api",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
}
__name(handler, "handler");
export {
  handler
};
//# sourceMappingURL=health.mjs.map
