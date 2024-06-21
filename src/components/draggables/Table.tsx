import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import UrlModal from "../UrlModal";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CanvasField } from "../../data_types/CanvasField";
import { Rnd } from "react-rnd";

export default function DataGridDemo(props: {
  canvasField: CanvasField;
  updateCanvasField: (id: string, field: CanvasField) => void;
}) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);

  const canvasField = props.canvasField;
  const updateCanvasField = props.updateCanvasField;

  const [isDataFetch, setIsDataFetch] = useState(
    canvasField.url !== undefined && canvasField.method !== undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: canvasField.id, data: { type: "table" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function fetchTable(url: string, method: string) {
    setIsLoading(true);
    const response = await axios.request({
      url: url,
      method: method,
    });
    let data = response.data;
    setRows(data);
    setColumns(
      Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key,
      }))
    );

    setIsLoading(false);
  }

  async function fetchData(url: string, method: string) {
    setIsDataFetch(true);
    const newCanvasField = {
      id: canvasField.id,
      type: canvasField.type,
      url: url,
      method: method,
      x: canvasField.x,
      y: canvasField.y,
    };
    updateCanvasField(canvasField.id, newCanvasField);
  }

  useEffect(() => {
    if (canvasField.url && canvasField.method) {
      fetchTable(canvasField.url, canvasField.method);
    }
  }, [canvasField.url, canvasField.method]);

  return (
    <div>
      {!isDataFetch && <UrlModal fetchData={fetchData} field={canvasField} />}
      {isLoading && <CircularProgress />}
      {isDataFetch && (
        <Rnd
          default={{
            x: canvasField.x,
            y: canvasField.y,
            width: "auto",
            height: "400",
          }}
          bounds=".canvas"
          dragHandleClassName="dragHandle"
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "white",
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              zIndex: 1000,
            }}
            className="dragHandle"
            style={style}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
          >
            +
          </Box>
          <DataGrid
            style={{
              height: "100%",
              width: "100%",
            }}
            rows={rows}
            columns={columns}
            autoPageSize={true}
          />
        </Rnd>
      )}
    </div>
  );
}
