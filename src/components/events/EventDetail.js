// src/components/events/EventDetail.jsx
import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import axios from '../../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import './EventDetail.css'; 
import Modal from  '../modal/Modal';


const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [showModal, setShowModal] = useState(false);

  let currentUserEmail = '';
  if (token) {
    const decodedToken = jwtDecode(token);
    currentUserEmail = decodedToken.sub; // Adjust this if your payload has a different key for email
  }

  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvent(response.data);
      } catch (error) {
        toast.error('Error fetching event details. Please try again.'); // Error notification
       // console.error('Error fetching event details', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEventDetails();
  }, [id, token]);

  const handleDelete = async () => {
      try {
        await axios.delete(`/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Event deleted successfully!', {
          autoClose: 1000, // Close after 2 seconds
          hideProgressBar: false, // Show progress bar
        });

        setTimeout(() => {
          navigate('/events');
        }, 1500); 
        // Redirect to events list after deletion
      } catch (error) {
        toast.error('Error deleting event. Please try again.'); // Error notification
        console.error('Error deleting event', error);
      }
  };

  if (loading) return <p>Loading event...</p>;

  const handleBack = () => {
    navigate('/events'); // Navigate to the dashboard
  };

  return (
    <div className="event-detail">
      <h2>Event Details</h2> {/* Added header for event details */}
      <p><strong>Title:</strong> {event.title}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <h4>Creator Details</h4> {/* Header for creator details */}
      <div className="creator-details">
        {event.creator && ( // Check if creator exists
          <>
            <p><strong>Name:</strong> {event.creator.name}</p> {/* Displaying name */}
            <p><strong>Email:</strong> {event.creator.email}</p> {/* Displaying email */}
          </>
        )}
      </div>
      {currentUserEmail === event.creator.email && ( // Assuming event data contains creatorEmail
        <div className="button-group">
          <button onClick={() => navigate(`/events/${id}/edit`, { state: { event } })}>Edit</button>
          <button onClick={() => setShowModal(true)}>Delete</button>
        </div>
      )}
      <button onClick={handleBack}>Back</button> 
      <ToastContainer /> 
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)} // Close modal
        onConfirm={() => {
          handleDelete();
          setShowModal(false); // Close modal after confirming
        }}
      />
    </div>
  );
};

export default EventDetail;
