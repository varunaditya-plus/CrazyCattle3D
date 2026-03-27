export function Kbd({ className = "", children, ...rest }) {
  return (
    <kbd
      className={`pointer-events-none inline-flex h-5 min-h-5 min-w-5 select-none items-center justify-center rounded border border-neutral-800 bg-neutral-900 px-1 font-mono text-[0.625rem] font-medium leading-none text-muted-foreground shadow-[0_1px_0_0_oklch(1_0_0_/_6%)] ${className}`}
      {...rest}
    >
      {children}
    </kbd>
  );
}

export function KbdGroup({ className = "", children, ...rest }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} {...rest}>
      {children}
    </span>
  );
}