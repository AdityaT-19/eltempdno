import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
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
import {
  AppBar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AppsIcon from "@mui/icons-material/Apps";
import TableViewIcon from "@mui/icons-material/TableView";
import { ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { CanvasField } from "./data_types/CanvasField";

const items = ["list", "grid", "table"];
const icons = [<FormatListBulletedIcon />, <AppsIcon />, <TableViewIcon />];

function App() {
  //const [fields, setFields] = useState<CanvasProps[]>([]);

  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);

  const [activeField, setActiveField] = useState<string | null>(null);

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

  function handleDragOver(event: DragOverEvent) {
    const { active } = event;

    setActiveField(active.data.current?.type);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activedata = active.data.current ?? {};
    if (over?.id === "trash") {
      removeCanvasField(active.id.toString());
      return;
    }
    if (over?.id === "canvas") {
      if (activedata.fromSideBar) {
        setActiveField(null);
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

      console.log(`sourceIndex: ${sourceIndex}`);
      console.log(`destinationIndex: ${destinationIndex}`);
      reorderCanvasField(sourceIndex, destinationIndex);
    }
  }

  return (
    <>
      <AppBar position="static">
        <Typography variant="h3" margin={2} align="center">
          Elevate Studio
        </Typography>
      </AppBar>
      <div className="App">
        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          <SideBar />
          <SortableContext
            items={canvasFields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <Canvas
              fields={canvasFields}
              updateCanvasField={updateCanvasField}
              deleteAll={() => {
                setCanvasFields([]);
              }}
            />
          </SortableContext>
          <DragOverlay>
            {activeField && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid black",
                  padding: "8px",
                  width: "20vw",
                }}
              >
                <ListItem>
                  <ListItemIcon>
                    {icons[items.indexOf(activeField)]}
                  </ListItemIcon>
                </ListItem>
                <ListItem>
                  <ListItemText primary={activeField} />
                </ListItem>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}

export default App;
