import { prisma } from "../src/lib/prisma";
import { submitLeadRequestAction } from "../src/actions/lead-request.actions";
import { adminRequestService } from "../src/services/admin-request.service";

const marker = `smoke-${Date.now()}`;

async function main() {
  const result = await submitLeadRequestAction({
    fullName: "Smoke Test",
    phone: `+980${Date.now().toString().slice(-9)}`,
    email: "",
    company: marker,
    serviceType: "web-platforms",
    budget: "starter",
    description:
      "Automated smoke-test request proving the service and repository flow.",
    locale: "en",
    honeypot: "",
  });

  if (!result.success) {
    throw new Error("Lead request action rejected valid input.");
  }

  const saved = await prisma.leadRequest.findFirst({
    where: { company: marker },
  });

  if (!saved) {
    throw new Error("Lead request was not persisted.");
  }

  if (
    saved.fullName !== "Smoke Test" ||
    saved.serviceType !== "web-platforms" ||
    saved.description.length < 20
  ) {
    throw new Error("Persisted lead request did not match the submission.");
  }

  const adminView = await adminRequestService.getRequest(saved.id);
  if (!adminView || adminView.status !== "NEW") {
    throw new Error("Admin request detail could not load the new lead.");
  }

  await adminRequestService.updateStatus(saved.id, "IN_REVIEW");
  const updated = await adminRequestService.getRequest(saved.id);
  if (updated?.status !== "IN_REVIEW") {
    throw new Error("Admin request status update was not persisted.");
  }

  await adminRequestService.archiveRequest(saved.id);
  const archived = await adminRequestService.getRequest(saved.id);
  if (archived?.status !== "ARCHIVED") {
    throw new Error("Admin request archive was not persisted.");
  }

  const honeypotResult = await submitLeadRequestAction({
    fullName: "Spam Test",
    phone: "+980000000000",
    email: "",
    company: marker,
    serviceType: "web-platforms",
    budget: "starter",
    description: "This honeypot request must never be persisted in the database.",
    locale: "en",
    honeypot: "bot-filled-value",
  });

  if (!honeypotResult.success) {
    throw new Error("Honeypot submission exposed its rejection.");
  }

  const matchingRows = await prisma.leadRequest.count({
    where: { company: marker },
  });

  if (matchingRows !== 1) {
    throw new Error("Honeypot submission was not discarded.");
  }

  await prisma.leadRequest.delete({ where: { id: saved.id } });
  console.log("Lead request persistence and honeypot smoke test passed.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
