// ÖKOPROFIT KI-Dashboard — Benchmark-Datenbasis
// Quellen: EHI Retail Institute, dena, DEHOGA, Umweltbundesamt,
//          Energieinstitut der Wirtschaft, GEG 2024, Statistisches Bundesamt
// Stand: Mai 2026
//
// Dashboard-Scoring-Interpolationen: known-issues.md (Repo-Root)

const OEKOPROFIT_BENCHMARKS = {

  emissionFactors: {
    strom_de_mix_g_per_kwh: 380,
    erdgas_g_per_kwh: 201,
    heizoel_g_per_kwh: 266,
    fernwaerme_g_per_kwh: 280,
    ee_anteil_strommix_2024_pct: 54.4,
  },

  branchen: {

    gastronomie: {
      label: "Gastronomie (Restaurant/Café)",
      kennzahlen: {
        strom_kwh_per_m2: {
          einheit: "kWh/m²·a",
          p25: 180, median: 230, p75: 280,
          ziel_2030: 150,
          quelle: "DEHOGA 'Nachhaltiges Wirtschaften 2016'"
        },
        waerme_kwh_per_m2: {
          einheit: "kWh/m²·a (Heizung/Kühlung/Wärme, Gebäudebezug)",
          p25: 62, median: 92, p75: 132,
          quelle: "Interpolation Gastgewerbe nahe EHI-Einzelhandel-Wärme; siehe known-issues.md"
        },
        wasser_liter_per_ma_tag: {
          einheit: "l/MA·Tag",
          p25: 38, median: 72, p75: 118,
          quelle: "Proxy Gewerbe/Gastro (nicht gleichbedeutend mit l/Gedeck); siehe known-issues.md"
        },
        abfall_kg_per_ma: {
          einheit: "kg/Mitarbeiter·a",
          p25: 95, median: 185, p75: 310,
          quelle: "Schätzung Speisenreste/Verpackung Gastronomie; siehe known-issues.md"
        },
        wasser_liter_per_gedeck: {
          einheit: "l/Gedeck",
          p25: 30, median: 55, p75: 80,
          ziel_2030: 25,
          quelle: "DEHOGA 2014"
        },
        wasser_liter_per_gericht_grosskueche: {
          einheit: "l/Gericht (Großküche)",
          p25: 1.5, median: 2.9, p75: 4.0,
          quelle: "RATIONAL / HS Weihenstephan-Triesdorf"
        },
        energiekosten_anteil_umsatz_pct: {
          einheit: "% des Umsatzes",
          p25: 4, median: 6, p75: 10,
          quelle: "DEHOGA / g-wie-gastro.de"
        },
        lebensmittelabfall_g_per_speise: {
          einheit: "g/Speise",
          p25: 50, median: 100, p75: 200,
          quelle: "Berlin-Senat Modellprojekt Speisereste"
        },
        ee_anteil_strom_pct: {
          einheit: "% Erneuerbarer Strom",
          p25: 80, median: 54.4, p75: 30,
          invertiert: true,
          quelle: "Statistisches Bundesamt 03/2025"
        },
        recyclingquote_pct: {
          einheit: "% Recyclingquote (Gewerbeabfall)",
          p25: 70, median: 55, p75: 40,
          invertiert: true,
          quelle: "Universalwert: DE-Recyclingziel 2022 (70 %); branchenspezifische Quartile noch nicht verfügbar — siehe known-issues.md"
        }
      },
      hauptverbraucher: [
        "Kältetechnik (Kühl-/Gefriergeräte)",
        "Beleuchtung",
        "Spülmaschinen",
        "Kombidämpfer",
        "Lüftung"
      ],
      quick_wins: [
        { massnahme: "Spülmaschinen-Austausch", invest_eur: 5000, einsparung_pct: 40, bereich: "wasser+energie", amort_jahre: 3 },
        { massnahme: "Kühlraum-Türschleier", invest_eur: 400, einsparung_eur_pa: 180, amort_jahre: 2.2 },
        { massnahme: "Heizung 1°C absenken", invest_eur: 0, einsparung_pct: 6, bereich: "heizung" },
        { massnahme: "LED-Umrüstung", invest_eur: 3000, einsparung_pct: 50, bereich: "beleuchtung", amort_jahre: 2 },
        { massnahme: "Minibar-Abschaltung (Hotel)", invest_eur: 0, einsparung_kwh_pa: 16500, einsparung_eur_pa: 3300, co2_t_pa: 9.3 },
        { massnahme: "Wassersparende Perlatoren", invest_eur: 50, einsparung_wasser_pct: 40, amort_jahre: 0.5 }
      ]
    },

    buero: {
      label: "Büro / Verwaltung",
      kennzahlen: {
        endenergie_kwh_per_m2: {
          einheit: "kWh/m²·a (Endenergie gesamt)",
          p25: 100, median: 133, p75: 200,
          geg_neubau_ziel: 90,
          quelle: "dena-Studie 2017; IW Köln (310.800 Bürogebäude, 456 Mio. m²)"
        },
        heizwaerme_kwh_per_m2: {
          einheit: "kWh/m²·a (Heizung)",
          p25: 75, median: 110, p75: 150,
          quelle: "Energieinstitut der Wirtschaft (KMU-Scheck)"
        },
        strom_kwh_per_m2: {
          einheit: "kWh/m²·a (Strom)",
          p25: 37, median: 65, p75: 101,
          quelle: "Energieinstitut der Wirtschaft (Quartile: P25=37, Median=65, P75=101)"
        },
        strom_kwh_per_ma: {
          einheit: "kWh/Mitarbeiter·a",
          p25: 6000, median: 7500, p75: 9000,
          quelle: "ÖGUT 'Kennzahlen Energieverbrauch Dienstleistungsgebäude'"
        },
        wasser_liter_per_ma_tag: {
          einheit: "l/MA·Tag",
          p25: 15, median: 22, p75: 35,
          quelle: "BNB Steckbrief 'Trinkwasserbedarf Bürogebäude' (20–25 l/MA·Tag)"
        },
        co2_kg_per_m2: {
          einheit: "kg CO₂/m²·a (Scope 1+2)",
          p25: 15, median: 35, p75: 60,
          quelle: "Abgeleitet aus 133 kWh/m² × 380g/kWh (UBA Strommix 2023) + Heizung"
        },
        abfall_kg_per_ma: {
          einheit: "kg Restmüll/Mitarbeiter·a",
          p25: 30, median: 60, p75: 100,
          quelle: "Manutan; Statistisches Bundesamt"
        },
        beleuchtung_kwh_per_m2: {
          einheit: "kWh/m²·a (LENI Beleuchtung)",
          p25: 12, median: 20, p75: 32,
          geg_neubau_ziel: 20,
          quelle: "ÖNORM H 5059 / BMVBS"
        },
        recyclingquote_pct: {
          einheit: "% Recyclingquote (Gewerbeabfall)",
          p25: 70, median: 55, p75: 40,
          invertiert: true,
          quelle: "Universalwert: DE-Recyclingziel 2022 (70 %); branchenspezifische Quartile noch nicht verfügbar — siehe known-issues.md"
        }
      },
      strom_aufteilung_pct: {
        heizung: 55, buerogeraete: 16, klima_kuehlung: 10, beleuchtung: 8, sonstiges: 11,
        quelle: "Energieinstitut der Wirtschaft KMU-Scheck"
      },
      quick_wins: [
        { massnahme: "LED-Bürobeleuchtung", invest_eur: 3000, bereich: "beleuchtung", amort_jahre: 2 },
        { massnahme: "Standby-Reduktion PC/Drucker", invest_eur: 300, einsparung_pct: 3, bereich: "strom" },
        { massnahme: "Servervirtualisierung", invest_eur: 5000, einsparung_pct: 40, bereich: "it_strom", amort_jahre: 3 },
        { massnahme: "Thermostatventile Heizung", invest_eur: 2000, einsparung_kwh_pa: 350000, einsparung_eur_pa: 10000, quelle: "BayWa AG München ÖKOPROFIT" },
        { massnahme: "LED Außenwerbung/Parkplatz", invest_eur: 2500, einsparung_eur_pa: 900, co2_t_pa: 5.38, amort_jahre: 3, quelle: "Sparkasse Hilden, ÖKOPROFIT best-practice-DB" }
      ]
    },

    einzelhandel_food: {
      label: "Einzelhandel (Lebensmittel)",
      kennzahlen: {
        strom_kwh_per_m2: {
          einheit: "kWh/m²·a Verkaufsfläche",
          p25: 230, median: 289, p75: 350,
          quelle: "EHI 'Energiemanagement im Einzelhandel 2024/2025'"
        },
        waerme_kwh_per_m2: {
          einheit: "kWh/m²·a",
          p25: 60, median: 89, p75: 130,
          quelle: "EHI 2024"
        },
        wasser_liter_per_ma_tag: {
          einheit: "l/MA·Tag",
          p25: 11, median: 24, p75: 44,
          quelle: "Schätzung Einzelhandel Food (Hygiene, Kühlung); siehe known-issues.md"
        },
        abfall_kg_per_ma: {
          einheit: "kg/Mitarbeiter·a",
          p25: 42, median: 82, p75: 135,
          quelle: "Schätzung Verpackungs-/Bioabfall LEH; siehe known-issues.md"
        },
        kaeltetechnik_anteil_strom_pct: {
          einheit: "% des Stroms",
          wert: 51,
          quelle: "EHI 2024/2025"
        },
        recyclingquote_pct: {
          einheit: "% Recyclingquote (Gewerbeabfall)",
          p25: 70, median: 55, p75: 40,
          invertiert: true,
          quelle: "Universalwert: DE-Recyclingziel 2022 (70 %); branchenspezifische Quartile noch nicht verfügbar — siehe known-issues.md"
        }
      },
      strom_aufteilung_pct: {
        kaeltetechnik: 51, beleuchtung: 20, klima_lueftung: 11, sonstiges: 18,
        quelle: "EHI Retail Institute 2024"
      },
      quick_wins: [
        { massnahme: "Kältemittel-Umstellung (CO₂/NH₃)", invest_eur: 15000, einsparung_pct: 20, bereich: "kaelte", amort_jahre: 5 },
        { massnahme: "LED-Deckenbeleuchtung", invest_eur: 8000, einsparung_pct: 50, bereich: "beleuchtung", amort_jahre: 3 },
        { massnahme: "Nachtabdeckungen Kühlregale", invest_eur: 1500, einsparung_pct: 30, bereich: "kaelte", amort_jahre: 2 },
        { massnahme: "Lebensmittelrettung (Too Good To Go)", invest_eur: 0, bereich: "abfall" }
      ]
    },

    einzelhandel_nonfood: {
      label: "Einzelhandel (Nonfood: Textil, Drogerie, Baumarkt)",
      kennzahlen: {
        strom_kwh_per_m2: {
          einheit: "kWh/m²·a",
          p25: 50, median: 75, p75: 110,
          quelle: "EHI 2023/2024 (Nonfood Schnitt 71–75)"
        },
        waerme_kwh_per_m2: {
          einheit: "kWh/m²·a",
          p25: 45, median: 66, p75: 100,
          quelle: "EHI 2024"
        },
        wasser_liter_per_ma_tag: {
          einheit: "l/MA·Tag",
          p25: 7, median: 15, p75: 26,
          quelle: "Schätzung Einzelhandel Nonfood (Sanitär, gering Prozesswasser); siehe known-issues.md"
        },
        abfall_kg_per_ma: {
          einheit: "kg/Mitarbeiter·a",
          p25: 28, median: 58, p75: 95,
          quelle: "Schätzung Verpackungsabfall Nonfood; siehe known-issues.md"
        },
        recyclingquote_pct: {
          einheit: "% Recyclingquote (Gewerbeabfall)",
          p25: 70, median: 55, p75: 40,
          invertiert: true,
          quelle: "Universalwert: DE-Recyclingziel 2022 (70 %); branchenspezifische Quartile noch nicht verfügbar — siehe known-issues.md"
        }
      },
      strom_aufteilung_pct: {
        beleuchtung: 57, klima_lueftung: 29, sonstiges: 14,
        quelle: "EHI Retail Institute 2024"
      }
    },

    produktion: {
      label: "Produktion / Fertigung (KMU)",
      kennzahlen: {
        strom_kwh_per_m2: {
          einheit: "kWh/m²·a (Betrieb/Strom, stark branchenabhängig)",
          p25: 72, median: 145, p75: 275,
          quelle: "Breite KMU-Fertigungsspanne, Vereinfachung; siehe known-issues.md"
        },
        waerme_kwh_per_m2: {
          einheit: "kWh/m²·a (Heizung/Prozesswärme)",
          p25: 38, median: 115, p75: 245,
          quelle: "Schätzung variabler Verarbeitungsbetriebe; siehe known-issues.md"
        },
        wasser_liter_per_ma_tag: {
          einheit: "l/MA·Tag",
          p25: 42, median: 105, p75: 230,
          quelle: "Industrie-/Handwerk stark gestreut; siehe known-issues.md"
        },
        abfall_kg_per_ma: {
          einheit: "kg/Mitarbeiter·a",
          p25: 115, median: 275, p75: 560,
          quelle: "Schätzung Produktions-/Verpackungsabfälle KMU; siehe known-issues.md"
        },
        strom_kwh_per_ma_tischlerei: {
          einheit: "kWh/Mitarbeiter·a (Tischlerei/Schreinerei)",
          p25: 3000, median: 6000, p75: 9000,
          quelle: "Handwerksblatt / MIE-Daten"
        },
        strom_kwh_pa_baeckerei_filiale: {
          einheit: "kWh/Jahr (kleine Bäckerei-Filiale 50m²)",
          wert: 25000,
          quelle: "Wattline 2026"
        },
        gas_kwh_pa_baeckerei_filiale: {
          einheit: "kWh/Jahr Gas (kleine Bäckerei-Filiale)",
          wert: 125000,
          quelle: "Wattline 2026"
        },
        energiekosten_anteil_umsatz_baeckerei_pct: {
          einheit: "% Energiekosten am Umsatz",
          normal: 3, krise_2022: 15,
          quelle: "Hessischer Rundfunk / Energieinstitut Wien"
        },
        druckluft_anteil_strom_pct: {
          einheit: "% Druckluft am Gesamtstrom (Metallverarbeitung)",
          wert: 40,
          quelle: "Energieinstitut Wien"
        },
        recyclingquote_pct: {
          einheit: "% Recyclingquote (Gewerbeabfall)",
          p25: 70, median: 55, p75: 40,
          invertiert: true,
          quelle: "Universalwert: DE-Recyclingziel 2022 (70 %); branchenspezifische Quartile noch nicht verfügbar — siehe known-issues.md"
        }
      },
      quick_wins: [
        { massnahme: "Druckluft-Leckageortung", invest_eur: 800, einsparung_pct: 25, bereich: "druckluft", amort_jahre: 0.8 },
        { massnahme: "Hocheffizienzpumpen", invest_eur: 1200, einsparung_pct: 70, bereich: "pumpen", amort_jahre: 1.5 },
        { massnahme: "Blindstromkompensation", invest_eur: 1000, einsparung_eur_pa: 600, einsparung_kwh_pa: 6400, amort_jahre: 1.7, quelle: "Lebenshilfe Werkstatt München ÖKOPROFIT" },
        { massnahme: "Wärmerückgewinnung Backöfen", invest_eur: 5000, einsparung_pct: 20, bereich: "waerme", amort_jahre: 4 }
      ]
    }
  },

  zielwerte: {
    geg_2024: {
      neubau_primaerenergie_faktor: 0.55,
      ee_anteil_heizung_neubau_pct: 65,
      sanierung_reduktion_pct: 30,
      aussenwand_u_wert: 0.24,
      fenster_u_wert: 1.3,
    },
    eu_taxonomie: {
      gebaeude_top_15pct_besser_nzeb_pct: 10,
      schwellenwert_umsatz_pct: 10,
    },
    recyclingquote_de_2022_pct: 70,
    verwertungsquote_de_2022_pct: 82,
    strommix_ee_ziel_2030_pct: 80,
  },

  programmbilanzen: {
    muenchen_25_jahre: {
      betriebe: 500, energie_mio_kwh: 730, co2_t: 470000,
      wasser_m3: 4800000, kosten_mio_eur: 123,
      quelle: "oekoprofit.info / munich-business.eu"
    },
    muenchen_2023_24: {
      betriebe: 105, energie_mio_kwh: 7.2, co2_t: 1200,
      kosten_mio_eur: 2.1,
      durchschnitt_pro_betrieb: { kwh: 68571, co2_t: 11.4, eur: 20000 }
    },
    nrw_gesamt: {
      betriebe: 3000, energie_mio_kwh_pa: 545, co2_t_pa: 186000,
      wasser_m3_pa: 3100000, kosten_mio_eur_pa: 50,
      investition_mio_eur: 141, amortisation_jahre: 3
    },
    hamburg: {
      betriebe: 388, amort_unter_3_jahre_pct: 82, ohne_invest_pct: 40,
      quelle: "BUKEA Hamburg"
    },
    bundesweit: {
      betriebe: 4000, energie_mio_kwh_pa: 756, co2_t_pa: 332630,
      kosten_mio_eur_pa: 87.7, investition_mio_eur: 266
    }
  }
};

// Berechnet Score (0–100) für einen Kennwert.
// p25 = gut (100 Punkte), median = mittel (50), p75 = schlecht (0).
function calcBenchmarkScore(value, kennzahl) {
  const { p25, median, p75, invertiert } = kennzahl;
  if (p25 == null || median == null || p75 == null) return null;

  if (invertiert) {
    if (value >= p25) return 100;
    if (value >= median) return 50 + 50 * ((value - median) / (p25 - median));
    if (value >= p75) return 50 * ((value - p75) / (median - p75));
    return 0;
  } else {
    if (value <= p25) return 100;
    if (value <= median) return 50 + 50 * ((median - value) / (median - p25));
    if (value <= p75) return 50 * ((p75 - value) / (p75 - median));
    return 0;
  }
}

function getAmpelColor(score) {
  if (score >= 70) return 'green';
  if (score >= 40) return 'yellow';
  return 'red';
}

function calcScope2CO2(strom_kwh) {
  return strom_kwh * OEKOPROFIT_BENCHMARKS.emissionFactors.strom_de_mix_g_per_kwh / 1000;
}
