"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import type { CreateProductVariantPayload } from "@/src/features/products/types/product";

type ProductVariantCreateFormProps = {
  isSaving: boolean;
  onSubmit: (payload: CreateProductVariantPayload) => void;
};

export function ProductVariantCreateForm({ isSaving, onSubmit }: ProductVariantCreateFormProps) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      size: size.trim(),
      color: color.trim(),
      sku: sku.trim() || undefined,
      stock: Number(stock),
      isActive,
    });

    setSize("");
    setColor("");
    setSku("");
    setStock("0");
    setIsActive(true);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">Agregar variante</h2>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <Input placeholder="Talla (ej. 42 o 42.5)" value={size} onChange={(e) => setSize(e.target.value)} required />
        <Input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} required />
        <Input placeholder="SKU (opcional)" value={sku} onChange={(e) => setSku(e.target.value)} />
        <Input
          type="number"
          min={0}
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Variante activa
        </label>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Creando..." : "Crear variante"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
