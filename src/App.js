import React, { useState, useEffect } from "react";
import { TreeDataState, CustomTreeData } from "@devexpress/dx-react-grid";
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableTreeColumn
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import classNames from "classnames";

import { Loading } from "./components/loading";
import sampleData from "./sampleData.json";

import AChildComponent from "./components/AChildComponent";
import "./styles.css";

const ROOT_ID = -1;

const getRowId = row => row.itemId;
const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(
    r => r.parentId === (row ? row.itemId : ROOT_ID)
  );
  if (childRows.length) {
    return childRows;
  }
  return row && row.fileType === "FOLDER" ? [] : null;
};

const ExpandButton = ({ expanded, visible, onToggle }) => {
  return (
    <span
      className={classNames({
        "mr-3 oi": true,
        "oi-folder": !expanded,
        "oi-envelope-open": expanded,
        "d-none": !visible
      })}
      /* onClick={e => {
        e.stopPropagation();
        onToggle();
      }} */
    />
  );
};

const handleClick = obj => {
  console.log(obj);
};

const App = () => {
  const [columns] = useState([
    {
      name: "name",
      title: "Name",
      getCellValue: row => {
        return row.fileType !== "FOLDER" ? (
          <AChildComponent name={row.name} onClick={handleClick}>
            {row}
          </AChildComponent>
        ) : (
          <a
            href="# "
            className="parent-row"
            onClick={e => expandRowById(row.itemId)}
          >
            {row.name}
          </a>
        );
      }
    },
    {
      name: "size",
      title: "Size",
      getCellValue: row => (row.size ? `${Math.ceil(row.size / 1024)} KB` : "")
    },
    {
      name: "fileType",
      title: "Type"
    },
    {
      name: "createdOn",
      title: "Timestamp",
      getCellValue: row =>
        row.createdOn === -1
          ? null
          : new Date(row.createdOn).toLocaleString("en-US")
    }
  ]);
  const [data, setData] = useState([]);
  const [tableColumnExtensions] = useState([
    { columnName: "Name", width: "25%" },
    { columnName: "Size", width: "25%", align: "right" },
    { columnName: "Type", width: "25%" },
    { columnName: "Timestamp", width: "25%" }
  ]);
  const [expandedRowIds, setExpandedRowIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIcon, setShowIcon] = useState("[+]");

  const folderIds = [];

  const loadData = () => {
    const rowIdsWithNotLoadedChilds = [ROOT_ID, ...expandedRowIds].filter(
      rowId => data.findIndex(row => row.parentId === rowId) === -1
    );
    if (rowIdsWithNotLoadedChilds.length) {
      if (loading) return;
      setLoading(true);
      Promise.all(
        rowIdsWithNotLoadedChilds.map(rowId =>
          sampleData.filter(data => data.parentId === rowId)
        )
      )
        .then(loadedData => {
          setData(data.concat(...loadedData));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (!loading) {
      loadData();
    }
  });

  const expandAllRows = () => {
    let expIds = [];
    if (expandedRowIds.length === 0) {
      sampleData.forEach(element => {
        if (element.fileType === "FOLDER") {
          expIds.push(element.itemId);
        }
      });
      setShowIcon("[–]");
      setExpandedRowIds(expIds);
    } else {
      setShowIcon("[+]");
      setExpandedRowIds([]);
    }
  };

  const expandRowById = itemId => {
    const index = folderIds.indexOf(itemId);
    if (index > -1) {
      folderIds.splice(index, 1);
    } else {
      folderIds.push(itemId);
    }
    setExpandedRowIds([...folderIds]);
  };

  const tableHeaderCell = props => {
    const { column } = props;
    return column.name === "name" ? (
      <TableHeaderRow.Cell {...props}>
        {column.title}{" "}
        <a href="# " className="expand-all" onClick={expandAllRows}>
          {showIcon}
        </a>
      </TableHeaderRow.Cell>
    ) : (
      <TableHeaderRow.Cell {...props} />
    );
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      <Grid rows={data} columns={columns} getRowId={getRowId}>
        <TreeDataState
          expandedRowIds={expandedRowIds}
          onExpandedRowIdsChange={setExpandedRowIds}
        />
        <CustomTreeData getChildRows={getChildRows} />
        <VirtualTable columnExtensions={tableColumnExtensions} />
        <TableHeaderRow cellComponent={tableHeaderCell} />
        <TableTreeColumn for="name" expandButtonComponent={ExpandButton} />
      </Grid>
      {loading && <Loading />}
    </div>
  );
};

export default App;
