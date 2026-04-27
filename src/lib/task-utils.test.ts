import { describe, expect, it } from "vitest";

import { completionRate, overdueCount } from "./task-utils";

describe("task-utils", () => {
  it("returns completion percentage", () => {
    const rate = completionRate([
      { status: "DONE" },
      { status: "IN_PROGRESS" },
      { status: "DONE" },
      { status: "TODO" },
    ]);

    expect(rate).toBe(50);
  });

  it("counts overdue tasks that are not completed", () => {
    const now = new Date("2026-04-26T12:00:00.000Z");
    const overdue = overdueCount(
      [
        { status: "TODO", deadline: "2026-04-20T12:00:00.000Z" },
        { status: "IN_PROGRESS", deadline: "2026-04-25T11:00:00.000Z" },
        { status: "DONE", deadline: "2026-04-24T11:00:00.000Z" },
        { status: "TODO", deadline: "2026-04-29T12:00:00.000Z" },
      ],
      now
    );

    expect(overdue).toBe(2);
  });
});
