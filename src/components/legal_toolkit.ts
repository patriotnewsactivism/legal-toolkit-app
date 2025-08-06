// src/components/LegalToolkit.tsx
import React, { useState, useEffect } from 'react';

/**
 * LegalToolkit component: displays legal toolkit data fetched from API.
 */
const LegalToolkit: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/toolkit')
      .then((res) => res.json())
      .then((json) => setData(json.toolkit))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  return (
    <div>
      {data ?? 'Loading…'}
    </div>
  );
};

export default LegalToolkit;
