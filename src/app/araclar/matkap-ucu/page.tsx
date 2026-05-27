import type { Metadata } from "next";
import { MatkapUcuTool } from "@/components/matkap-ucu/MatkapUcuTool";

export const metadata: Metadata = {
  title: "Matkap ucu seçimi",
  description: "Malzeme ve kullanıma göre matkap ucu ailesi önerisi; darbeli matkap uyumu ve pratik notlar.",
};

export default function MatkapUcuPage() {
  return <MatkapUcuTool />;
}
