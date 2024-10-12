import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styled from "styled-components";

const ModalContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: none;
  border: 1px solid #333;
  color: #333;
  font-size: 26px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const StatusCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: ${({ status }) => getStatusBackgroundColor(status)};
  color: white;
  border-radius: 5px;
`;

const StarCell = styled.td`
  cursor: pointer;
`;

const CommentCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const Comment = styled.div`
  padding: 10px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  font-style: oblique;
  position: relative;
`;

const JobApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [sortColumn, setSortColumn] = useState('companyName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

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
    e.stopPropagation();
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

  const handleToggleStar = async (id,e) => {
    e.stopPropagation();
    const updatedApplication = jobApplications.find(app => app.id === id);
    updatedApplication.starred = !updatedApplication.starred;

    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:8080/api/job-applications/${id}`, updatedApplication, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setJobApplications(prev =>
        prev.map(app => app.id === id ? updatedApplication : app)
    );
  };

  const handleToggleComments = (id, e) => {
    e.stopPropagation();
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id],
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
            <th></th>
            {['Company', 'Position', 'Status', 'Application Date', 'Response Date', 'Platform', 'Url', 'Comments'].map((column) => (
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
              <React.Fragment key={app.id}>
                <tr style={styles.tableRow} onClick={() => handleRowClick(app)}>
                  <StarCell onClick={(e) => handleToggleStar(app.id, e)}>
                    {app.starred ? (
                        <span className="material-icons" style={{color: 'gold'}}>star</span>
                    ) : (
                        <span className="material-icons">star_border</span>
                    )}
                  </StarCell>
                  <td style={styles.tableCell}>{app.companyName}</td>
                  <td style={styles.tableCell}>{app.jobTitle}</td>
                  <StatusCell status={app.status}>
                    {app.status}
                  </StatusCell>
                  <td style={styles.tableCell}>{new Date(app.applicationDate).toLocaleDateString()}</td>
                  <td style={styles.tableCell}>{new Date(app.responseDate).toLocaleDateString()}</td>
                  <td style={styles.tableCell}>{app.platform}</td>
                  <td style={styles.tableCell}>
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                      {app.jobUrl.length > 15 ? `${app.jobUrl.substring(12, 38)}...` : app.jobUrl}
                    </a>
                  </td>
                  <CommentCell onClick={(e) => handleToggleComments(app.id, e)}>
                    {expandedComments[app.id] ? 'Hide' : 'Show'}
                  </CommentCell>
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
                {expandedComments[app.id] && (
                    <tr>
                      <td colSpan="8" style={styles.commentRow}>
                        {/* Display comments here */}
                        {app.comments.length > 0 ? (
                            <Comment>{app.comments}</Comment>

                        ) : (
                            <Comment>No comments available.</Comment>
                        )}
                        {/* a form can be added to add new comments here */}
                      </td>
                    </tr>
                )}
              </React.Fragment>
          ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {isModalOpen && selectedApplication && (
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{
                  overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                  content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                  },
                }}
            >
              <CloseButton onClick={closeModal}>×</CloseButton>
              <ModalContent>
                <h2>Edit Job Application</h2>
                <label>
                  Company Name:
                  <Input
                      type="text"
                      name="companyName"
                      value={selectedApplication.companyName}
                      onChange={handleInputChange}
                  />
                </label>
                <label>
                  Position:
                  <Input
                      type="text"
                      name="jobTitle"
                      value={selectedApplication.jobTitle}
                      onChange={handleInputChange}
                  />
                </label>
                <label>
                  Status:
                  <Input
                      type="text"
                      name="status"
                      value={selectedApplication.status}
                      onChange={handleInputChange}
                  />
                </label>
                <label>
                  Application Date:
                  <Input
                      type="date"
                      name="applicationDate"
                      value={new Date(selectedApplication.applicationDate).toISOString().split('T')[0]}
                      onChange={handleInputChange}
                  />
                </label>
                <label>
                  Response Date:
                  <Input
                      type="date"
                      name="responseDate"
                      value={new Date(selectedApplication.responseDate).toISOString().split('T')[0]}
                      onChange={handleInputChange}
                  />
                </label>
                <label>
                  Platform:
                  <Input
                      type="text"
                      name="platform"
                      value={selectedApplication.platform}
                      onChange={handleInputChange}
                  />
                </label>
                <label>
                  Job URL:
                  <Input
                      type="url"
                      name="jobUrl"
                      value={selectedApplication.jobUrl}
                      onChange={handleInputChange}
                  />
                </label>
                <label>
                  Comments:
                  <Input
                      type="text"
                      name="comments"
                      value={selectedApplication.comments}
                      onChange={handleInputChange}
                  />
                </label>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </ModalContent>
            </Modal>
        )}
      </div>
  );
};

// Function to get background color based on status
const getStatusBackgroundColor = (status) => {
  switch (status.toLowerCase()) {
    case 'applied':
      return '#7F8C8D';
    case 'interview':
      return '#E67E22';
    case 'rejected':
      return '#C0392B';
    case 'ats reject':
      return '#E74C3C';
    case 'hired':
      return '#2ECC71';
    default:
      return 'grey';
  }
};

const styles = {
  container: {
    margin: '20px',
  },
  header: {
    textAlign: 'center',
  },
  searchInput: {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    cursor: 'pointer',
    //backgroundColor: '#333',
    color: '#333',
    padding: '10px',
  },
  tableRow: {
    cursor: 'pointer',
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
  commentRow: {
    backgroundColor: '#f9f9f9',
  },
};

export default JobApplications;
