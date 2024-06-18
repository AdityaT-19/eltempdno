import {
  CircularProgress,
  Grid as MaterialGrid,
  Paper,
  styled,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import UrlModal from "../UrlModal";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CanvasField } from "../../data_types/CanvasField";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface GridProps {
  body: string;
}

const Grid = (props: {
  canvasField: CanvasField;
  updateCanvasField: (id: string, field: CanvasField) => void;
}) => {
  const [gridItems, setGridItems] = useState<GridProps[]>([]);
  const canvasField = props.canvasField;
  const updateCanvasField = props.updateCanvasField;

  const [isDataFetch, setIsDataFetch] = useState(
    canvasField.url !== undefined && canvasField.method !== undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: canvasField.id, data: { type: "grid" } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function fetchGrid(url: string, method: string) {
    setIsLoading(true);
    const response = await axios.request({
      url: url,
      method: method,
    });
    let data = response.data;
    data = data.map((item: any) => {
      return {
        body: item[canvasField.dataFields![0]],
      };
    });
    data = data.slice(0, 5);
    setGridItems(data);
    setIsLoading(false);
  }

  async function fetchData(url: string, method: string, dataFields: string[]) {
    setIsDataFetch(true);
    const newCanvasField = {
      id: canvasField.id,
      type: canvasField.type,
      url: url,
      method: method,
      dataFields: dataFields,
    };
    updateCanvasField(canvasField.id, newCanvasField);
  }

  useEffect(() => {
    if (canvasField.url && canvasField.method) {
      fetchGrid(canvasField.url, canvasField.method);
    }
  }, [canvasField.url, canvasField.method]);

  return (
    <div>
      {!isDataFetch && <UrlModal fetchData={fetchData} field={canvasField} />}
      {isLoading && <CircularProgress />}
      {isDataFetch && (
        <MaterialGrid
          container
          spacing={2}
          style={style}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
        >
          {gridItems.map((item, index) => (
            <MaterialGrid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "inline-block",
                width: "auto",
                alignContent: `flex-start`,
                alignItems: `flex-start`,
                justifyContent: `flex-start`,
              }}
            >
              <Item>{item.body}</Item>
            </MaterialGrid>
          ))}
        </MaterialGrid>
      )}
    </div>
  );
};

export default Grid;
