// Garment measurements, laid flat, in centimetres. From Printful's size tables
// for the exact blanks we print on (AS Colour 5101 hoodie = Printful #484,
// AS Colour 5082 faded tee = Printful #713), converted from inches.
import type { GarmentType } from "./products";

export type SizeRow = { size: string; width: number; length: number; sleeve: number };

export const sizeTables: Record<GarmentType, { fit: string; rows: SizeRow[] }> = {
  hoodie: {
    fit: "Relaxed, dropped shoulder. Take your usual size; size up for a slouchier fit.",
    rows: [
      { size: "S", width: 52, length: 72, sleeve: 73 },
      { size: "M", width: 55, length: 74.5, sleeve: 76 },
      { size: "L", width: 58, length: 77, sleeve: 78 },
      { size: "XL", width: 61, length: 79.5, sleeve: 80 },
      { size: "2XL", width: 64, length: 82, sleeve: 83 },
    ],
  },
  tee: {
    fit: "Oversized and boxy. Take your usual size for the intended fit; size down for a regular fit.",
    rows: [
      { size: "S", width: 51, length: 70.5, sleeve: 23 },
      { size: "M", width: 55, length: 74, sleeve: 24 },
      { size: "L", width: 59, length: 77.5, sleeve: 24 },
      { size: "XL", width: 63, length: 81, sleeve: 26 },
      { size: "2XL", width: 67, length: 84.5, sleeve: 27 },
      { size: "3XL", width: 71, length: 86.5, sleeve: 28 },
    ],
  },
};
