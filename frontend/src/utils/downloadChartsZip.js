import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";

export async function downloadChartsZip() {
  // 🔥 Wait for charts to fully render
  await new Promise(res => setTimeout(res, 1500));

  const zip = new JSZip();

  // 🔥 Better selector (covers all recharts)
const charts = document.querySelectorAll(".cc");
  if (charts.length === 0) {
    alert("No charts found!");
    return;
  }

  let i = 1;

  for (const chart of charts) {
    try {
      const dataUrl = await toPng(chart, {
  cacheBust: true,
  backgroundColor: "#ffffff",
  pixelRatio: 2,
  skipFonts: true, 
});

      const base64 = dataUrl.split(",")[1];

      // 🔥 Better file naming
      zip.file(`Chart-${i}.png`, base64, { base64: true });

      i++;
    } catch (err) {
      console.error("Error capturing chart:", err);
    }
  }

  // 🔥 Generate ZIP
  const content = await zip.generateAsync({ type: "blob" });

  saveAs(content, "SkillMap_Charts.zip");
}