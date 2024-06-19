import { useEffect, useState } from "react";
import {
  CircularProgress,
  ListItem,
  ListItemText,
  List as MaterialList,
} from "@mui/material";
import UrlModal from "../UrlModal";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CanvasField } from "../../data_types/CanvasField";

interface ListProps {
  id: string;
  title: string;
}

const List = (props: {
  canvasField: CanvasField;
  updateCanvasField: (id: string, field: CanvasField) => void;
}) => {
  const [listItems, setListItems] = useState<ListProps[]>([]);
  const canvasField = props.canvasField;
  const updateCanvasField = props.updateCanvasField;

  const [isDataFetch, setIsDataFetch] = useState(
    canvasField.url !== undefined && canvasField.method !== undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: canvasField.id,
      data: {
        type: "list",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function fetchList(url: string, method: string) {
    console.log("fetching list");
    console.log(url);
    setIsLoading(true);
    const response = await axios.request({
      url: url,
      method: method,
    });
    let data = response.data;
    data = data.map((item: any) => {
      return {
        id: item[canvasField.dataFields![0]],
        title: item[canvasField.dataFields![1]],
      };
    });

    data = data.slice(0, 5);
    setListItems(data);
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
      x: canvasField.x,
      y: canvasField.y,
    };
    updateCanvasField(canvasField.id, newCanvasField);
  }

  useEffect(() => {
    if (canvasField.url && canvasField.method) {
      fetchList(canvasField.url, canvasField.method);
    }
  }, [canvasField.url, canvasField.method, canvasField.dataFields]);

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
        <MaterialList
          style={style}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
        >
          {listItems.map((item) => (
            <div>
              <ListItem>
                <ListItemText
                  primary={item.title}
                  secondary={item.id}
                  style={{
                    display: "inline-block",
                    width: "auto",
                    alignContent: `flex-start`,
                    alignItems: `flex-start`,
                    justifyContent: `flex-start`,
                  }}
                />
              </ListItem>
            </div>
          ))}
        </MaterialList>
      )}
    </div>
  );
};

export default List;
