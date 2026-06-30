import {
  createLegalMetadata,
  createLegalPage,
} from "@/lib/legal/create-legal-page";

export const generateMetadata = createLegalMetadata("disclaimer", "disclaimer");
export default createLegalPage("disclaimer");
