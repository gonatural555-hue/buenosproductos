import {
  createLegalMetadata,
  createLegalPage,
} from "@/lib/legal/create-legal-page";

export const generateMetadata = createLegalMetadata("terms", "terms");
export default createLegalPage("terms");
