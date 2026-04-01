import { Badge, Button, Input, Separator } from "@techstartups/ui";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <p className="text-sm text-muted-foreground">@techstartups/ui imports</p>

      <div className="flex items-center gap-3">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <div className="flex items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>

      <Input className="max-w-sm" placeholder="Input component" />

      <Separator className="max-w-sm" />

      <p className="text-xs text-muted-foreground">All four components imported from @techstartups/ui ✓</p>
    </div>
  );
}
