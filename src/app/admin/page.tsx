import { prisma } from '@/lib/prisma';
import { FileText, FolderTree, Tags, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [postCount, categoryCount, tagCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count(),
  ]);

  const stats = [
    { name: 'Total Posts', stat: postCount, icon: FileText },
    { name: 'Categories', stat: categoryCount, icon: FolderTree },
    { name: 'Tags', stat: tagCount, icon: Tags },
    { name: 'Authors', stat: 1, icon: Users }, // Placeholder for now
  ];

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Dashboard Overview</h2>
      
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200"
          >
            <dt>
              <div className="absolute rounded-md bg-slate-900 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-slate-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
