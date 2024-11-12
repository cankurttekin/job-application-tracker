import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { REACT_APP_BACKEND_URL } from '../config';
import {AuthContext} from "../contexts/AuthContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 10px;
`;

const FormatButton = styled.button`
  margin-bottom: 10px;
`;

const ExportData = () => {
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    const handleExport = async (format) => {
        try {
            const token = localStorage.getItem("token");
            //const response = await axios.get(`/api/export?format=${format}`, {
            const response = await axios.get(`${REACT_APP_BACKEND_URL}/export/csv`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            // Construct a filename with username, current date, and time
            const currentDateTime = new Date().toISOString().replace(/[:.]/g, '-'); // Replace ":" and "." to avoid filename issues
            const fileName = `ATSFS_${user || 'user'}_${currentDateTime}.${format}`;

            // Create a URL for the blob and download it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}`); // Set the filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Error exporting data. Please try again.');
            console.error('Export error:', error);
        }
    };

    return (
        <Container>
            <Title>Export Your Data</Title>
            <p>Choose the format you would like to export your data:</p>
            <FormatButton onClick={() => handleExport('csv')}>CSV</FormatButton>
            Will be implemented:
            <FormatButton onClick={() => handleExport('pdf')}>PDF</FormatButton>
            <FormatButton onClick={() => handleExport('json')}>JSON</FormatButton>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Container>
    );
};

export default ExportData;
