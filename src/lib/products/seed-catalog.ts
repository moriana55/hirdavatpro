import type { ProductCategory } from "./types";

export interface SeedProduct {
  brand: string;
  model: string;
  category: ProductCategory;
}

export const SEED_CATALOG: SeedProduct[] = [
  // ══════════════════════════════════════
  // DELME & VİDALAMA
  // ══════════════════════════════════════
  { brand: "Bosch", model: "GSB 13 RE", category: "darbeli-matkap" },
  { brand: "Makita", model: "HP1630", category: "darbeli-matkap" },
  { brand: "DeWalt", model: "DWD024", category: "darbeli-matkap" },
  { brand: "Bosch", model: "GSB 16 RE", category: "darbeli-matkap" },
  { brand: "Makita", model: "HP1631", category: "darbeli-matkap" },
  { brand: "Black+Decker", model: "KR714CRES", category: "darbeli-matkap" },
  { brand: "Metabo", model: "SBE 650", category: "darbeli-matkap" },
  { brand: "Milwaukee", model: "M18 FPD2", category: "darbeli-matkap" },
  { brand: "Bosch", model: "GSB 21-2 RCT", category: "darbeli-matkap" },
  { brand: "DeWalt", model: "DCD796", category: "darbeli-matkap" },

  { brand: "Bosch", model: "GSR 12V-15", category: "vidalama" },
  { brand: "Makita", model: "DF331D", category: "vidalama" },
  { brand: "DeWalt", model: "DCD771C2", category: "vidalama" },
  { brand: "Bosch", model: "GSR 18V-50", category: "vidalama" },
  { brand: "Makita", model: "DDF453", category: "vidalama" },
  { brand: "Milwaukee", model: "M12 BDD", category: "vidalama" },
  { brand: "Metabo", model: "PowerMaxx BS 12", category: "vidalama" },
  { brand: "Bosch", model: "GSR 18V-28", category: "vidalama" },
  { brand: "Black+Decker", model: "BCD003C2", category: "vidalama" },
  { brand: "DeWalt", model: "DCD778", category: "vidalama" },

  { brand: "Bosch", model: "GBH 2-28 F", category: "hilti" },
  { brand: "Bosch", model: "GBH 2-26 DRE", category: "hilti" },
  { brand: "Makita", model: "HR2470", category: "hilti" },
  { brand: "DeWalt", model: "D25133K", category: "hilti" },
  { brand: "Makita", model: "HR2630", category: "hilti" },
  { brand: "Bosch", model: "GBH 4-32 DFR", category: "hilti" },
  { brand: "Milwaukee", model: "M18 CHX", category: "hilti" },
  { brand: "Metabo", model: "KHE 2660", category: "hilti" },
  { brand: "DeWalt", model: "DCH273N", category: "hilti" },
  { brand: "Bosch", model: "GBH 5-40 DCE", category: "hilti" },

  { brand: "Milwaukee", model: "M18 FHIWF12", category: "darbe-somun-sikma" },
  { brand: "Makita", model: "DTW285Z", category: "darbe-somun-sikma" },
  { brand: "DeWalt", model: "DCF894N", category: "darbe-somun-sikma" },
  { brand: "Bosch", model: "GDS 18V-1050 H", category: "darbe-somun-sikma" },
  { brand: "Milwaukee", model: "M18 FMTIW2F12", category: "darbe-somun-sikma" },

  // ══════════════════════════════════════
  // KESME & TESTERE
  // ══════════════════════════════════════
  { brand: "Bosch", model: "GKS 190", category: "daire-testere" },
  { brand: "Makita", model: "HS7601", category: "daire-testere" },
  { brand: "DeWalt", model: "DWE560", category: "daire-testere" },
  { brand: "Bosch", model: "GKS 65 GCE", category: "daire-testere" },
  { brand: "Makita", model: "DHS680Z", category: "daire-testere" },
  { brand: "Milwaukee", model: "M18 CCS55", category: "daire-testere" },
  { brand: "Metabo", model: "KS 55 FS", category: "daire-testere" },
  { brand: "DeWalt", model: "DCS570N", category: "daire-testere" },

  { brand: "Bosch", model: "GST 150 CE", category: "dekupaj" },
  { brand: "Makita", model: "4329", category: "dekupaj" },
  { brand: "DeWalt", model: "DW331K", category: "dekupaj" },
  { brand: "Bosch", model: "GST 700", category: "dekupaj" },
  { brand: "Makita", model: "JV0600K", category: "dekupaj" },
  { brand: "Metabo", model: "STEB 65 Quick", category: "dekupaj" },
  { brand: "Milwaukee", model: "M18 FJS", category: "dekupaj" },

  { brand: "Bosch", model: "GSA 1100 E", category: "tilki-kuyrugu" },
  { brand: "Makita", model: "JR3050T", category: "tilki-kuyrugu" },
  { brand: "DeWalt", model: "DWE305PK", category: "tilki-kuyrugu" },
  { brand: "Milwaukee", model: "M18 FSZ", category: "tilki-kuyrugu" },
  { brand: "Bosch", model: "GSA 1300 PCE", category: "tilki-kuyrugu" },
  { brand: "Makita", model: "DJR186Z", category: "tilki-kuyrugu" },

  { brand: "Stihl", model: "MS 170", category: "zincirli-testere" },
  { brand: "Husqvarna", model: "135 Mark II", category: "zincirli-testere" },
  { brand: "Stihl", model: "MS 180", category: "zincirli-testere" },
  { brand: "Makita", model: "DUC353Z", category: "zincirli-testere" },
  { brand: "Husqvarna", model: "445", category: "zincirli-testere" },
  { brand: "Stihl", model: "MSA 120 C-B", category: "zincirli-testere" },
  { brand: "Makita", model: "EA3201S40B", category: "zincirli-testere" },
  { brand: "Bosch", model: "UniversalChain 35", category: "zincirli-testere" },

  { brand: "Bosch", model: "GCM 8 SJL", category: "gonyeli-kesme" },
  { brand: "Makita", model: "LS1018L", category: "gonyeli-kesme" },
  { brand: "DeWalt", model: "DWS780", category: "gonyeli-kesme" },
  { brand: "Metabo", model: "KGS 254 M", category: "gonyeli-kesme" },
  { brand: "Milwaukee", model: "M18 FMS254", category: "gonyeli-kesme" },

  { brand: "Bosch", model: "GDC 140", category: "mermer-kesme" },
  { brand: "Makita", model: "4100KB", category: "mermer-kesme" },
  { brand: "DeWalt", model: "D24000", category: "mermer-kesme" },
  { brand: "Rubi", model: "DU-200 EVO", category: "mermer-kesme" },

  { brand: "Bosch", model: "GNF 35 CA", category: "kanal-acma" },
  { brand: "Makita", model: "SG1251J", category: "kanal-acma" },
  { brand: "Milwaukee", model: "WCE 30", category: "kanal-acma" },

  // ══════════════════════════════════════
  // TAŞLAMA & ZIMPARALAMA
  // ══════════════════════════════════════
  { brand: "Bosch", model: "GWS 750-115", category: "avuc-taslama" },
  { brand: "Makita", model: "GA5030", category: "avuc-taslama" },
  { brand: "DeWalt", model: "DWE4057", category: "avuc-taslama" },
  { brand: "Bosch", model: "GWS 750-125", category: "avuc-taslama" },
  { brand: "Makita", model: "GA4530", category: "avuc-taslama" },
  { brand: "Metabo", model: "W 750-125", category: "avuc-taslama" },
  { brand: "Milwaukee", model: "M18 CAG125X", category: "avuc-taslama" },
  { brand: "DeWalt", model: "DWE4233", category: "avuc-taslama" },

  { brand: "Bosch", model: "GEX 125-1 AE", category: "eksantrik-zimpara" },
  { brand: "Makita", model: "BO5031", category: "eksantrik-zimpara" },
  { brand: "DeWalt", model: "DWE6423", category: "eksantrik-zimpara" },
  { brand: "Metabo", model: "SXE 3125", category: "eksantrik-zimpara" },
  { brand: "Bosch", model: "GEX 34-150", category: "eksantrik-zimpara" },
  { brand: "Festool", model: "ETS 125 REQ", category: "eksantrik-zimpara" },

  // ══════════════════════════════════════
  // FREZE & PLANYA
  // ══════════════════════════════════════
  { brand: "Bosch", model: "GOF 130", category: "freze-makinesi" },
  { brand: "Makita", model: "RT0700C", category: "freze-makinesi" },
  { brand: "DeWalt", model: "DWE6005", category: "freze-makinesi" },
  { brand: "Bosch", model: "GKF 550", category: "freze-makinesi" },
  { brand: "Makita", model: "RP0900", category: "freze-makinesi" },

  { brand: "Bosch", model: "GHO 26-82 D", category: "el-planyasi" },
  { brand: "Makita", model: "KP0800", category: "el-planyasi" },
  { brand: "DeWalt", model: "DW680", category: "el-planyasi" },
  { brand: "Bosch", model: "GHO 40-82 C", category: "el-planyasi" },

  // ══════════════════════════════════════
  // KAYNAK
  // ══════════════════════════════════════
  { brand: "Askaynak", model: "Inverter 185 Super", category: "inverter-kaynak" },
  { brand: "Lincoln Electric", model: "Invertec 170S", category: "inverter-kaynak" },
  { brand: "Kemppi", model: "Minarc 150", category: "inverter-kaynak" },
  { brand: "Askaynak", model: "Inverter 205 Ultra", category: "inverter-kaynak" },
  { brand: "Magmaweld", model: "Monostick 200i", category: "inverter-kaynak" },
  { brand: "Fronius", model: "TransPocket 180", category: "inverter-kaynak" },

  { brand: "Askaynak", model: "MIG 250", category: "gazalti-kaynak" },
  { brand: "Lincoln Electric", model: "Speedtec 200C", category: "gazalti-kaynak" },
  { brand: "Kemppi", model: "MinarcMig 200", category: "gazalti-kaynak" },
  { brand: "Magmaweld", model: "MIG 205", category: "gazalti-kaynak" },
  { brand: "Fronius", model: "TransSteel 2200", category: "gazalti-kaynak" },

  { brand: "3M", model: "Speedglas 9100", category: "kaynak-maskesi" },
  { brand: "Lincoln Electric", model: "Viking 3350", category: "kaynak-maskesi" },
  { brand: "Optrel", model: "panoramaxx CLT", category: "kaynak-maskesi" },
  { brand: "ESAB", model: "Sentinel A50", category: "kaynak-maskesi" },

  // ══════════════════════════════════════
  // KOMPRESÖR & BASINÇLI YIKAMA
  // ══════════════════════════════════════
  { brand: "Fiac", model: "Cosmos 225", category: "kompresor" },
  { brand: "Abac", model: "Montecarlo 241", category: "kompresor" },
  { brand: "Michelin", model: "MBV 50-3", category: "kompresor" },
  { brand: "Stanley", model: "Fatmax D 211/8/50S", category: "kompresor" },
  { brand: "Einhell", model: "TC-AC 190/24/8", category: "kompresor" },

  { brand: "Kärcher", model: "K3 Full Control", category: "basincli-yikama" },
  { brand: "Kärcher", model: "K5 Premium", category: "basincli-yikama" },
  { brand: "Bosch", model: "UniversalAquatak 130", category: "basincli-yikama" },
  { brand: "Bosch", model: "AdvancedAquatak 150", category: "basincli-yikama" },
  { brand: "Makita", model: "HW1200", category: "basincli-yikama" },
  { brand: "Einhell", model: "TC-HP 130", category: "basincli-yikama" },
  { brand: "Kärcher", model: "K2 Power Control", category: "basincli-yikama" },
  { brand: "Nilfisk", model: "Core 130-6", category: "basincli-yikama" },

  // ══════════════════════════════════════
  // JENERATÖR & ENERJİ
  // ══════════════════════════════════════
  { brand: "Honda", model: "EU22i", category: "jenerator" },
  { brand: "Yamaha", model: "EF2200iS", category: "jenerator" },
  { brand: "Honda", model: "EG3600CX", category: "jenerator" },
  { brand: "Genpower", model: "GBG 5500E", category: "jenerator" },
  { brand: "Einhell", model: "TC-PG 35/E5", category: "jenerator" },

  { brand: "APC", model: "Back-UPS 1400VA", category: "ups" },
  { brand: "Eaton", model: "5E 1200i USB", category: "ups" },
  { brand: "APC", model: "Smart-UPS 750VA", category: "ups" },
  { brand: "CyberPower", model: "VP1600ELCD", category: "ups" },
  { brand: "Legrand", model: "Keor SP 1500VA", category: "ups" },

  // ══════════════════════════════════════
  // POMPA & SU
  // ══════════════════════════════════════
  { brand: "Pedrollo", model: "TOP 2", category: "dalgic-pompa" },
  { brand: "Grundfos", model: "SQ 2-55", category: "dalgic-pompa" },
  { brand: "DAB", model: "Divertron 1200", category: "dalgic-pompa" },
  { brand: "Wilo", model: "Sub TWU 4", category: "dalgic-pompa" },
  { brand: "Pedrollo", model: "4SR 2/13", category: "dalgic-pompa" },

  { brand: "Grundfos", model: "Scala1 5-55", category: "hidrafor" },
  { brand: "DAB", model: "E.sybox", category: "hidrafor" },
  { brand: "Wilo", model: "HiMulti 3", category: "hidrafor" },
  { brand: "Pedrollo", model: "Easypress II", category: "hidrafor" },

  // ══════════════════════════════════════
  // ISITMA & SOĞUTMA
  // ══════════════════════════════════════
  { brand: "Vaillant", model: "ecoTEC plus VUW 346/5-5", category: "kombi" },
  { brand: "Baymak", model: "Eco Four 24", category: "kombi" },
  { brand: "Demirdöküm", model: "Atron 24", category: "kombi" },
  { brand: "Bosch", model: "Condens 2500W", category: "kombi" },
  { brand: "Viessman", model: "Vitodens 050-W", category: "kombi" },
  { brand: "Buderus", model: "Logamax Plus GB062", category: "kombi" },

  { brand: "Daikin", model: "FTXF35A", category: "klima" },
  { brand: "Mitsubishi Electric", model: "MSZ-AP35VGK", category: "klima" },
  { brand: "Samsung", model: "AR35 AR12TXHQBWK", category: "klima" },
  { brand: "LG", model: "Dualcool S3-W12JA3AA", category: "klima" },
  { brand: "Toshiba", model: "Seiya RAS-13J2KVG", category: "klima" },
  { brand: "Vestel", model: "Bio+ 12000 BTU", category: "klima" },

  // ══════════════════════════════════════
  // ÖLÇÜM ALETLERİ
  // ══════════════════════════════════════
  { brand: "Bosch", model: "GLM 50 C", category: "lazer-metre" },
  { brand: "Bosch", model: "GLM 30-23", category: "lazer-metre" },
  { brand: "Leica", model: "DISTO D2", category: "lazer-metre" },
  { brand: "Makita", model: "LD050P", category: "lazer-metre" },
  { brand: "DeWalt", model: "DW033", category: "lazer-metre" },
  { brand: "Stanley", model: "TLM99", category: "lazer-metre" },

  { brand: "Bosch", model: "GLL 2-15 G", category: "lazer-terazisi" },
  { brand: "Bosch", model: "GCL 2-50 CG", category: "lazer-terazisi" },
  { brand: "DeWalt", model: "DCE089D1G", category: "lazer-terazisi" },
  { brand: "Makita", model: "SK105GDZ", category: "lazer-terazisi" },
  { brand: "Huepar", model: "902CG", category: "lazer-terazisi" },

  { brand: "Fluke", model: "115", category: "multimetre" },
  { brand: "Fluke", model: "179", category: "multimetre" },
  { brand: "UNI-T", model: "UT61E", category: "multimetre" },
  { brand: "Brymen", model: "BM235", category: "multimetre" },
  { brand: "Klein Tools", model: "MM700", category: "multimetre" },

  { brand: "Fluke", model: "376 FC", category: "pensampermetre" },
  { brand: "UNI-T", model: "UT210E", category: "pensampermetre" },
  { brand: "Fluke", model: "325", category: "pensampermetre" },
  { brand: "Hioki", model: "CM4375", category: "pensampermetre" },

  { brand: "Flir", model: "C5", category: "termal-kamera" },
  { brand: "Flir", model: "E8 Pro", category: "termal-kamera" },
  { brand: "Bosch", model: "GTC 400 C", category: "termal-kamera" },
  { brand: "UNI-T", model: "UTi260B", category: "termal-kamera" },

  { brand: "Bosch", model: "GMS 120", category: "kablo-bulucu" },
  { brand: "Bosch", model: "D-tect 150 SV", category: "kablo-bulucu" },
  { brand: "Stanley", model: "FatMax S300", category: "kablo-bulucu" },

  { brand: "Mitutoyo", model: "500-196-30", category: "kumpas" },
  { brand: "Mitutoyo", model: "500-181-30", category: "kumpas" },
  { brand: "Insize", model: "1108-200", category: "kumpas" },
  { brand: "Helios-Preisser", model: "1226 522", category: "kumpas" },

  // ══════════════════════════════════════
  // EL ALETLERİ
  // ══════════════════════════════════════
  { brand: "Wera", model: "Kraftform Plus 334/6", category: "tornavida-seti" },
  { brand: "Wiha", model: "SoftFinish 3251 K12", category: "tornavida-seti" },
  { brand: "PB Swiss Tools", model: "8242 RB", category: "tornavida-seti" },
  { brand: "Stanley", model: "STHT0-70885", category: "tornavida-seti" },
  { brand: "Wera", model: "Kraftform Kompakt 25", category: "tornavida-seti" },

  { brand: "Knipex", model: "Cobra 87 01 250", category: "pense-seti" },
  { brand: "Knipex", model: "Pliers Wrench 86 05 250", category: "pense-seti" },
  { brand: "NWS", model: "CombiMax 109-69-180", category: "pense-seti" },
  { brand: "Knipex", model: "Electronics Set 00 20 16", category: "pense-seti" },

  { brand: "Wera", model: "8100 SA Zyklop Speed", category: "anahtar-seti" },
  { brand: "Gedore", model: "Red R69003016", category: "anahtar-seti" },
  { brand: "Stahlwille", model: "14/12 KT", category: "anahtar-seti" },
  { brand: "Stanley", model: "STMT82842-0", category: "anahtar-seti" },
  { brand: "Facom", model: "440.JE16", category: "anahtar-seti" },

  { brand: "Wera", model: "8100 SC 2", category: "lokma-takimi" },
  { brand: "Gedore", model: "Red R49003016", category: "lokma-takimi" },
  { brand: "Stanley", model: "STMT71650 201 Parça", category: "lokma-takimi" },
  { brand: "King Tony", model: "9-7553MR 153 Parça", category: "lokma-takimi" },
  { brand: "Facom", model: "S.360DAPS1", category: "lokma-takimi" },

  { brand: "Wera", model: "L-Key 950/9 Hex-Plus", category: "allen-anahtar" },
  { brand: "Wiha", model: "369 T9-T40", category: "allen-anahtar" },
  { brand: "PB Swiss Tools", model: "212 LH-10", category: "allen-anahtar" },
  { brand: "Bondhus", model: "12199 BriteGuard", category: "allen-anahtar" },

  { brand: "Norbar", model: "TTi50", category: "tork-anahtari" },
  { brand: "Hazet", model: "5122-3CT", category: "tork-anahtari" },
  { brand: "Stahlwille", model: "730/10", category: "tork-anahtari" },
  { brand: "Gedore", model: "Dremaster K 40-200 Nm", category: "tork-anahtari" },

  { brand: "Stanley", model: "STST1-80151 Set 142 Parça", category: "takim-cantasi" },
  { brand: "Bosch", model: "Professional 108 Parça", category: "takim-cantasi" },
  { brand: "Makita", model: "P-90532 227 Parça", category: "takim-cantasi" },
  { brand: "DeWalt", model: "DWMT73803 168 Parça", category: "takim-cantasi" },

  // ══════════════════════════════════════
  // BAHÇE
  // ══════════════════════════════════════
  { brand: "Stihl", model: "FS 55", category: "motorlu-tirpan" },
  { brand: "Husqvarna", model: "128R", category: "motorlu-tirpan" },
  { brand: "Stihl", model: "FS 131", category: "motorlu-tirpan" },
  { brand: "Makita", model: "DUR181Z", category: "motorlu-tirpan" },
  { brand: "Husqvarna", model: "535iRX", category: "motorlu-tirpan" },
  { brand: "Einhell", model: "GE-BC 43 AS", category: "motorlu-tirpan" },

  { brand: "Bosch", model: "Rotak 37 LI", category: "cim-bicme" },
  { brand: "Einhell", model: "GC-EM 1032", category: "cim-bicme" },
  { brand: "Husqvarna", model: "LC 141Li", category: "cim-bicme" },
  { brand: "Makita", model: "DLM431Z", category: "cim-bicme" },
  { brand: "Stihl", model: "RMA 339", category: "cim-bicme" },
  { brand: "Honda", model: "HRG 466 SK", category: "cim-bicme" },

  { brand: "Stihl", model: "GTA 26", category: "budama-makasi" },
  { brand: "Felco", model: "2", category: "budama-makasi" },
  { brand: "Fiskars", model: "PowerGear X L PX94", category: "budama-makasi" },
  { brand: "Gardena", model: "ExpertCut Li", category: "budama-makasi" },
  { brand: "Bosch", model: "EasyPrune", category: "budama-makasi" },

  { brand: "Stihl", model: "BGA 57", category: "yaprak-ufleyici" },
  { brand: "Husqvarna", model: "525iB", category: "yaprak-ufleyici" },
  { brand: "Makita", model: "DUB185Z", category: "yaprak-ufleyici" },
  { brand: "Bosch", model: "UniversalGardenTidy", category: "yaprak-ufleyici" },

  { brand: "Stihl", model: "HSA 56", category: "bahce-makasi" },
  { brand: "Husqvarna", model: "115iHD45", category: "bahce-makasi" },
  { brand: "Bosch", model: "AHS 50-20 LI", category: "bahce-makasi" },
  { brand: "Makita", model: "DUH523Z", category: "bahce-makasi" },

  // ══════════════════════════════════════
  // ISI & YAPIŞTIRMA
  // ══════════════════════════════════════
  { brand: "Bosch", model: "GHG 20-63", category: "sicak-hava-tabancasi" },
  { brand: "Makita", model: "HG5030K", category: "sicak-hava-tabancasi" },
  { brand: "DeWalt", model: "D26414", category: "sicak-hava-tabancasi" },
  { brand: "Steinel", model: "HL 2020 E", category: "sicak-hava-tabancasi" },

  // ══════════════════════════════════════
  // TESİSAT
  // ══════════════════════════════════════
  { brand: "Rothenberger", model: "Minicut 2000", category: "boru-kesici" },
  { brand: "Ridgid", model: "101", category: "boru-kesici" },
  { brand: "Rothenberger", model: "TC 35", category: "boru-kesici" },
  { brand: "Knipex", model: "TubiX 90 31 02", category: "boru-kesici" },

  { brand: "LG", model: "WD-1485TP", category: "su-aritma" },
  { brand: "AquaTürk", model: "Safir Premium", category: "su-aritma" },
  { brand: "Conax", model: "Premium Pro", category: "su-aritma" },
  { brand: "Livs", model: "Smart Pure", category: "su-aritma" },

  // ══════════════════════════════════════
  // İŞ GÜVENLİĞİ
  // ══════════════════════════════════════
  { brand: "3M", model: "Peltor X4A", category: "kulak-koruyucu" },
  { brand: "Honeywell", model: "Howard Leight Sync", category: "kulak-koruyucu" },
  { brand: "3M", model: "Peltor X5A", category: "kulak-koruyucu" },
  { brand: "Uvex", model: "K4", category: "kulak-koruyucu" },

  { brand: "Uvex", model: "i-3 9164", category: "koruyucu-gozluk" },
  { brand: "3M", model: "SecureFit 400", category: "koruyucu-gozluk" },
  { brand: "Bolle Safety", model: "Rush+", category: "koruyucu-gozluk" },
  { brand: "Uvex", model: "Pheos CX2", category: "koruyucu-gozluk" },

  { brand: "Caterpillar", model: "Holton S3", category: "is-ayakkabisi" },
  { brand: "Beta", model: "7350RP", category: "is-ayakkabisi" },
  { brand: "U-Power", model: "Redlion Going S1P", category: "is-ayakkabisi" },
  { brand: "Uvex", model: "1 x-tended support", category: "is-ayakkabisi" },
  { brand: "Puma Safety", model: "Velocity 2.0", category: "is-ayakkabisi" },

  { brand: "3M", model: "6200 + 6003 Set", category: "toz-maskesi" },
  { brand: "Moldex", model: "9000 Series", category: "toz-maskesi" },
  { brand: "GVS", model: "Elipse P3", category: "toz-maskesi" },
  { brand: "Dräger", model: "X-plore 3300", category: "toz-maskesi" },

  // ══════════════════════════════════════
  // YAPI KİMYASALLARI
  // ══════════════════════════════════════
  { brand: "Henkel", model: "Pattex PL600", category: "yapistirici" },
  { brand: "Soudal", model: "T-Rex Power Fast", category: "yapistirici" },
  { brand: "Bison", model: "Montaj Yapıştırıcısı", category: "yapistirici" },
  { brand: "Henkel", model: "Loctite PL Premium", category: "yapistirici" },

  { brand: "Soudal", model: "Genius Gun Silikon", category: "silikon" },
  { brand: "Henkel", model: "Pattex SL620", category: "silikon" },
  { brand: "Bison", model: "Silicone Universal", category: "silikon" },
  { brand: "Akfix", model: "100E Premium", category: "silikon" },

  { brand: "Soudal", model: "Genius Gun Foam", category: "montaj-kopugu" },
  { brand: "Henkel", model: "Ceresit TS 52", category: "montaj-kopugu" },
  { brand: "Akfix", model: "805P PRO", category: "montaj-kopugu" },
  { brand: "Bison", model: "PU Foam", category: "montaj-kopugu" },

  { brand: "Weber", model: "Tec Su Yalıtım", category: "su-yalitim" },
  { brand: "Sika", model: "Sikalastic 1K", category: "su-yalitim" },
  { brand: "Baumit", model: "Baumacol Proof", category: "su-yalitim" },
  { brand: "Henkel", model: "Ceresit CR 166", category: "su-yalitim" },

  // ══════════════════════════════════════
  // GÜVENLİK & KAMERA
  // ══════════════════════════════════════
  { brand: "Hikvision", model: "DS-2CD2143G2-I", category: "guvenlik-kamerasi" },
  { brand: "Dahua", model: "IPC-HFW2431S-S-S2", category: "guvenlik-kamerasi" },
  { brand: "Reolink", model: "RLC-810A", category: "guvenlik-kamerasi" },
  { brand: "TP-Link", model: "VIGI C340", category: "guvenlik-kamerasi" },
  { brand: "Uniview", model: "IPC2124LR3", category: "guvenlik-kamerasi" },

  { brand: "Yale", model: "Linus L2", category: "akilli-kilit" },
  { brand: "Aqara", model: "U100", category: "akilli-kilit" },
  { brand: "Nuki", model: "Smart Lock 4.0", category: "akilli-kilit" },
  { brand: "Samsung", model: "SHP-DP609", category: "akilli-kilit" },

  // ══════════════════════════════════════
  // TEMİZLİK
  // ══════════════════════════════════════
  { brand: "Kärcher", model: "WD 5", category: "endustriyel-supurge" },
  { brand: "Kärcher", model: "WD 3", category: "endustriyel-supurge" },
  { brand: "Bosch", model: "GAS 35 L SFC+", category: "endustriyel-supurge" },
  { brand: "Makita", model: "VC2012L", category: "endustriyel-supurge" },
  { brand: "Festool", model: "CTL 26 E", category: "endustriyel-supurge" },
  { brand: "Milwaukee", model: "M18 VC2", category: "endustriyel-supurge" },

  // ══════════════════════════════════════
  // HAVYA & 3D PRINTER
  // ══════════════════════════════════════
  { brand: "Weller", model: "WE 1010", category: "havya-istasyonu" },
  { brand: "Hakko", model: "FX-888D", category: "havya-istasyonu" },
  { brand: "JBC", model: "CD-2BE", category: "havya-istasyonu" },
  { brand: "Ersa", model: "i-CON PICO", category: "havya-istasyonu" },

  { brand: "Bambu Lab", model: "P1S", category: "3d-printer" },
  { brand: "Creality", model: "Ender-3 V3 SE", category: "3d-printer" },
  { brand: "Bambu Lab", model: "A1 Mini", category: "3d-printer" },
  { brand: "Prusa", model: "MK4S", category: "3d-printer" },
  { brand: "Creality", model: "K1", category: "3d-printer" },

  { brand: "xTool", model: "D1 Pro", category: "lazer-kaziyici" },
  { brand: "Ortur", model: "Laser Master 3", category: "lazer-kaziyici" },
  { brand: "Atomstack", model: "A5 M50 Pro", category: "lazer-kaziyici" },
  { brand: "xTool", model: "S1 40W", category: "lazer-kaziyici" },

  // ══════════════════════════════════════
  // MERDİVEN
  // ══════════════════════════════════════
  { brand: "Zarges", model: "Z200 3x8", category: "merdiven" },
  { brand: "Hailo", model: "ProfiStep 3x12", category: "merdiven" },
  { brand: "Zarges", model: "Z300 3x10", category: "merdiven" },
  { brand: "Elbe", model: "Alüminyum 3x7", category: "merdiven" },

  // ══════════════════════════════════════
  // KALDIRMA & TAŞIMA
  // ══════════════════════════════════════
  { brand: "Yale", model: "VSIII 2T", category: "caraskal" },
  { brand: "Kito", model: "CB010", category: "caraskal" },
  { brand: "Toyo", model: "1 Ton", category: "caraskal" },

  // ══════════════════════════════════════
  // AYDINLATMA
  // ══════════════════════════════════════
  { brand: "Ledlenser", model: "H7R Core", category: "kafa-lambasi" },
  { brand: "Petzl", model: "Actik Core", category: "kafa-lambasi" },
  { brand: "Fenix", model: "HM65R-DT", category: "kafa-lambasi" },
  { brand: "Nitecore", model: "NU25 UL", category: "kafa-lambasi" },

  { brand: "Brennenstuhl", model: "JARO 7060", category: "santi-projektoru" },
  { brand: "Philips", model: "BVP150 50W", category: "santi-projektoru" },
  { brand: "Osram", model: "Ledvance 50W", category: "santi-projektoru" },
  { brand: "Milwaukee", model: "M18 HOSFL", category: "santi-projektoru" },

  // ══════════════════════════════════════
  // BOYA & KAPLAMA
  // ══════════════════════════════════════
  { brand: "Graco", model: "Magnum X5", category: "airless-boya" },
  { brand: "Wagner", model: "Control Pro 250M", category: "airless-boya" },
  { brand: "Graco", model: "Magnum X7", category: "airless-boya" },
  { brand: "Titan", model: "ControlMax 1700", category: "airless-boya" },

  // ══════════════════════════════════════
  // HAVALANDIRMA
  // ══════════════════════════════════════
  { brand: "Franke", model: "Smart Flat 60", category: "aspirator" },
  { brand: "Bosch", model: "DWB96DM50", category: "aspirator" },
  { brand: "Faber", model: "Inca Smart C LG A52", category: "aspirator" },
  { brand: "Silverline", model: "3420 Slim Line 60", category: "aspirator" },

  // ══════════════════════════════════════
  // ZİMBA & PERÇİN
  // ══════════════════════════════════════
  { brand: "DeWalt", model: "DCN692N", category: "zimba-tabancasi" },
  { brand: "Makita", model: "AF506", category: "zimba-tabancasi" },
  { brand: "Milwaukee", model: "M18 CN16GA", category: "zimba-tabancasi" },
  { brand: "Bosch", model: "GSK 18 V-LI", category: "zimba-tabancasi" },
];

export function generatePairs(products: SeedProduct[]): [SeedProduct, SeedProduct][] {
  const byCategory = new Map<string, SeedProduct[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const pairs: [SeedProduct, SeedProduct][] = [];
  for (const [, list] of byCategory) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        pairs.push([list[i], list[j]]);
      }
    }
  }
  return pairs;
}
