import {
  createLegalMetadata,
  createLegalPage,
} from "@/lib/legal/create-legal-page";

export const generateMetadata = createLegalMetadata("shipping", "shipping");
export default createLegalPage("shipping");
