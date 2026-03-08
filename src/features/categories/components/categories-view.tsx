import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/ui/page-header";

export function CategoriesView() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Organize the storefront with clear product groupings and visibility rules."
        action={
          <Button iconLeft={<Plus className="size-4" />} className="w-full md:w-auto">
            Add Category
          </Button>
        }
      />

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Category Management</h2>
        <p className="mt-2 text-sm text-slate-500">
          Category CRUD screens and assignment flows will be wired to API endpoints in a
          future iteration.
        </p>
      </Card>
    </section>
  );
}
