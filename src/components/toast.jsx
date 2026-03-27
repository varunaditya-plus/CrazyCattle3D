import { Toaster, toast } from "sonner";
import { Kbd, KbdGroup } from "./kbd.jsx";

function ControlsToastBody() {
  return (
    <div className="flex flex-col gap-2.5 text-left">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] text-muted-foreground">Movement</span>
        <KbdGroup>
          <Kbd>W</Kbd>
          <Kbd>A</Kbd>
          <Kbd>S</Kbd>
          <Kbd>D</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] text-muted-foreground">Backflip</span>
        <Kbd className="min-w-[3.25rem] px-1.5">Space</Kbd>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] text-muted-foreground">Beigh</span>
        <Kbd>R</Kbd>
      </div>
    </div>
  );
}

export function showControlsToast() {
  toast("Controls", {
    description: <ControlsToastBody />,
    duration: 10_000,
  });
}

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "border-border bg-card text-card-foreground !w-[initial]",
          title: "font-medium",
          description: "w-full !text-foreground",
        },
      }}
    />
  );
}