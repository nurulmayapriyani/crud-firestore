import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useEffect } from "react";
import { getDocList, db, deleteDocList } from "./firestore";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs";
import Plot from 'react-plotly.js';

const columns = [
  {
    no: 1,
    id: "created",
    type: "timestampValue",
    label: "Created",
    minWidth: 80,
    align: "center",
  },
  {
    no: 2,
    id: "fruit",
    type: "stringValue",
    label: "Fruit",
    minWidth: 70,
    align: "center",
  },
  {
    no: 3,
    id: "protein",
    type: "stringValue",
    label: "Protein",
    minWidth: 70,
    align: "center",
  },
  {
    no: 4,
    id: "vegetable",
    type: "stringValue",
    label: "Vegetable",
    minWidth: 70,
    align: "center",
  },
  {
    no: 5,
    id: "wholeTotal",
    type: "integerValue",
    label: "Total",
    minWidth: 70,
    align: "center",
  },
];

export default function GroceryList() {
  const [getGroceries, setGetGroceries] = useState([]);
  const [changeGroceries, setChangeGroceries] = useState([]);
  const [created, setCreated] = useState("");
  const [fruit, setFruit] = useState("");
  const [protein, setProtein] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [wholeTotal, setWholeTotal] = useState(0);
  const [currentRow, setCurrentRow] = useState([]);
  const [data, setData] = useState([]);

  const loadGroceries = async () => {
    let getFunc = await getDocList("groceryLists");
    setGetGroceries(getFunc.docs);
    // console.log(getFunc.docs);

    const groceryDocs = getFunc.docs.map(doc => doc.data())
    // console.log(groceryDocs)

    const chartData = groceryDocs.map((d) => {
      // console.log("chartdata")
      return {
        date: new Date(d.created.seconds * 1000),
        total: parseFloat(d.wholeTotal),
      };
    });
    // console.log(chartData, "chartdata");
    setData(chartData);

  };

  useEffect(() => {
    loadGroceries();
  }, []);

  const createGroceryList = async () => {
    // console.log("add");
    const dateCreated = new Date(created);
    const docRef = await addDoc(collection(db, "groceryLists"), {
      created: dateCreated,
      fruit,
      protein,
      vegetable,
      wholeTotal: parseInt(wholeTotal),
    });
    // console.log(docRef);
    // console.log("Document written with ID: ", docRef.id);
    handleCloseAdd();
    loadGroceries();
  };

  const updateDocList = async (groceryLists) => {
    // console.log("update");
    const dateCreated = new Date(changeGroceries[0]);
    const itemColRef = doc(db, groceryLists, currentRow.id);
    const docRef = await updateDoc(itemColRef, {
      created: dateCreated,
      fruit: changeGroceries[1],
      protein: changeGroceries[2],
      vegetable: changeGroceries[3],
      wholeTotal: parseInt(changeGroceries[4]),
    });
    // console.log(changeGroceries);
    // console.log("Document updated with ID: ", currentRow.id);
    handleCloseEdit();
    loadGroceries();
  };

  function handleDelete(groceryLists, row) {
    deleteDocList("groceryLists", row.id);
    loadGroceries();
  }

  function handleChangeCreated(e) {
    setChangeGroceries({
      ...changeGroceries,
      [0]: e.target.value,
    });
  }

  function handleChangeFruit(e) {
    setChangeGroceries({
      ...changeGroceries,
      [1]: e.target.value,
    });
  }

  function handleChangeProtein(e) {
    setChangeGroceries({
      ...changeGroceries,
      [2]: e.target.value,
    });
  }

  function handleChangeVegetable(e) {
    setChangeGroceries({
      ...changeGroceries,
      [3]: e.target.value,
    });
  }

  function handleChangeWholeTotal(e) {
    setChangeGroceries({
      ...changeGroceries,
      [4]: e.target.value,
    });
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);

  const handleOpenEdit = (groceries) => {
    setCurrentRow(groceries);
    let value = columns.map(
      (column) =>
        groceries._document.data.value.mapValue.fields[column.id][column.type]
    );
    // console.log(value);
    setChangeGroceries(value);
    setOpenEdit(true);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  return (
    <>
      <div style={{ marginLeft: "5vw", paddingTop: "3%" }}>
        <span style={{ fontWeight: 700, color: "#402218" }}>
          You have {getGroceries.length}{" "}
          {getGroceries.length > 1 ? "groceries" : "grocery"}
        </span>
        <Button
          style={{ marginLeft: "20px", backgroundColor: "#865439" }}
          variant="contained"
          onClick={handleOpenAdd}
        >
          Add a New Grocery
        </Button>
        <Dialog open={openAdd}>
          <DialogTitle>Add a New Grocery</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="none"
              variant="standard"
              id="datetime-local"
              label="Created"
              type="datetime-local"
              value={created}
              onChange={(e) => setCreated(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="name"
              label="Fruit"
              variant="standard"
              value={fruit}
              onChange={(e) => setFruit(e.target.value)}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="name"
              label="Protein"
              variant="standard"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="name"
              label="Vegetable"
              variant="standard"
              value={vegetable}
              onChange={(e) => setVegetable(e.target.value)}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="number"
              label="Total"
              variant="standard"
              value={wholeTotal}
              onChange={(e) => setWholeTotal(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdd}>Cancel</Button>
            <Button onClick={createGroceryList}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEdit}>
          <DialogTitle>Edit Grocery</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="none"
              variant="standard"
              id="datetime-local"
              label="Created"
              type="datetime-local"
              value={dayjs(changeGroceries[0]).format("YYYY-MM-DDTHH:mm")}
              onChange={handleChangeCreated}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="name"
              label="Fruit"
              variant="standard"
              value={changeGroceries[1]}
              onChange={handleChangeFruit}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="name"
              label="Protein"
              variant="standard"
              value={changeGroceries[2]}
              onChange={handleChangeProtein}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="name"
              label="Vegetable"
              variant="standard"
              value={changeGroceries[3]}
              onChange={handleChangeVegetable}
            />
            <br />
            <TextField
              autoFocus
              margin="none"
              id="number"
              label="Total"
              variant="standard"
              value={changeGroceries[4]}
              onChange={handleChangeWholeTotal}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={() => updateDocList("groceryLists")}>Edit</Button>
          </DialogActions>
        </Dialog>
        <br />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <div>
          <Paper
            sx={{
              width: "110%",
              overflow: "hidden",
              marginLeft: "5vw",
              marginRight: "0",
              marginTop: "30px",
              marginBottom: "0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead sx={{ maxHeight: 200 }}>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          fontWeight: 550,
                          backgroundColor: "#C68B59",
                          color: "#402218",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell
                      id="actions"
                      label="Actions"
                      minwidth="100"
                      align="center"
                      style={{
                        fontWeight: 550,
                        backgroundColor: "#C68B59",
                        color: "#402218",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getGroceries
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          {columns.map((column) => {
                            const value =
                              row._document.data.value.mapValue.fields[
                                column.id
                              ][column.type];
                            const date = new Date(value);
                            const day = date
                              .getDate()
                              .toString()
                              .padStart(2, "0");
                            const month = (date.getMonth() + 1)
                              .toString()
                              .padStart(2, "0"); // month is zero-indexed
                            const year = date.getFullYear();
                            const formattedTime = date.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            );
                            const formattedCreated = `${day}/${month}/${year} ${formattedTime}`;
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.type === "timestampValue"
                                  ? formattedCreated
                                  : column.type === "integerValue"
                                  ? parseInt(value).toLocaleString("id-ID")
                                  : value.toLowerCase()}
                              </TableCell>
                            );
                          })}
                          <TableCell
                            id="actions"
                            label="Actions"
                            minwidth="100"
                            align="center"
                          >
                            <>
                              <Button
                                onClick={() => handleOpenEdit(row)}
                                variant="contained"
                                size="small"
                                style={{ backgroundColor: "#865439" }}
                              >
                                Edit
                              </Button>
                              <Button
                                style={{
                                  marginLeft: "20px",
                                  backgroundColor: "#865439",
                                }}
                                onClick={() =>
                                  handleDelete("groceryLists", row)
                                }
                                variant="contained"
                                size="small"
                              >
                                Delete
                              </Button>
                            </>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={getGroceries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <div
          style={{
            height: "500px",
            justifyContent: "space-between",
            paddingLeft: "14vw",
            paddingTop: "7vh"
          }}
        >
          <Plot
            data={[
              {
                x: data.map(row => row.date),
                y: data.map(row => row.total),
                histfunc: "sum",
                type: "histogram",
                marker: {
                  color: '#C68B59',
                }
              },
            ]}
            layout={{ width: 400, height: 500, title: "Groceries Total Per Month" }}
          />
        </div>
      </div>
    </>
  );
}
