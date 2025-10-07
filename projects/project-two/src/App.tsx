import { useEffect, useMemo, useRef, useState } from 'react';
import { Ruler, MapPin, Shuffle, Target, TrendingUp, RotateCw, Info, AlertTriangle } from 'lucide-react';

type City = {
  name: string;
  lat: number;
  lon: number;
  pop: number;
};

type Point = { x: number; y: number };

// Germany bounding box (approx)
const DE_BOUNDS = { minLat: 47.27, maxLat: 55.06, minLon: 5.87, maxLon: 15.04 };

// Curated subset of German cities with ≥ 150k population (approx 2023)
const GERMAN_CITIES: City[] = [
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, pop: 3669000 },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937, pop: 1841000 },
  { name: 'München', lat: 48.1351, lon: 11.5820, pop: 1472000 },
  { name: 'Köln', lat: 50.9375, lon: 6.9603, pop: 1086000 },
  { name: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821, pop: 763000 },
  { name: 'Stuttgart', lat: 48.7758, lon: 9.1829, pop: 635000 },
  { name: 'Düsseldorf', lat: 51.2277, lon: 6.7735, pop: 629000 },
  { name: 'Dortmund', lat: 51.5136, lon: 7.4653, pop: 602000 },
  { name: 'Essen', lat: 51.4556, lon: 7.0116, pop: 582000 },
  { name: 'Leipzig', lat: 51.3397, lon: 12.3731, pop: 601000 },
  { name: 'Bremen', lat: 53.0793, lon: 8.8017, pop: 567000 },
  { name: 'Dresden', lat: 51.0504, lon: 13.7373, pop: 560000 },
  { name: 'Hannover', lat: 52.3759, lon: 9.7320, pop: 536000 },
  { name: 'Nürnberg', lat: 49.4521, lon: 11.0767, pop: 518000 },
  { name: 'Duisburg', lat: 51.4344, lon: 6.7623, pop: 501000 },
  { name: 'Bochum', lat: 51.4818, lon: 7.2162, pop: 364000 },
  { name: 'Wuppertal', lat: 51.2562, lon: 7.1508, pop: 355000 },
  { name: 'Bielefeld', lat: 52.0302, lon: 8.5325, pop: 341000 },
  { name: 'Bonn', lat: 50.7374, lon: 7.0982, pop: 331000 },
  { name: 'Münster', lat: 51.9607, lon: 7.6261, pop: 316000 },
  { name: 'Karlsruhe', lat: 49.0069, lon: 8.4037, pop: 313000 },
  { name: 'Mannheim', lat: 49.4875, lon: 8.4660, pop: 311000 },
  { name: 'Augsburg', lat: 48.3705, lon: 10.8978, pop: 299000 },
  { name: 'Wiesbaden', lat: 50.0782, lon: 8.2398, pop: 279000 },
  { name: 'Gelsenkirchen', lat: 51.5177, lon: 7.0857, pop: 262000 },
  { name: 'Mönchengladbach', lat: 51.1805, lon: 6.4428, pop: 261000 },
  { name: 'Braunschweig', lat: 52.2689, lon: 10.5268, pop: 251000 },
  { name: 'Chemnitz', lat: 50.8278, lon: 12.9214, pop: 247000 },
  { name: 'Kiel', lat: 54.3233, lon: 10.1228, pop: 247000 },
  { name: 'Aachen', lat: 50.7753, lon: 6.0839, pop: 249000 },
  { name: 'Halle (Saale)', lat: 51.4968, lon: 11.9689, pop: 239000 },
  { name: 'Magdeburg', lat: 52.1205, lon: 11.6276, pop: 239000 },
  { name: 'Freiburg', lat: 47.9990, lon: 7.8421, pop: 232000 },
  { name: 'Krefeld', lat: 51.3388, lon: 6.5853, pop: 227000 },
  { name: 'Lübeck', lat: 53.8655, lon: 10.6866, pop: 217000 },
  { name: 'Oberhausen', lat: 51.4963, lon: 6.8638, pop: 210000 },
  { name: 'Erfurt', lat: 50.9848, lon: 11.0299, pop: 214000 },
  { name: 'Mainz', lat: 49.9929, lon: 8.2473, pop: 220000 },
  { name: 'Rostock', lat: 54.0924, lon: 12.0991, pop: 208000 },
  { name: 'Kassel', lat: 51.3127, lon: 9.4797, pop: 202000 },
  { name: 'Hagen', lat: 51.3671, lon: 7.4633, pop: 188000 },
  { name: 'Saarbrücken', lat: 49.2402, lon: 6.9969, pop: 181000 },
  { name: 'Hamm', lat: 51.6739, lon: 7.8150, pop: 179000 },
  { name: 'Mülheim an der Ruhr', lat: 51.4309, lon: 6.8821, pop: 172000 },
  { name: 'Potsdam', lat: 52.3906, lon: 13.0645, pop: 183000 },
  { name: 'Ludwigshafen', lat: 49.4774, lon: 8.4452, pop: 172000 },
  { name: 'Oldenburg', lat: 53.1435, lon: 8.2146, pop: 170000 },
  { name: 'Leverkusen', lat: 51.0459, lon: 7.0192, pop: 165000 },
  { name: 'Osnabrück', lat: 52.2799, lon: 8.0472, pop: 165000 },
  { name: 'Solingen', lat: 51.1652, lon: 7.0671, pop: 160000 },
  { name: 'Darmstadt', lat: 49.8728, lon: 8.6512, pop: 162000 },
  { name: 'Heidelberg', lat: 49.3988, lon: 8.6724, pop: 160000 },
  { name: 'Herne', lat: 51.5388, lon: 7.2257, pop: 156000 },
  { name: 'Neuss', lat: 51.2042, lon: 6.6879, pop: 153000 },
  { name: 'Regensburg', lat: 49.0134, lon: 12.1016, pop: 153000 },
  { name: 'Paderborn', lat: 51.7189, lon: 8.7575, pop: 156000 }
];

