import { useDroppable } from "@dnd-kit/core";
import { Box, IconButton } from "@mui/material";
import List from "./draggables/List";
import Grid from "./draggables/Grid";
import Table from "./draggables/Table";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { CanvasField } from "../data_types/CanvasField";
import { Rnd } from "react-rnd";

const Canvas = (props: {
  fields: CanvasField[];
  updateCanvasField: (id: string, field: CanvasField) => void;
  deleteAll: () => void;
}) => {
  const { fields, updateCanvasField } = props;
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  function haveIntersection(
    other: { x: any; y: any; width: any; height: any },
    main: { x: any; y: any; width: any; height: any }
  ) {
    return !(
      main.x > other.x + other.width ||
      main.x + main.width < other.x ||
      main.y > other.y + other.height ||
      main.y + main.height < other.y
    );
  }

  return (
    <Box
      ref={setNodeRef}
      width={screen.width * 0.8}
      height={"100%"}
      border={"1px solid black"}
      margin={2}
      borderRadius={2}
      minHeight={screen.height * 0.8}
      display="flex"
      flexDirection="column"
      className="canvas"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "2%",
          position: "relative",
          top: "0",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: "auto",
          }}
        >
          Drop your components here
        </h2>
        <IconButton
          onClick={() => {
            props.deleteAll();
          }}
        >
          <GridDeleteIcon />
        </IconButton>
      </div>
      <div
        className="canvas"
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
        }}
      >
        {fields.map((field, index) => (
          <div
            key={index}
            className={field.type}
            style={{
              //display: "flex",
              flexDirection: field.type === "grid" ? "row" : "column",
              padding: "2%",
              display: "inline-block",
              width: "auto",
              alignContent: `flex-start`,
              alignItems: `flex-start`,
              justifyContent: `flex-start`,
              height: "auto",
            }}
          >
            {field.type === "list" && (
              <Rnd
                className={"mn872"}
                style={{
                  border: "1px solid black",
                  position: "relative",
                  //display: "flex",
                  flexDirection: "column",

                  height: "auto",
                  display: "inline-block",
                  width: "auto",
                  // height: "auto",
                }}
                bounds={".canvas"}
                default={{
                  x: field.x,
                  y: field.y,
                  width: "auto",
                  height: "auto",
                }}
                enableResizing={{
                  bottom: false,
                  bottomLeft: false,
                  bottomRight: false,
                  left: true,
                  right: true,
                  top: false,
                  topLeft: false,
                  topRight: false,
                }}
              >
                <List
                  canvasField={fields[index]}
                  updateCanvasField={updateCanvasField}
                />
              </Rnd>
            )}
            {field.type === "grid" && (
              <Rnd
                className={"mn872"}
                style={{
                  border: "1px solid black",
                  position: "relative",
                  // display: "flex",
                  flexDirection: "column",
                  height: "auto",
                  display: "inline-block",
                  width: "auto",
                  alignContent: `flex-start`,
                  alignItems: `flex-start`,
                  justifyContent: `flex-start`,
                }}
                bounds={".canvas"}
                default={{
                  x: field.x,
                  y: field.y,
                  width: "auto",
                  height: "auto",
                }}
                enableResizing={{
                  bottom: false,
                  bottomLeft: false,
                  bottomRight: false,
                  left: true,
                  right: true,
                  top: false,
                  topLeft: false,
                  topRight: false,
                }}
              >
                <Grid
                  canvasField={fields[index]}
                  updateCanvasField={updateCanvasField}
                />
              </Rnd>
            )}
            {field.type === "table" && (
              <Table
                canvasField={fields[index]}
                updateCanvasField={updateCanvasField}
              />
            )}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default Canvas;
