const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM = "0123456789";
const SYM = "!@#$%^&*()-_=+[]{}|;:,.<>?";
const AMBIG = "{}[]()/\\'\"`~,;:.<>";

interface Options {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export function generatePassword(opt: Options): string {
  let pool = "";
  const must: string[] = [];

  const clean = (s: string) =>
    opt.excludeAmbiguous ? s.split("").filter(c => !AMBIG.includes(c)).join("") : s;

  if (opt.includeLowercase) { pool += clean(LOWER); must.push(random(clean(LOWER))); }
  if (opt.includeUppercase) { pool += clean(UPPER); must.push(random(clean(UPPER))); }
  if (opt.includeNumbers) { pool += clean(NUM); must.push(random(clean(NUM))); }
  if (opt.includeSymbols) { pool += clean(SYM); must.push(random(clean(SYM))); }

  if (!pool) return "";

  while (must.length < opt.length) must.push(random(pool));

  for (let i = must.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [must[i], must[j]] = [must[j], must[i]];
  }

  return must.join("");
}

const random = (s: string) => s[Math.floor(Math.random() * s.length)];