const width = 900;
const height = 600;

function project(lat: number, lon: number): Point {
  const x = ((lon - DE_BOUNDS.minLon) / (DE_BOUNDS.maxLon - DE_BOUNDS.minLon)) * width;
  const y = ((DE_BOUNDS.maxLat - lat) / (DE_BOUNDS.maxLat - DE_BOUNDS.minLat)) * height;
  return { x, y };
}

function inverseProject(p: Point): { lat: number; lon: number } {
  const lon = DE_BOUNDS.minLon + (p.x / width) * (DE_BOUNDS.maxLon - DE_BOUNDS.minLon);
  const lat = DE_BOUNDS.maxLat - (p.y / height) * (DE_BOUNDS.maxLat - DE_BOUNDS.minLat);
  return { lat, lon };
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function centroid(points: Point[]): Point {
  const n = points.length || 1;
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n,
    y: points.reduce((s, p) => s + p.y, 0) / n,
  };
}

function scaleFitOnly(actual: Point[], guessed: Point[]) {
  // Align centroids, find scale s that minimizes sum || s*A - G ||^2
  const ca = centroid(actual);
  const cg = centroid(guessed);
  const Ac = actual.map(p => ({ x: p.x - ca.x, y: p.y - ca.y }));
  const Gc = guessed.map(p => ({ x: p.x - cg.x, y: p.y - cg.y }));
  let num = 0;
  let den = 0;
  for (let i = 0; i < Ac.length; i++) {
    num += Ac[i].x * Gc[i].x + Ac[i].y * Gc[i].y;
    den += Ac[i].x * Ac[i].x + Ac[i].y * Ac[i].y;
  }
  const s = den === 0 ? 1 : num / den;
  const fitted = Ac.map(p => ({ x: s * p.x + cg.x, y: s * p.y + cg.y }));
  const residuals = fitted.map((p, i) => ({ dx: guessed[i].x - p.x, dy: guessed[i].y - p.y }));
  const sse = residuals.reduce((sum, r) => sum + r.dx * r.dx + r.dy * r.dy, 0);
  const rmse = Math.sqrt(sse / actual.length);
  return { scale: s, fitted, residuals, sse, rmse, ca, cg };
}

