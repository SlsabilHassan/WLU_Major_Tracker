// Generated from the 2026-2027 W&L catalog. Course pairs the catalog joins with "or".
export const alternativePairs: [string, string][] = [
  ["BIOL 2110 (formerly 211) - Cell Biology", "BIOL 2110S (formerly 211S) - Cell Biology at St. Andrews"],
  ["NEUR 3905 (formerly 395) - Special Topics in Cellular and Molecular Neuroscience", "NEUR 4203 (formerly 423) - Directed Individual Research"],
  ["BIOL 2440 (formerly 240) - Comparative Animal Biology", "BIOL 2440S (formerly 240S) - Zoology at St. Andrews"],
  ["CHEM 2514 (formerly 260) - Physical Chemistry of Biological Systems", "CHEM 2523 (formerly 261) - Physical Chemistry: Quantum & Computational Chemistry"],
  ["PHIL 2260 (formerly 222) - Aristotle", "REL 1002 (formerly 102) - New Testament"],
  ["ECON 2003 (formerly 203) - Econometrics", "SOAN 2009 (formerly 222) - Data Science Tools for Social Policy"],
  ["EEG 1000 (formerly 100) - Dynamic Earth: Introductory Geology with Field Emphasis", "EEG 1001 (formerly 101) - Dynamic Earth: Introductory Geology"],
  ["EEG 1001 (formerly 101) - Dynamic Earth: Introductory Geology", "EEG 1002 (formerly 102) - Sustainable Earth: Introductory Environmental Geology"],
  ["MRST 4703 (formerly 473) - Senior Thesis", "MRST 4903 (formerly 493) - Honors Thesis (3-3)"],
  ["BIOL 2220 (formerly 220) - Genetics", "BIOL 2110 (formerly 211) - Cell Biology"],
  ["BIOL 2001 (formerly 201) - Statistics for Biology and Medicine", "CBSC 2500 (formerly 250) - Statistics and Research Design"],
  ["THTR 2401 (formerly 221) - Writer in Residence Seminar", "FILM 2104 (formerly 215) - Acting for Camera: Foundations and Techniques"],
  ["THTR 4703 (formerly 471) - University Theater IV: Capstone", "THTR 4903 (formerly 493) - Honors Thesis (+THTR 4903) for total of 6 credits"],
];

// Majors whose requirements split into mutually exclusive tracks/emphases.
// Values are label prefixes; a student normally completes only one of them.
export const majorTracks: Record<string, string[]> = {
  "Music (BS)": ["Vocal Music Emphasis", "Instrumental Music Emphasis"],
  "Journalism (BA)": ["Journalism Track", "Business Journalism Track"],
  "East Asian Languages and Literatures (BA)": ["Chinese", "Japanese"],
  "Environmental Studies (BA)": ["Conservation Biology Track", "Climate Change Track", "Environmental Economics and Policy Track", "Environmental Humanities Track", "Sustainable Commerce Track", "Water Resources Track"],
};

export function trackFor(majorName: string | undefined, label: string): string | null {
  const tracks = majorName ? majorTracks[majorName] : undefined;
  if (!tracks) return null;
  // longest prefix wins, so "Business Journalism Track" beats "Journalism Track"
  const hit = tracks
    .filter(t => label.startsWith(t))
    .sort((a, b) => b.length - a.length)[0];
  return hit ?? null;
}

export function countAlternativePairs(courses: string[]): number {
  let n = 0;
  for (let i = 0; i < courses.length - 1; i++) {
    if (alternativePairs.some(p => p[0] === courses[i] && p[1] === courses[i + 1])) n++;
  }
  return n;
}
