import React, { useState } from "react";
import "./MarksTable.scss";
import DataTable from "react-data-table-component";
import { MdSearch, MdCheck, MdDelete, MdSend } from "react-icons/md";
export default function marksTable({ isAction }) {
  const handleMouseEnter = (row) => {
    const style = {
      backgroundColor: "var(--blue)",
      color: "var(--white)",
    };
    row.style = style;
  };

  const handleMouseLeave = (row) => {
    delete row.style;
  };

  const conditionalStyles = [
    {
      when: (row) => !!row.style,
      style: (row) => row.style,
    },
  ];

  const columns = [
    {
      name: "Sl no",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Session",
      selector: (row) => row.session,
      sortable: true,
    },
    {
      name: "Semester",
      selector: (row) => row.semester,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  const data = [
    {
      id: 1,
      session: "2022-23",
      semester: "4th",
      department: "CSE",
      status: "Approved",
    },
    {
      id: 2,
      session: "2022-21",
      semester: "4th",
      department: "PPT",
      status: "Approved",
    },
    {
      id: 3,
      session: "2022-23",
      semester: "4th",
      department: "CIVIL",
      status: "Approved",
    },
    {
      id: 4,
      session: "2022-23",
      semester: "3rd",
      department: "CSE",
      status: "Approved",
    },
  ];

  const actions = {
    name: "Actions",
    cell: (row) => (
      <>
        <MdCheck
          size={20}
          color={"#0F9D58"}
          style={{ marginRight: "5px" }}
          onClick={() => handleEdit(row)}
        />
        <MdDelete
          size={20}
          color={"#DB4437"}
          style={{ marginRight: "5px" }}
          onClick={() => handleDelete(row)}
        />
        <MdSend size={20} color={"#4285F4"} style={{ marginRight: "5px" }} />
      </>
    ),
  };

  const [records, setRecords] = useState(data);
  const handleFilter = (e) => {
    const newData = data.filter((row) => {
      const searchTerm = e.target.value.toLowerCase();
      return Object.values(row).some(
        (val) =>
          typeof val === "string" && val.toLowerCase().includes(searchTerm)
      );
    });
    console.log(newData);
    setRecords(newData);
  };

  return (
    <div>
      <div className="filters">
        <div className="filter">
          <label htmlFor="">Search: </label>
          <input type="text" onChange={handleFilter} />
          <MdSearch />
        </div>
      </div>
      <DataTable
        responsive={true}
        columns={isAction ? [...columns, actions] : columns}
        data={records}
        fixedHeader
        pagination
        onRowClicked={(row, e) => console.log(row)}
        onRowMouseEnter={handleMouseEnter}
        onRowMouseLeave={handleMouseLeave}
        conditionalRowStyles={conditionalStyles}
      ></DataTable>
    </div>
  );
}
