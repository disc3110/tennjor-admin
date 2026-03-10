"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { generateSizeRange } from "@/src/features/products/utils/size-range";

type ProductVariantRangeGeneratorProps = {
  isSaving: boolean;
  onCreateRange: (input: {
    startSize: number;
    endSize: number;
    includeHalfSizes: boolean;
    color: string;
    stock: number;
    isActive: boolean;
  }) => void;
};

export function ProductVariantRangeGenerator({
  isSaving,
  onCreateRange,
}: ProductVariantRangeGeneratorProps) {
  const [startSize, setStartSize] = useState("25");
  const [endSize, setEndSize] = useState("29");
  const [includeHalfSizes, setIncludeHalfSizes] = useState(false);
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const preview = useMemo(
    () =>
      generateSizeRange({
        startSize: Number(startSize),
        endSize: Number(endSize),
        includeHalfSizes,
      }),
    [endSize, includeHalfSizes, startSize],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onCreateRange({
      startSize: Number(startSize),
      endSize: Number(endSize),
      includeHalfSizes,
      color: color.trim(),
      stock: Number(stock),
      isActive,
    });
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">Generador de rango de tallas</h2>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <Input type="number" step="0.5" value={startSize} onChange={(e) => setStartSize(e.target.value)} required />
        <Input type="number" step="0.5" value={endSize} onChange={(e) => setEndSize(e.target.value)} required />
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeHalfSizes}
            onChange={(e) => setIncludeHalfSizes(e.target.checked)}
          />
          Incluir medias tallas
        </label>
        <Input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} required />
        <Input
          type="number"
          min={0}
          placeholder="Stock por defecto"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Variantes activas
        </label>

        <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vista previa</p>
          {preview.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Rango de tallas inválido.</p>
          ) : (
            <p className="mt-2 text-sm text-slate-700">{preview.join(", ")}</p>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={isSaving || preview.length === 0}>
            {isSaving ? "Creando..." : `Crear ${preview.length} variante(s)`}
          </Button>
        </div>
      </form>
    </Card>
  );
}
