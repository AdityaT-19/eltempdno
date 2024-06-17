import { DndContext, DragEndEvent } from "@dnd-kit/core";
import SideBar from "./components/SideBar";
import Canvas from "./components/Canvas";
import "./App.css";
import { useState } from "react";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { Icon, IconButton } from "@mui/material";

type CanvasProps = "list" | "grid" | "table";

interface CanvasField {
  type: string;
  id: string;
  url: string | undefined;
  method: string | undefined;
}
function App() {
  //const [fields, setFields] = useState<CanvasProps[]>([]);

  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);

  function addCanvasField(field: CanvasField) {
    setCanvasFields([...canvasFields, field]);
  }

  function removeCanvasField(id: string) {
    const newFields = canvasFields.filter((field) => field.id !== id);
    setCanvasFields(newFields);
  }

  function reorderCanvasField(sourceIndex: number, destinationIndex: number) {
    setCanvasFields(arrayMove(canvasFields, sourceIndex, destinationIndex));
  }

  function updateCanvasField(id: string, field: CanvasField) {
    const newFields = canvasFields.map((f) => (f.id === id ? field : f));
    setCanvasFields(newFields);
  }

  // function addField(field: CanvasProps) {
  //   setFields([...fields, field]);
  // }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activedata = active.data.current ?? {};
    if (over?.id === "canvas") {
      if (activedata.fromSideBar) {
        console.log(activedata);
        addCanvasField({
          type: activedata.type,
          id: nanoid(),
          url: undefined,
          method: undefined,
        });
        console.log(canvasFields);
      }
    } else {
      const sourceIndex = canvasFields.findIndex(
        (field) => field.id === active.id
      );
      const destinationIndex = canvasFields.findIndex(
        (field) => field.id === over?.id
      );
      if (destinationIndex === -1) {
        removeCanvasField(active.id.toString());
        return;
      }
      console.log(`sourceIndex: ${sourceIndex}`);
      console.log(`destinationIndex: ${destinationIndex}`);
      reorderCanvasField(sourceIndex, destinationIndex);
    }
  }

  return (
    <div className="App">
      <DndContext onDragEnd={handleDragEnd}>
        <SideBar />
        <SortableContext
          items={canvasFields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <Canvas fields={canvasFields} updateCanvasField={updateCanvasField} />
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default App;
