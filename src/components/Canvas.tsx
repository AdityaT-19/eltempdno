import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import List from "./draggables/List";
import Grid from "./draggables/Grid";
import Table from "./draggables/Table";
import { CSS } from "@dnd-kit/utilities";

interface CanvasField {
  type: string;
  id: string;
  url: string | undefined;
  method: string | undefined;
}
const Canvas = (props: {
  fields: CanvasField[];
  updateCanvasField: (id: string, field: CanvasField) => void;
}) => {
  const { fields, updateCanvasField } = props;
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  return (
    <Box
      ref={setNodeRef}
      width={screen.width * 0.8}
      height={"100%"}
      border={"1px solid black"}
      margin={2}
      minHeight={screen.height * 0.8}
    >
      <h1>Canvas</h1>
      {fields.map((field, index) => (
        <div
          key={index}
          className={field.type}
          style={{
            display: "flex",
            flexDirection: field.type === "grid" ? "row" : "column",
            padding: "2%",
          }}
        >
          {field.type === "list" && (
            <List
              canvasField={fields[index]}
              updateCanvasField={updateCanvasField}
            />
          )}
          {field.type === "grid" && (
            <Grid
              canvasField={fields[index]}
              updateCanvasField={updateCanvasField}
            />
          )}
          {field.type === "table" && (
            <Table
              canvasField={fields[index]}
              updateCanvasField={updateCanvasField}
            />
          )}
        </div>
      ))}
    </Box>
  );
};

export default Canvas;
