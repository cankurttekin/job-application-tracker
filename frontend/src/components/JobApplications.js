// THIS MESS NEEDS REFACTORING ASAP
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styled from "styled-components";
import { REACT_APP_BACKEND_URL } from '../config';

const statusIcons = {
  Applied: 'schedule',
  Interviewing: 'work',
  Rejected: 'cancel',
  Offered: 'check_circle',
  Hired: 'done',
};

const StatusCell = styled.td`
  color: #494742;
  padding: 10px;
`;

const PlatformCell = styled.td`
  padding: 10px;
  color: white;
`;

const CommentCell = styled.td`
  padding: 10px;
  color: grey;
`;

// Wrapper for text with background color
const TextWrapper = styled.span`
  background-color: ${({ color }) => color};
  border-radius: 26px;
  padding: 5px 10px;
  display: inline-block;
`;



const Comment = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  font-style: oblique;
  position: relative;
`;

const getStatusBackgroundColor = (status) => {
  switch (status.toLowerCase()) {
    case 'applied':
      return '#fdecc8';
    case 'interviewing':
    case 'interview':
      return '#fadec9';
    case 'rejected':
      return '#ffe2dd';
    case 'ats reject':
      return '#b64c49';
    case 'hired':
      return '#dbeddb';
    default:
      return '#e6e6e4';
  }
};

const getPlatformBackgroundColor = (platform) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return '#0A66C2';
    case 'kariyer':
    case 'kariyer.net':
    case 'kariyernet':
      return '#8316b5';
    case 'indeed':
      return '#003a9b';
    case 'glassdoor':
      return '#0caa41';
    case 'mail':
    case 'email':
    case 'e-mail':
      return 'grey';
    default:
      return 'black';
  }
};

const JobApplicationsContainer = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  @media (max-width: 768px) {
    display: none;
  }
`;

const KanbanBoard = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  searchInput: {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '26px',
    border: '1px solid #ebebea',
    width: '100%',
  },
  tableHeader: {
    cursor: 'pointer',
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
    border: '1px solid #ebebea',
  },
  deleteIcon: {
    color: 'grey',
    cursor: 'pointer',
  },
  commentRow: {
    backgroundColor: '#f9f9f9',
  },
};

const Column = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 10px;
  border-radius: 8px;
`;

const Header = styled.h3`
  text-align: left;
  background-color: ${({ color }) => color};
  color: #494742;
  padding-left: 8px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-weight: normal;
`;

const KanbanCard = styled.div`
  border: 1px solid #ebebea;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Card = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    background: #ffffff;
    border: 1px solid #ebebea;
    border-radius: 10px;
    margin-bottom: 15px;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CardField = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 16px;
