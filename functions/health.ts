export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      service: "taskflow-api",
      timestamp: new Date().toISOString(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
