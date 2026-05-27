import type { Metadata } from "next";
import { TestereSecimTool } from "./TestereSecimTool";

export const metadata: Metadata = {
  title: "Testere & bıçak seçimi",
  description: "Malzeme, kesim tipi ve ortama göre doğru testere ve bıçak önerisi. Daire, şerit, dekupaj, tilki kuyruğu, zincirli.",
};

export default function TestereSecimPage() {
  return <TestereSecimTool />;
}
