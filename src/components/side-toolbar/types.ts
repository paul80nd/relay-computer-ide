export type SideToolbarProps = {
  onCheckedValueChange?: (name: string, checkedItems: string[]) => void;
  checkedValues?: Record<string, string[]>;
}
