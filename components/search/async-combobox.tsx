"use client";

import * as React from "react";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboOption {
  value: string;
  label: string;
  sublabel?: string;
}

export function AsyncCombobox({
  label,
  placeholder,
  value,
  onChange,
  fetchOptions,
  disabled,
  recentOptions,
  id,
}: {
  label: string;
  placeholder: string;
  value: ComboOption | null;
  onChange: (opt: ComboOption | null) => void;
  fetchOptions: (query: string) => Promise<ComboOption[]>;
  disabled?: boolean;
  recentOptions?: ComboOption[];
  id: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<ComboOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleOptions = query.trim() === "" && recentOptions?.length ? recentOptions : options;

  React.useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetchOptions(query)
        .then((results) => setOptions(results))
        .finally(() => setLoading(false));
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function selectOption(opt: ComboOption) {
    onChange(opt);
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visibleOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && visibleOptions[activeIndex]) selectOption(visibleOptions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-2">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-md border border-border-strong bg-surface-2 px-3 text-left text-sm",
          "focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50",
          !value && "text-muted-2"
        )}
      >
        <span className="truncate">
          {value ? (
            <>
              <span className="font-medium text-foreground">{value.value}</span>
              <span className="text-muted"> — {value.label}</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  onChange(null);
                }
              }}
              className="rounded p-0.5 text-muted hover:text-foreground"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} className="text-muted-2" />
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-md border border-border-strong bg-surface shadow-xl">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={14} className="text-muted-2 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={onKeyDown}
              placeholder="Type to search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-2"
            />
            {loading && <Loader2 size={14} className="animate-spin text-muted-2 shrink-0" />}
          </div>
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {visibleOptions.length === 0 && !loading && (
              <li className="px-3 py-4 text-center text-xs text-muted-2">No matches found.</li>
            )}
            {query.trim() === "" && recentOptions?.length ? (
              <li className="px-3 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-2">
                Recent
              </li>
            ) : null}
            {visibleOptions.map((opt, idx) => (
              <li key={opt.value} role="option" aria-selected={activeIndex === idx}>
                <button
                  type="button"
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                    activeIndex === idx ? "bg-surface-2" : "hover:bg-surface-2"
                  )}
                >
                  <span>
                    <span className="font-medium text-foreground">{opt.value}</span>
                    <span className="ml-2 text-muted">{opt.label}</span>
                  </span>
                  {opt.sublabel && <span className="text-xs text-muted-2">{opt.sublabel}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
