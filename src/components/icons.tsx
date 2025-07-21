import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM12 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM12 5V2" />
      <path d="M12 10v4" />
      <path d="M12 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM12 19a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM12 19v-2" />
      <path d="m5 8.5 2 1" />
      <path d="m19 8.5-2 1" />
      <path d="m5 15.5 2-1" />
      <path d="m19 15.5-2-1" />
    </svg>
  );
}
