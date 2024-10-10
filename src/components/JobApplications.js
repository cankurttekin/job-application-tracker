
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const JobApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [sortColumn, setSortColumn] = useState('companyName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/job-applications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobApplications(response.data);
    };

    fetchData();
  }, []);

  const handleSort = (column) => {
    setSortColumn(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleRowClick = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent the event from triggering row click
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:8080/api/job-applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:8080/api/job-applications/${selectedApplication.id}`, selectedApplication, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobApplications(prev => 
      prev.map(app => app.id === selectedApplication.id ? selectedApplication : app)
    );
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sortedApplications = [...jobApplications].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredApplications = sortedApplications.filter(app =>
    Object.values(app).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Job Applications</h2>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={styles.searchInput}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            {['Company', 'Title', 'Status', 'Application Date', 'Response Date', 'Platform'].map((column) => (
              <th key={column} onClick={() => handleSort(column)} style={styles.tableHeader}>
                {column.charAt(0).toUpperCase() + column.slice(1)} 
                {sortColumn === column && (
                  <span className="material-icons">
                    {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                )}
              </th>
            ))}
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map(app => (
            <tr key={app.id} style={styles.tableRow} onClick={() => handleRowClick(app)}>
              <td style={styles.tableCell}>{app.companyName}</td>
              <td style={styles.tableCell}>{app.jobTitle}</td>
              <td style={{ ...styles.tableCell, color: getStatusColor(app.status) }}>{app.status}</td>
              <td style={styles.tableCell}>{new Date(app.applicationDate).toLocaleDateString()}</td>
              <td style={styles.tableCell}>{new Date(app.responseDate).toLocaleDateString()}</td>
              <td style={styles.tableCell}>{app.platform}</td>
              <td style={styles.tableCell}>
                <span 
                  className="material-icons"
                  style={styles.deleteIcon} 
                  onClick={(e) => handleDelete(app.id, e)}
                >
                  delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isModalOpen && selectedApplication && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={styles.modal}
          contentLabel="Edit Job Application"
        >
          <h2>Edit Job Application</h2>
          <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              value={selectedApplication.companyName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Job Title:
            <input
              type="text"
              name="jobTitle"
              value={selectedApplication.jobTitle}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Status:
            <input
              type="text"
              name="status"
              value={selectedApplication.status}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Application Date:
            <input
              type="date"
              name="applicationDate"
              value={selectedApplication.applicationDate}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Response Date:
            <input
              type="date"
              name="responseDate"
              value={selectedApplication.responseDate}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Platform:
            <input
              type="text"
              name="platform"
              value={selectedApplication.platform}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSaveChanges}>Save</button>
          <button onClick={closeModal}>Cancel</button>
        </Modal>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Applied':
      return 'blue';
    case 'Interview':
      return 'orange';
    case 'Rejected':
      return 'red';
    case 'Accepted':
      return 'green';
    default:
      return 'black';
  }
};

// CSS-in-JS styles
const styles = {
  container: {
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #ddd',
    cursor: 'pointer',
    backgroundColor: '#f2f2f2',
  },
  tableRow: {
    cursor: 'pointer',
    '&:nth-child(even)': {
      backgroundColor: '#f9f9f9',
    },
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd', 
  },
  deleteIcon: {
    color: 'grey',
    cursor: 'pointer',
  },
  modal: {
    content: {
      padding: '20px',
      width: '500px',
      margin: 'auto',
    }
  }
};

export default JobApplications;
