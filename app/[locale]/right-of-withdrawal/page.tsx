import {
  createLegalMetadata,
  createLegalPage,
} from "@/lib/legal/create-legal-page";

export const generateMetadata = createLegalMetadata("regret", "regret");
export default createLegalPage("regret", { withRegretForm: true });