function pairwiseCorrelation(a: Point[], b: Point[]) {
  const n = a.length;
  const dA: number[] = [];
  const dB: number[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const da = Math.hypot(a[i].x - a[j].x, a[i].y - a[j].y);
      const db = Math.hypot(b[i].x - b[j].x, b[i].y - b[j].y);
      dA.push(da);
      dB.push(db);
    }
  }
  // Pearson correlation
  const mean = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const ma = mean(dA);
  const mb = mean(dB);
  let num = 0, denA = 0, denB = 0;
  for (let k = 0; k < dA.length; k++) {
    const xa = dA[k] - ma;
    const xb = dB[k] - mb;
    num += xa * xb;
    denA += xa * xa;
    denB += xb * xb;
  }
  const corr = dA.length ? (num / Math.sqrt(denA * denB)) : 0;
  return corr;
}

function prettyKm(n: number) {
  return `${n.toFixed(0)} km`;
}

const ResearchApp = () => {
  const [seed, setSeed] = useState(() => Math.random());
  const rng = useMemo(() => {
    let t = Math.floor(seed * 1e9);
    return () => (t = (1664525 * t + 1013904223) % 4294967296) / 4294967296;
  }, [seed]);

  const [widthPx] = useState(width);
  const [heightPx] = useState(height);

  const [cities, setCities] = useState<City[]>([]);
  const [assignments, setAssignments] = useState<{ name: string; guess?: Point }[]>([]);
  const [hoverCity, setHoverCity] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Pick 5 random cities (≥150k)
  useEffect(() => {
    const pool = GERMAN_CITIES.filter(c => c.pop >= 150000);
    const picked: City[] = [];
    const used = new Set<number>();
    while (picked.length < 5 && used.size < pool.length) {
      const idx = Math.floor(rng() * pool.length);
      if (!used.has(idx)) { used.add(idx); picked.push(pool[idx]); }
    }
    setCities(picked);
    setAssignments(picked.map(c => ({ name: c.name })));
  }, [rng]);

  const actualPoints = useMemo(() => cities.map(c => project(c.lat, c.lon)), [cities]);
  const guessedPoints = useMemo(() => assignments.map(a => a.guess ?? { x: NaN, y: NaN }), [assignments]);
  const allPlaced = guessedPoints.every(p => Number.isFinite(p.x) && Number.isFinite(p.y));

  const fit = useMemo(() => {
    if (!allPlaced) return null;
    return scaleFitOnly(actualPoints, guessedPoints as Point[]);
  }, [allPlaced, actualPoints, guessedPoints]);

  const kmErrors = useMemo(() => {
    if (!allPlaced) return [] as number[];
    return assignments.map((a, i) => {
      const guessLL = inverseProject(guessedPoints[i] as Point);
      return haversineKm({ lat: guessLL.lat, lon: guessLL.lon }, { lat: cities[i].lat, lon: cities[i].lon });
    });
  }, [assignments, guessedPoints, cities, allPlaced]);

  const corr = useMemo(() => {
    if (!allPlaced) return null;
    return pairwiseCorrelation(actualPoints, guessedPoints as Point[]);
  }, [allPlaced, actualPoints, guessedPoints]);

  const largestErrorIdx = useMemo(() => {
    if (!allPlaced) return -1;
    let idx = 0; let max = -1;
    kmErrors.forEach((e, i) => { if (e > max) { max = e; idx = i; } });
    return idx;
  }, [kmErrors, allPlaced]);

  const startDrag = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    const rect = boardRef.current?.getBoundingClientRect();
    const onMove = (ev: MouseEvent) => {
      if (!rect) return;
      const x = Math.max(0, Math.min(widthPx, ev.clientX - rect.left));
      const y = Math.max(0, Math.min(heightPx, ev.clientY - rect.top));
      setAssignments(prev => prev.map(a => a.name === name ? { ...a, guess: { x, y } } : a));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const resetGuesses = () => setAssignments(prev => prev.map(a => ({ ...a, guess: undefined })));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Germany Map Fit — Project Two</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-slate-700 hover:bg-slate-50"
              onClick={() => setSeed(Math.random())}
              title="Pick 5 new random cities">
              <Shuffle className="w-4 h-4" /> New Cities
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-slate-700 hover:bg-slate-50"
              onClick={resetGuesses}
              title="Clear guesses">
              <RotateCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden shadow bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-emerald-50" />
            {/* decorative grid */}
            <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <div ref={boardRef} className="relative" style={{ width: width, height: height }}>
              {/* Stylized Germany frame */}
              <div className="absolute inset-6 rounded-[32px] border-2 border-slate-300/70 shadow-inner bg-white/40 backdrop-blur-sm" />
              <div className="absolute top-6 left-6 text-slate-600 text-sm inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Schematic map of Germany (normalized bounding box)</span>
              </div>

              {/* Dropped guesses */}
              {assignments.map((a, i) => (
                a.guess && (
                  <div key={a.name}
                       className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing`}
                       style={{ left: a.guess.x, top: a.guess.y }}
                       onMouseDown={(e) => startDrag(a.name, e)}
                       onMouseEnter={() => setHoverCity(a.name)}
                       onMouseLeave={() => setHoverCity(null)}
                  >
                    <div className={`px-2.5 py-1 rounded-md text-sm font-medium shadow border ${hoverCity===a.name? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-800 border-slate-200'}`}>
                      {a.name}
                    </div>
                  </div>
                )
              ))}

              {/* When fit is available, draw lines to true positions */}
              {fit && assignments.map((a, i) => (
                a.guess ? (
                  <svg key={`line-${a.name}`} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
                    <line x1={a.guess.x} y1={a.guess.y} x2={actualPoints[i].x} y2={actualPoints[i].y}
                          stroke="#0ea5e9" strokeDasharray="4 4" strokeWidth="2" />
                    <circle cx={actualPoints[i].x} cy={actualPoints[i].y} r="4" fill="#0ea5e9" />
                  </svg>
                ) : null
              ))}
            </div>

            {/* City tray for dragging */}
            <div className="relative border-t bg-white/70">
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {assignments.map((a) => (
                  <div key={`tray-${a.name}`}
                       onMouseDown={(e) => !a.guess && startDrag(a.name, e)}
                       className={`select-none inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm shadow-sm ${a.guess ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 cursor-grab active:cursor-grabbing'}`}
                  >
                    <Target className="w-4 h-4" /> {a.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-slate-500" />
              <h2 className="font-semibold text-slate-900">How it works</h2>
            </div>
            <p className="text-sm text-slate-600">
              Drag 5 city labels onto where you think they are on a schematic map of Germany. Once all are placed, the algorithm computes a scale-only fit that aligns the true positions with your guesses after centering. We report errors and correlations to let you explore accuracy and decision-making.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-900">Results</h3>
            </div>
            {!allPlaced && (
              <p className="text-sm text-slate-600">Place all 5 cities to compute fit.</p>
            )}
            {allPlaced && fit && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Scale factor</span><span className="font-medium">{fit.scale.toFixed(3)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">RMSE (pixels)</span><span className="font-medium">{fit.rmse.toFixed(1)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Pairwise dist. corr</span><span className="font-medium">{(corr ?? 0).toFixed(3)}</span></div>
                <div className="pt-2 border-t">
                  <div className="text-slate-700 font-medium mb-2">Per‑city error</div>
                  <div className="space-y-1">
                    {assignments.map((a, i) => (
                      <div key={`err-${a.name}`} className="flex items-center justify-between">
                        <span className="truncate mr-2">{a.name}</span>
                        <span className={`tabular-nums ${i===largestErrorIdx? 'text-rose-600 font-semibold' : 'text-slate-800'}`}>{prettyKm(kmErrors[i])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {allPlaced && fit && (
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-slate-900">Observations</h3>
              </div>
              <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                <li>Fitting uses centroid alignment and a single global scale; rotation is not applied.</li>
                <li>Largest error: <span className="font-medium">{assignments[largestErrorIdx].name}</span> at {prettyKm(kmErrors[largestErrorIdx])}.</li>
                <li>Correlation compares pairwise distances between your layout and actual geography.</li>
              </ul>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default ResearchApp;

