import React, { useState } from "react";
import { Table, Dropdown } from "react-bootstrap";
import colors from "../../config/colors";
import Spinner from "react-bootstrap/Spinner";
const MyTable = ({ data, onActionClick, loading, isprogress }) => {
  const [actionState, setActionState] = useState({});

  const handleDropdownSelect = (rowId, eventKey) => {
    setActionState((prev) => ({ ...prev, [rowId]: eventKey }));
    onActionClick(rowId, eventKey);
  };
  return (
    <div style={{ padding: "20px" }}>
      <Table striped hover>
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: colors.primary,
                borderTopLeftRadius: "10px",
                color: colors.white,
              }}
            >
              Name
            </th>
            <th
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              Email
            </th>
            <th
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              INS. Type
            </th>
            <th
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              INS. Company
            </th>
            <th
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              Status
            </th>
            <th
              style={{
                backgroundColor: colors.primary,
                borderTopRightRadius: "10px",
                color: colors.white,
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row?.user.name}</td>
              <td>{row.user.email}</td>
              <td>{row.policy?.policyType}</td>
              <td>{row.policy?.motherCompany}</td>
              <td>
                {row.status === "accepted"
                  ? "valid"
                  : row.status === "declined"
                  ? "invalid"
                  : "inProgress"}
              </td>
              <td>
                <Dropdown
                  onSelect={(eventKey) => handleDropdownSelect(row, eventKey)}
                >
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    size="sm"
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Action"
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="View">View</Dropdown.Item>
                    {isprogress && (
                      <>
                        <Dropdown.Item eventKey="Accept">Accept</Dropdown.Item>
                        <Dropdown.Item eventKey="Decline">
                          Decline
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyTable;
