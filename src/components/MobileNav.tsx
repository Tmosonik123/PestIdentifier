import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  const menuItems = [
    { value: "capture", label: "Identify Pest/Disease" },
    { value: "track", label: "Track Pest & Diseases" },
    { value: "history", label: "History" },
    { value: "chat", label: "Ask Expert" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <nav className="grid gap-2 py-6">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant={activeTab === item.value ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                onTabChange(item.value);
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
