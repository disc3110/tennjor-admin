export type ProductImagePriority =
  | "cover"
  | "important"
  | "secondary"
  | "detail";

export const productImagePriorityOptions: Array<{
  value: ProductImagePriority;
  label: string;
}> = [
  { value: "cover", label: "Portada" },
  { value: "important", label: "Imagen importante" },
  { value: "secondary", label: "Imagen secundaria" },
  { value: "detail", label: "Imagen de detalle" },
];

function nextAvailableOrder(existingOrders: number[], startFrom: number) {
  const used = new Set(existingOrders);
  let next = startFrom;
  while (used.has(next)) {
    next += 1;
  }
  return next;
}

export function mapPriorityToOrder(
  priority: ProductImagePriority,
  existingOrders: number[],
) {
  if (priority === "cover") return 0;
  if (priority === "important") return 1;
  if (priority === "secondary") return nextAvailableOrder(existingOrders, 2);
  return nextAvailableOrder(existingOrders, 3);
}
