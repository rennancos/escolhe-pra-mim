import { discover } from "@/controllers/discoverController";

export async function GET(request) {
  return discover(request);
}
