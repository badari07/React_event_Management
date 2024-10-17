// src/components/events/EventForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import './EventForm.css';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  const locationObj = useLocation();

  const event = locationObj.state?.event;

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setEventLocation(event.location);
      setDate(event.date);
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('No token found. User might not be logged in.');
      return; // Handle this case appropriately
    }

    setLoading(true); 
    try {
      let eventId;

      if (event) {
        // Update event logic
        const response = await axios.put(`http://localhost:8080/events/${event.id}`, {
          title,
          description,
          location: eventLocation,
          date,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        eventId = response.data.id; 
        toast.success('Event updated successfully!', {
          autoClose: 1000, // Close after 2 seconds
          hideProgressBar: false, // Show progress bar
        });
        setTimeout(() => {
          navigate(`/events/${eventId}`);
        }, 1200);
      } else {
        // Create new event logic
        const response = await axios.post('http://localhost:8080/events', {
          title,
          description,
          location: eventLocation,
          date,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        eventId = response.data.id;
        toast.success('Event created successfully!', {
          autoClose: 1000, // Close after 2 seconds
          hideProgressBar: false, // Show progress bar
        });
        setTimeout(() => {
          navigate('/events');
        }, 1200);
      }
     
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving event. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleBack = () => {
    navigate('/events'); // Navigate to the dashboard
  };

  return (
    <>
     <h2>{event ? 'Update Event' : 'Create Event'}</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="text"
        value={eventLocation}
        onChange={(e) => setEventLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (event ? 'Update' : 'Create')} Event
        </button>
        <button type="button" onClick={handleBack}>Cancel</button> 
    </form>
   
    <ToastContainer /> 
    </>
  );
};

export default EventForm;
