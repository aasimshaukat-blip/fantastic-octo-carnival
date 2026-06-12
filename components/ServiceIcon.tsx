import {
  DraftingCompass,
  PackageSearch,
  HardHat,
  Flame,
  Pipette,
  Cog,
  Construction,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  DraftingCompass,
  PackageSearch,
  HardHat,
  Flame,
  Pipette,
  Cog,
  Construction,
  Wrench,
};

export default function ServiceIcon({
  name,
  className = "h-7 w-7",
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? HardHat;
  return <Icon className={className} aria-hidden />;
}
