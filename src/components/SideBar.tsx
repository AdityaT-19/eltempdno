import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AppsIcon from "@mui/icons-material/Apps";
import TableViewIcon from "@mui/icons-material/TableView";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";
import { useRef } from "react";

const items = ["List", "Grid", "Table"];
const icons = [<FormatListBulletedIcon />, <AppsIcon />, <TableViewIcon />];

export const SideBarField = (index: number) => {
  const id = useRef(nanoid());
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id.current,
    data: {
      type: items[index].toLowerCase(),
      fromSideBar: true,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Box
      border={"1px solid black"}
      margin={1}
      padding={1}
      borderRadius={1}
      key={items[index]}
    >
      <ListItem
        key={items[index]}
        style={style}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <ListItemButton>
          <ListItemIcon>{icons[index]}</ListItemIcon>
          <ListItemText primary={items[index]} />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

const SideBar = () => {
  return (
    <Box width={screen.width * 0.2} height={"100vh"}>
      <List>{items.map((_, index) => SideBarField(index))}</List>
    </Box>
  );
};

export default SideBar;
