import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface TagOption {
  value: number | string;
  label: string;
}

interface TagInputProps {
  value: (number | string)[] | (number | string) | null;
  options: TagOption[];
  placeholder?: string;
  multiple?: boolean;
  onChange: (value: (number | string)[] | (number | string) | null) => void;
}

const TagInput: React.FC<TagInputProps> = ({ value, options, placeholder = 'Select...', multiple = true, onChange }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Normalize into a flat array for internal operations
  const selectedValues: (string | number)[] = useMemo(() => {
    if (multiple) {
      if (Array.isArray(value)) return value as (string | number)[];
      return value != null ? [value as string | number] : [];
    }
    return value != null ? [value as string | number] : [];
  }, [value, multiple]);

  const filtered = useMemo(() => options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())), [options, query]);

  const remove = (val: number | string) => {
    if (multiple) {
      const next = selectedValues.filter(v => v !== val) as (string | number)[];
      onChange(next);
    } else {
      onChange(null);
    }
  };

  const add = (val: number | string) => {
    if (multiple) {
      if (!selectedValues.includes(val)) onChange([...(selectedValues as (string | number)[]), val]);
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  // Position dropdown within viewport (prevents clipping beneath containers)
  useEffect(() => {
    if (!open || !containerRef.current || !dropdownRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dd = dropdownRef.current;
    dd.style.position = 'fixed';
    dd.style.minWidth = rect.width + 'px';
    const top = rect.bottom + 6;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8));
    dd.style.top = `${top}px`;
    dd.style.left = `${left}px`;
    dd.style.zIndex = '9999';
  }, [open]);

  return (
    <div className="tag-input tag-input--dropdown" ref={containerRef}>
      <div className="tag-input__control" onClick={() => setOpen(true)}>
        <div className="tag-input__tags">
          {selectedValues.length === 0 && (
            <span className="tag-input__placeholder">{placeholder}</span>
          )}
          {selectedValues.map((v) => {
            const opt = options.find(o => o.value === v);
            return (
              <span key={String(v)} className="tag">
                {opt?.label ?? String(v)}
                <button type="button" className="tag__remove" onClick={(e) => { e.stopPropagation(); remove(v); }}>×</button>
              </span>
            );
          })}
        </div>
        <input
          className="form-input tag-input__search"
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (
        <div ref={dropdownRef} className="tag-input__dropdown tag-input__dropdown--floating">
          {filtered.length === 0 && <div className="tag-input__empty">No results</div>}
          {filtered.map(opt => (
            <button type="button" key={String(opt.value)} className="tag-input__option" onClick={() => add(opt.value)}>
              <div className="tag-input__option-title">{opt.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
