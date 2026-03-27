import { useEffect, useRef, useState } from "preact/hooks";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { showControlsToast } from "./components/toast.jsx";

let gameStarted = false;

async function waitForCrossOriginIsolation() {
  if (window.crossOriginIsolated) return;
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (window.crossOriginIsolated) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(
    "Cross-origin isolation is required for this build (Godot threads). Use HTTPS, allow the service worker, or host with COOP/COEP headers.",
  );
}

function bytesToPercent(current, total) {
  if (total > 0) return Math.min(99, Math.round((current / total) * 100));
  return null;
}

const downloads = [
  { href: "https://stuff.varunaditya.xyz/CrazyCattle3D_win_x86.zip", icon: FaWindows, label: "Windows x86" },
  { href: "https://stuff.varunaditya.xyz/CrazyCattle3D_win_arm64.zip", icon: FaWindows, label: "Windows arm64" },
  { href: "https://stuff.varunaditya.xyz/CrazyCattle3D_mac.zip", icon: FaApple, label: "MacOS (Universal)" },
  { href: "https://stuff.varunaditya.xyz/CrazyCattle3D_linux.zip", icon: FaLinux, label: "Linux" },
];

export function App() {
  const gameContainerRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);
  const [loadBytes, setLoadBytes] = useState({ current: 0, total: 0 });
  const [preparingEngine, setPreparingEngine] = useState(false);

  useEffect(() => {
    if (gameStarted) return;
    gameStarted = true;

    const engine = window.engine;
    if (!engine) {
      setGameLoading(false);
      return;
    }

    engine.config.onProgress = (current, total) => {
      setLoadBytes({ current, total });
      if (total > 0 && current >= total) {
        setPreparingEngine(true);
      }
    };

    void (async () => {
      try {
        await waitForCrossOriginIsolation();
        engine.config.args = ["--main-pack", "CrazyCattle3D.pck"];
        await Promise.all([engine.init("CrazyCattle3D"), engine.preloadFile("CrazyCattle3D.pck")]);
        setPreparingEngine(true);
        await engine.start();
      } catch (err) {
        console.error(err);
      } finally {
        setGameLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const sync = () => {
      const node = gameContainerRef.current;
      setFullscreen(node != null && document.fullscreenElement === node);
    };
    document.addEventListener("fullscreenchange", sync);
    sync();
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  async function toggleFullscreen() {
    const el = gameContainerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const loadPercent = bytesToPercent(loadBytes.current, loadBytes.total);
  const showDownloadLimited = loadPercent != null && !preparingEngine;
  const showDownloadForever = loadBytes.total === 0 && !preparingEngine;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-2xl md:text-2xl font-bold text-center">
        hi, i'm Varun-Aditya. check out this cool game i edited:
      </h1>
      <div ref={gameContainerRef} className={`relative w-full max-w-[960px] overflow-hidden bg-black outline-none ${fullscreen ? "h-screen max-h-screen max-w-none rounded-none border-0" : "aspect-video rounded-lg border border-white/10"}`}>
        <canvas id="canvas" className="block !h-full !w-full outline-none">
          Your browser does not support the canvas tag.
        </canvas>
        {gameLoading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/85 px-6" role="progressbar">
            <p className="text-sm font-medium text-white/90">
              {preparingEngine ? "Preparing engine…" : "Downloading files…"}
            </p>
            <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/15">
              {preparingEngine || showDownloadForever ? (
                <div className="loading-bar-forever h-full w-1/3 rounded-full bg-white/90" />
              ) : (
                <div className="h-full rounded-full bg-white/90 transition-[width] duration-150 ease-out" style={{ width: `${loadPercent}%` }}/>
              )}
            </div>
            <p className="max-w-sm text-center font-mono text-xs leading-relaxed text-white/60 tabular-nums">
              {preparingEngine ? (<span className="text-white/50">Compiling WebAssembly and starting the runtime...</span>) : showDownloadLimited ? (`${loadPercent}% complete`) : ("Loading game...")}
            </p>
          </div>
        )}
      </div>
      <div className="flex w-full max-w-[960px] flex-wrap items-center justify-center gap-x-6 text-sm text-white/90">
        {downloads.map(({ href, icon: Icon, label }) => (
          <a key={href} href={href} download className="inline-flex items-center gap-2 text-neutral-400 hover:text-white">
            <Icon aria-hidden className="h-5 w-5 shrink-0 opacity-90" />
            <span>{label}</span>
          </a>
        ))}
        <div className="flex-grow" />
        <div className="flex flex-row gap-4">
          <button type="button" onClick={() => showControlsToast()} className="inline-flex items-center text-neutral-400 hover:text-white cursor-pointer">Controls</button>
          <button type="button" onClick={() => void toggleFullscreen()} className="inline-flex items-center text-neutral-400 hover:text-white" aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} aria-pressed={fullscreen}>
            {fullscreen ? (<MdFullscreenExit aria-hidden className="h-5 w-5 shrink-0 opacity-90" />) : (<MdFullscreen aria-hidden className="h-5 w-5 shrink-0 opacity-90" />)}
          </button>
        </div>
      </div>
    </div>
  );
}
