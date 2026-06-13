const fs = require('fs');
const path = require('path');

const routes = [
  'app/admin/courses/create',
  'app/admin/courses/[courseId]',
  'app/admin/courses/[courseId]/edit',
  'app/admin/tests/create',
  'app/admin/tests/[testId]',
  'app/admin/coding-problems/create',
  'app/admin/coding-problems/[problemId]',
  'app/admin/coding-problems/[problemId]/test-cases',
  'app/admin/students',
  'app/admin/batches',
  'app/admin/assignments',
  'app/admin/reports',
  'app/admin/certificates',
  'app/admin/super-admin',
  'app/admin/settings'
];

const template = (title) => `import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] max-w-lg mx-auto text-center space-y-6">
      <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
        <Construction className="w-10 h-10 text-purple-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">${title}</h1>
        <p className="text-slate-400 text-sm">
          This module is currently under active development. Our engineering team is working hard to bring you these features soon.
        </p>
      </div>
      <Link 
        href="/admin/dashboard" 
        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
`;

function toTitleCase(str) {
  return str.split(/[-/]/).map(word => {
    if (word.startsWith('[')) return 'Details';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ').replace('App Admin ', '');
}

routes.forEach(route => {
  const dirPath = path.join(process.cwd(), route);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const title = toTitleCase(route);
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), template(title));
  console.log('Created:', route);
});
