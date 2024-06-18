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
  Menu,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CanvasField } from "../data_types/CanvasField";

type Methods = "GET" | "POST" | "PUT" | "DELETE";

const UrlModal = (props: {
  fetchData: (
    url: string,
    method: string,
    dataFields: string[]
  ) => Promise<void>;
  field: CanvasField;
}) => {
  const fetchData = props.fetchData;
  const field = props.field;
  const [method, setmethod] = useState<Methods>("GET");
  const [modalOpen, setModalOpen] = useState(true);
  const urlForm = useForm({
    defaultValues: {
      url: "",
      body: null,
    },
  });

  const dataFieldsForm = useForm({
    defaultValues: {
      dataField1: "",
      dataField2: "",
    },
  });

  const { register: dataFieldsRegister } = dataFieldsForm;

  const [isUrlDataFetch, setIsUrlDataFetch] = useState(false);
  let [urlData, setUrlData] = useState<any[]>([]);
  const [df1, setDf1] = useState("");
  const [df2, setDf2] = useState("");

  const submit = async (data: { url: string; body: string | null }) => {
    const url = (document.getElementById("url") as HTMLInputElement).value;
    //fetchData(url, method);

    if (field.type === "table") {
      fetchData(url, method, []);
    }

    const response = await axios.request({
      url: url,
      method: method,
    });
    const urlDataResponse = response.data;
    console.log(urlDataResponse);
    urlData = urlDataResponse;
    console.log(urlData);
    setUrlData(urlData);
    setIsUrlDataFetch(true);
  };

  const { register: urlRegister, handleSubmit } = urlForm;
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
          {!isUrlDataFetch && (
            <form
              onSubmit={handleSubmit(submit)}
              style={{
                display: "block",
                flexDirection: "column",
                width: "100%",
              }}
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
                  {...urlRegister("url")}
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
                  {...urlRegister("body")}
                />
              )}
              <br />
              <Button
                variant="contained"
                type="submit"
                onClick={() => {}}
                style={{
                  marginTop: "10px",
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                Fetch
              </Button>
            </form>
          )}
          {isUrlDataFetch && (
            <form>
              <FormControl size="medium" margin="normal">
                <InputLabel id="dataField1-label">
                  {field.type === "grid" ? "Data" : "Primary Data Field"}
                </InputLabel>
                <Select
                  labelId="dataField1-label"
                  id="dataField1"
                  label={field.type === "grid" ? "Data" : "Primary Data Field"}
                  {...dataFieldsRegister("dataField1")}
                  value={df1}
                  onChange={(e) => setDf1(e.target.value)}
                  style={{
                    width: "50vw",
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>None</em>
                  </MenuItem>
                  {Object.keys(urlData[0]).map((key) => (
                    <MenuItem value={key}>{key}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              {field.type === "list" && (
                <FormControl size="medium" margin="normal">
                  <InputLabel id="dataField2-label">
                    Secondary Data Field
                  </InputLabel>
                  <Select
                    labelId="dataField2-label"
                    id="dataField2"
                    label="Secondary Data Field"
                    {...dataFieldsRegister("dataField2")}
                    value={df2}
                    onChange={(e) => setDf2(e.target.value)}
                    style={{
                      width: "50vw",
                    }}
                  >
                    <MenuItem value={""}>
                      <em>None</em>
                    </MenuItem>
                    {Object.keys(urlData[0]).map((key) => (
                      <MenuItem value={key}>{key}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                variant="contained"
                onClick={() => {
                  if (field.type === "grid" || field.type === "table") {
                    fetchData(urlForm.getValues("url"), method, [df1]);
                  } else if (field.type === "list") {
                    fetchData(urlForm.getValues("url"), method, [df1, df2]);
                  }
                }}
                style={{
                  marginTop: "10px",
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                Add
              </Button>
            </form>
          )}
        </Card>
      </div>
    </Modal>
  );
};

export default UrlModal;
