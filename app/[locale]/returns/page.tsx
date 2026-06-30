import {
  createLegalMetadata,
  createLegalPage,
} from "@/lib/legal/create-legal-page";

export const generateMetadata = createLegalMetadata("returns", "returns");
export default createLegalPage("returns");
