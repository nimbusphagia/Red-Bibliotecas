/**
 * Opción de SearchSelect. `detail` va tras un punto junto a la etiqueta (lista
 * y chips); `caption` solo se ve en la lista de resultados.
 */
export interface Option<Id extends string | number = number> {
  id: Id;
  label: string;
  detail?: string;
  caption?: string;
}
