import { SquareKanban, List } from "lucide-react";
export function Header({ viewType = "kanBan" }) {
  return (
    <div className="flex flex-col gap-2">
      <h1> Project Name</h1>
      <div className="flex">
        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <SquareKanban size={16} /> KanBan
          </div>
          <div className="flex gap-1 items-center">
            <List size={16} /> List
          </div>
        </div>
      </div>
    </div>
  );
}
