'use client';

import { useState } from 'react';
import { ContentSection, type FieldDef } from './content-section';

type Section = {
  title: string;
  description: string;
  fields: FieldDef[];
};

type Props = {
  sections: Section[];
  values: Record<string, string>;
};

export function ContentTabs({ sections, values }: Props) {
  const [active, setActive] = useState(0);
  const section = sections[active]!;

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-zinc-200">
        {sections.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              i === active
                ? 'border-b-2 border-zinc-800 text-zinc-800'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Active section */}
      <ContentSection
        key={section.title}
        title={section.title}
        description={section.description}
        fields={section.fields}
        values={values}
      />
    </div>
  );
}
