import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} className="text-slate-400" />}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-kvenno-orange transition"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Helper function to generate breadcrumbs based on current path
export const getBreadcrumbsForPath = (basePath: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ label: 'Heim', href: '/' }];

  // Extract year from base path (e.g., /2-ar/lab-reports/ -> 2. ár)
  const yearMatch = basePath.match(/\/(\d)-ar\//);
  if (yearMatch) {
    const year = yearMatch[1];
    items.push({
      label: `${year}. ár`,
      href: `/${year}-ar/`
    });
  }

  // Add current page
  items.push({ label: 'Tilraunarskýrslur' });

  return items;
};
