export type ProductImagePriority =
  | "cover"
  | "important"
  | "secondary"
  | "detail";

export const productImagePriorityOptions: Array<{
  value: ProductImagePriority;
  label: string;
}> = [
  { value: "cover", label: "Cover" },
  { value: "important", label: "Important image" },
  { value: "secondary", label: "Secondary image" },
  { value: "detail", label: "Detail image" },
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
