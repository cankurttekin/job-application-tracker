import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styled from "styled-components";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL+'/api';

const StatusCell = styled.td`
  padding: 10px;
  border: 0px solid #ddd;
  background-color: ${({ status }) => getStatusBackgroundColor(status)};
  color: white;
  border-radius: 0px;
`;

const StarCell = styled.td`
  cursor: pointer;
`;

const CommentCell = styled.td`
  padding: 10px;
  //border: 1px solid #ddd;
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
  const [sortColumn, setSortColumn] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/job-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setJobApplications(response.data);
        } else {
          setJobApplications([]); // set to an empty array if the response is empty
        }
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };
    fetchData();
  }, []);

  const columnMap = {
    Company: 'companyName',
    Position: 'jobTitle',
    Status: 'status',
    'Application Date': 'applicationDate',
    'Response Date': 'responseDate',
    Platform: 'platform',
    Url: 'jobUrl',
    Comments: 'comments',
  };


  const handleSort = (column) => {
    const dataKey = columnMap[column]; // Get the corresponding data key
    setSortColumn(dataKey);
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
    await axios.delete(`${REACT_APP_BACKEND_URL}/job-applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    await axios.put(`${REACT_APP_BACKEND_URL}/job-applications/${selectedApplication.id}`, selectedApplication, {
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
    await axios.put(`${REACT_APP_BACKEND_URL}/job-applications/${id}`, updatedApplication, {
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
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredApplications = sortedApplications.filter(app =>
      Object.values(app).some(value =>
          value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
      )
  );

  return (
      <div style={styles.container}>
        <h2 style={styles.header}>Job Applications</h2>
        <input
            type="text"
            placeholder="Search anything..."
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
                  {sortColumn === columnMap[column] && (
                      <span className="material-icons" style={{fontSize: '16px', marginLeft: '4px'}}>
            {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
                  )}
                </th>
            ))}
            <th></th>
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
                      {app.jobUrl.length > 15 ? `${app.jobUrl.substring(0, 20)}...` : app.jobUrl}
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
                        {app.comments && app.comments.length > 0 ? (
                            <Comment>{app.comments}</Comment>
                        ) : (
                            <Comment>No comments available.</Comment>
                        )}
                        {/* A form can be added to add new comments here */}
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
                    padding: '20px',
                    borderRadius: '10px',
                    //backgroundColor: '#f5f5f5',
                    backgroundColor: '#ffffff',
                    color: '#333',
                  },
                }}
            >

              <modal-content>
                <close-button onClick={closeModal}>&times;</close-button>
                <h2 style={styles.header}>Edit Job Application</h2>
                <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={selectedApplication.companyName}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={selectedApplication.jobTitle}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    value={selectedApplication.status}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="applicationDate"
                    placeholder="Application Date"
                    value={new Date(selectedApplication.applicationDate).toISOString().split('T')[0]}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="responseDate"
                    placeholder="Response Date"
                    value={new Date(selectedApplication.responseDate).toISOString().split('T')[0]}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="platform"
                    placeholder="Platform"
                    value={selectedApplication.platform}
                    onChange={handleInputChange}
                />
                <input
                    type="url"
                    name="jobUrl"
                    placeholder="Job Url"
                    value={selectedApplication.jobUrl}
                    onChange={handleInputChange}
                />
                <textarea
                    placeholder="Description"
                    value={selectedApplication.description}
                    onChange={handleInputChange}
                    rows="4"
                />
                <textarea
                    name="comments"
                    placeholder="Comments"
                    rows="4"
                    value={selectedApplication.comments}
                    onChange={handleInputChange}
                />
                <button onClick={handleSaveChanges}>Save Changes</button>
              </modal-content>
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
    case 'interviewing':
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
    marginBottom: '10px',
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
    textAlign: 'left',
  },
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  tableCell: {
    padding: '10px',
    //border: '1px solid #ddd',
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
