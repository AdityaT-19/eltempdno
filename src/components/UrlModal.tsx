import {
  Modal,
  Card,
  TextField,
  Button,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  IconButton,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Methods = "GET" | "POST" | "PUT" | "DELETE";

const UrlModal = (props: {
  fetchData: (url: string, method: string) => Promise<void>;
}) => {
  const fetchData = props.fetchData;

  const [method, setmethod] = useState<Methods>("GET");
  const [modalOpen, setModalOpen] = useState(true);
  const form = useForm({
    defaultValues: {
      url: "",
      body: null,
    },
  });

  const submit = (data: { url: string; body: string | null }) => {
    const url = (document.getElementById("url") as HTMLInputElement).value;
    fetchData(url, method);
  };

  const { register, handleSubmit } = form;
  return (
    <Modal open={modalOpen} onClose={() => {}}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h1>
              <strong>Enter URL</strong>
            </h1>
            <IconButton
              onClick={() => {
                setModalOpen(false);
              }}
              style={{
                alignSelf: "flex-start",
                position: "relative",
                right: "0",
              }}
            >
              <GridCloseIcon />
            </IconButton>
          </div>
          <form
            onSubmit={handleSubmit(submit)}
            style={{ display: "block", flexDirection: "column", width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <FormControl size="small">
                <InputLabel id="method-label">Method</InputLabel>
                <Select
                  labelId="method-label"
                  id="method"
                  value={method}
                  label="Method"
                  onChange={(e) => setmethod(e.target.value as Methods)}
                  size="medium"
                >
                  {["GET", "POST", "PUT", "DELETE"].map((method) => (
                    <MenuItem value={method}>{method}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="url"
                label="URL"
                type="url"
                variant="outlined"
                size="medium"
                {...register("url")}
                required
              />
            </div>

            {method !== "GET" && (
              <TextField
                id="body"
                label="Body"
                variant="outlined"
                size="medium"
                multiline
                rows={4}
                style={{ marginTop: "10px", width: "100%" }}
                {...register("body")}
              />
            )}
            <br />
            <Button
              variant="contained"
              type="submit"
              onClick={() => {}}
              style={{ marginTop: "10px", alignSelf: "center", width: "100%" }}
            >
              Fetch
            </Button>
          </form>
        </Card>
      </div>
    </Modal>
  );
};

export default UrlModal;
