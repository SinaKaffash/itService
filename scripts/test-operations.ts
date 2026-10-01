import assert from "node:assert/strict";

import { projectSchema } from "../src/features/operations/operations.schema";

const baseProject = {
  title: "پروژه عمومی",
  description: "خلاصه‌ای امن برای نمایش در وب‌سایت.",
  progress: 45,
  status: "IN_PROGRESS",
  startDate: "",
  expectedEndDate: "2026-12-01",
  completedAt: "",
  published: true,
  isActive: true,
  sortOrder: 0,
};

assert.equal(projectSchema.safeParse(baseProject).success, true);
assert.equal(projectSchema.safeParse({ ...baseProject, progress: -1 }).success, false);
assert.equal(projectSchema.safeParse({ ...baseProject, progress: 101 }).success, false);
assert.equal(
  projectSchema.safeParse({ ...baseProject, status: "COMPLETED", progress: 99 }).success,
  false,
);
assert.equal(
  projectSchema.safeParse({
    ...baseProject,
    status: "COMPLETED",
    progress: 100,
    completedAt: "2026-12-02",
  }).success,
  true,
);

console.log("Project progress validation tests passed.");