`;

const JobApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [sortColumn, setSortColumn] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'board'

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

  const handleToggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'board' : 'table');
  };

  const handleSort = (column) => {
    const dataKey = columnMap[column]; // Get the data key
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

  // Adjusted render for dates to display empty if null or invalid
  const renderDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

  return (
        <JobApplicationsContainer>
        <h2 style={styles.header}>Job Applications</h2>
        <input
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
        />
          <button onClick={handleToggleViewMode}>
            Table/Board
          </button>
          {viewMode === 'table' ? (
              filteredApplications.map((app) => (
                  <Card key={app.id} onClick={() => handleRowClick(app)}>
                    <div style={{cursor:"pointer"}} starred={app.starred} onClick={(e) => handleToggleStar(app.id, e)}>
                      {app.starred ? (
                          <span className="material-icons" style={{color: 'gold'}}>star</span>
                      ) : (
                          <span className="material-icons">star_border</span>
                      )}

                    </div>
                    <CardField>
                      <div className="label">Company:</div>
                      <div className="value">{app.companyName}</div>
                    </CardField>
                    <CardField>
                      <div className="label">Position:</div>
                      <div className="value">{app.jobTitle}</div>
                    </CardField>
                    <CardField>
                      <div className="label">Status:</div>
                      <StatusCell>
                        <TextWrapper color={getStatusBackgroundColor(app.status)}>
                          {app.status}
                        </TextWrapper>
                      </StatusCell>
                    </CardField>
                    <CardField>
                      <div className="label">Application Date:</div>
                      <div className="value">{new Date(app.applicationDate).toLocaleDateString()}</div>
                    </CardField>
                    <CardField>
                      <div className="label">Response Date:</div>
                      <div className="value">
                        {app.responseDate ? new Date(app.responseDate).toLocaleDateString() : '-'}
                      </div>
                    </CardField>
                    <CardField>
                      <div className="label">Platform:</div>
                      <PlatformCell>
                        <TextWrapper color={getPlatformBackgroundColor(app.platform)}>
                          {app.platform}
                        </TextWrapper>
                      </PlatformCell> </CardField>
                    <CardField>
                      <div className="label">Comments:</div>
                      <div className="value" onClick={(e) => handleToggleComments(app.id, e)}>
  <span className="material-icons" >
    {expandedComments[app.id] ? 'visibility_off' : 'visibility'}
  </span>

                      </div>
                    </CardField>
                    {expandedComments[app.id] && (
                        <div style={styles.commentRow}>
                          {app.comments || 'No comments available.'}
                        </div>
                    )}
                    <span
                        className="material-icons"
                        style={styles.deleteIcon}
                        onClick={(e) => handleDelete(app.id, e)}
                    >
                    delete
                  </span>
                  </Card>
              ))
          ) : (
                  <div >
                  </div>
          )}

          {viewMode === 'table' ? (


        <Table>
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
                  <td onClick={(e) => handleToggleStar(app.id, e)}>
                    {app.starred ? (
                        <span className="material-icons" style={{color: 'gold'}}>star</span>
                    ) : (
                        <span className="material-icons">star_border</span>
                    )}
                  </td>
                  <td style={styles.tableCell}>{app.companyName}</td>
                  <td style={styles.tableCell}>{app.jobTitle}</td>
                  <StatusCell>
                    <TextWrapper color={getStatusBackgroundColor(app.status)}>
                      {app.status}
                    </TextWrapper>
                  </StatusCell>
                  <td style={styles.tableCell}>{renderDate(app.applicationDate)}</td>
                  <td style={styles.tableCell}>{renderDate(app.responseDate)}</td>
                  <PlatformCell>
                    <TextWrapper color={getPlatformBackgroundColor(app.platform)}>
                      {app.platform}
                    </TextWrapper>
                  </PlatformCell>
                  <td style={styles.tableCell}>
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                      {app.jobUrl.length > 15 ? `${app.jobUrl.substring(0, 20)}...` : app.jobUrl}
                    </a>
                  </td>
                  <CommentCell onClick={(e) => handleToggleComments(app.id, e)}>
  <span className="material-icons" style={styles.icon}>
    {expandedComments[app.id] ? 'visibility' : 'visibility_off'}
  </span>
                  </CommentCell>
                  <td>
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
                      </td>
                    </tr>
                )}
              </React.Fragment>
          ))}
          </tbody>
        </Table>
          ) : (
              <KanbanBoard>
                {['Applied', 'Interviewing', 'Rejected', 'Offered', 'Hired'].map(status => (
                    <Column key={status}>
                      <Header color={getStatusBackgroundColor(status)}                      >
            <span style={{ display: 'flex', alignItems: 'center' }}>
<span className="material-icons" style={{ fontSize: '1rem', marginRight: '8px' }}>
      {statusIcons[status]}
    </span>
              {status}
            </span>
                      </Header>
                      {filteredApplications.filter(app => app.status.toLowerCase() === status.toLowerCase())
                          .map(app => (
                              <KanbanCard key={app.id}>
                                <div><strong>Company:</strong> {app.companyName}</div>
                                <div><strong>Position:</strong> {app.jobTitle}</div>
                                <div><strong>Application Date:</strong> {renderDate(app.applicationDate)}</div>
                              </KanbanCard>
                          ))}
                    </Column>
                ))}

                {/* Column for 'Others' */}
                <Column key="Others">
                  <Header style={{backgroundColor:"black", color:"white"}}>Others</Header>
                  {filteredApplications.filter(app => !['Applied', 'Interviewing', 'Rejected', 'Hired'].includes(app.status))
                      .map(app => (
                          <KanbanCard key={app.id}>
                            <div><strong>Company:</strong> {app.companyName}</div>
                            <div><strong>Position:</strong> {app.jobTitle}</div>
                            <div><strong>Application Date:</strong> {renderDate(app.applicationDate)}</div>
                            <div><strong>Status:</strong> <span style={{
                              backgroundColor: getStatusBackgroundColor(app.status),
                              color: 'white',
                              padding: '3px 8px',
                              borderRadius: '8px'
                            }}>{app.status}</span></div>

                          </KanbanCard>
                      ))}
                </Column>
              </KanbanBoard>
          )}


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
        </JobApplicationsContainer>
  );
};

export default JobApplications;
