import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { ContactPageView } from "./contact-page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Liên hệ | DSH NATURE",
  description: "Thông tin liên hệ và form gửi ý kiến tới CÔNG TY CỔ PHẦN DSH NATURE.",
};

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  return <ContactPageView siteSettings={siteSettings} />;
}
