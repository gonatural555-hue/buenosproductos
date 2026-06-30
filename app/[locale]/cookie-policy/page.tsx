import {
  createLegalMetadata,
  createLegalPage,
} from "@/lib/legal/create-legal-page";

export const generateMetadata = createLegalMetadata("cookies", "cookies");
export default createLegalPage("cookies");
