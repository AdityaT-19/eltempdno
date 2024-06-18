import { useEffect, useRef, useState } from "react";
import {
  CircularProgress,
  ListItem,
  ListItemText,
  List as MaterialList,
} from "@mui/material";
import UrlModal from "../UrlModal";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { CSS } from "@dnd-kit/utilities";

interface ListProps {
  id: string;
  title: string;
}

interface CanvasField {
  type: string;
  id: string;
  url: string | undefined;
  method: string | undefined;
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
    setIsLoading(true);
    const response = await axios.request({
      url: url,
      method: method,
    });
    let data = response.data;
    data = data.slice(0, 5);

    setListItems(data);
    setIsLoading(false);
  }

  async function fetchData(url: string, method: string) {
    setIsDataFetch(true);
    const newCanvasField = {
      id: canvasField.id,
      type: canvasField.type,
      url: url,
      method: method,
    };
    updateCanvasField(canvasField.id, newCanvasField);
  }

  useEffect(() => {
    if (canvasField.url && canvasField.method) {
      fetchList(canvasField.url, canvasField.method);
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
      {!isDataFetch && <UrlModal fetchData={fetchData} />}
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
