import { Check, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";

interface ThoughtLineProps {
  label: string;
  doneLabel?: string;
  steps?: string[];
  working?: boolean;
  className?: string;
}

export const ThoughtLine = ({ label, doneLabel, steps = [], working = true, className = "" }: ThoughtLineProps) => {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(true);

  return (
    <div className={`text-sm text-helper ${className}`}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 text-left font-medium text-light" aria-expanded={open}>
        <Sparkles className={`h-4 w-4 text-primary ${working && !reduceMotion ? "animate-pulse" : ""}`} aria-hidden="true" />
        <span>{working ? label : doneLabel ?? label}</span>
        <ChevronDown className={`h-4 w-4 text-helper transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <div className="mt-4 space-y-3 border-l border-light-10 pl-6">
          {steps.map((step) => <div key={step} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /><span>{step}</span></div>)}
        </div>
      ) : null}
    </div>
  );
};
