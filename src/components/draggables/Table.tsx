import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import UrlModal from "../UrlModal";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CanvasField } from "../../data_types/CanvasField";

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
        width: 150,
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
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {!isDataFetch && <UrlModal fetchData={fetchData} field={canvasField} />}
      {isLoading && <CircularProgress />}
      {isDataFetch && (
        <Box
          sx={{
            height: 400,
            display: "inline-block",
            width: "auto",
            alignContent: `flex-start`,
            alignItems: `flex-start`,
            justifyContent: `flex-start`,
          }}
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
        >
          <DataGrid rows={rows} columns={columns} />
        </Box>
      )}
    </div>
  );
}
