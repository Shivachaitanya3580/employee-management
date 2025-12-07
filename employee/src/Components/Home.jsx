import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import { API_URL } from "../config";

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    AdminRecords();
  }, []);

  const AdminRecords = () => {
    axios.get(`${API_URL}/auth/admin_records`).then((result) => {
    // axios.get(`http://localhost:4000/auth/admin_records`).then((result) => {
      if (result.data.Status) {
        setAdmins(result.data.Result);
      } else {
        toast.error(result.data.Error);
      }
    });
  };

  const adminCount = () => {
    axios.get(`${API_URL}/auth/admin_count`).then((result) => {
    // axios.get(`http://localhost:4000/auth/admin_count`).then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const employeeCount = () => {
    axios.get(`${API_URL}/auth/employee_count`).then((result) => {
    // axios.get(`http://localhost:4000/auth/employee_count`).then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const salaryCount = () => {
    axios.get(`${API_URL}/auth/salary_count`).then((result) => {
    // axios.get(`http://localhost:4000/auth/salary_count`).then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOfEmp);
      } else {
        toast.error(result.data.Error);
      }
    });
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setNewEmail(admin.email);
    setNewPassword("");
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    if (!newEmail) {
      toast.error("Email is required");
      return;
    }

    const data = {
      email: newEmail,
      password: newPassword || undefined,
    };

    axios
      .put(`${API_URL}/auth/edit-admin/${selectedAdmin.id}`, data)
      // .put(`http://localhost:4000/auth/edit-admin/${selectedAdmin.id}`, data)
      .then((result) => {
        if (result.data.Status) {
          toast.success("Admin updated successfully!");
          AdminRecords();
          setShowModal(false);
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch((err) => toast.error("Error updating admin: " + err.message));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const deleteAdmin = (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (confirmation) {
      axios
        .delete(`${API_URL}/auth/delete-admin/${id}`)
        // .delete(`http://localhost:4000/auth/delete-admin/${id}`)
        .then((result) => {
          if (result.data.Status) {
            toast.success("Admin deleted successfully!");
            AdminRecords();
          } else {
            toast.error(result.data.Error);
          }
        })
        .catch((err) => toast.error("Error deleting admin: " + err.message));
    }
  };

  return (
    <div>
      <div className="p-3 d-flex flex-column flex-sm-row justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-100 w-sm-25 mb-3 mb-sm-0">
          <div className="text-center pb-1">
            <h4>ADMIN</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-100 w-sm-25 mb-3 mb-sm-0">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border shadow-sm w-100 w-sm-25">
          <div className="text-center pb-1">
            <h4>Salary</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{salaryTotal}₹</h5>
          </div>
        </div>
      </div>

      <div className="mt-4 px-3 px-md-5 pt-3">
        <h3>List Of Admins</h3>
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.email}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleEdit(a)}
                    >
                      <i className="bi bi-pencil d-inline d-md-none"></i>
                      <span className="d-none d-md-inline">EDIT</span>
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => deleteAdmin(a.id)}
                    >
                      <i className="bi bi-trash d-inline d-md-none"></i>
                      <span className="d-none d-md-inline">DELETE</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="w-100">
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password (optional)</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (leave blank to keep unchanged)"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
