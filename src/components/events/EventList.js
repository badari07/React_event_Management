// src/components/events/EventList.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import './EventList.css';

const EventList = () => {
  const { isLoggedIn } = useContext(AuthContext); 
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      //const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/events', {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });
        setEvents(response.data);
      } catch (error) {
        setError('Error fetching events. Please try again later.');
        console.error('Error fetching events', error);
      }finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search term
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="event-list-container">
      <h1>Event List</h1>
      {isLoggedIn && (
        <Link to="/events/new">
          <button className="create-button">Create New Event</button>
        </Link>
      )}
      <input
      className="search-input"
        type="text"
        placeholder="Search by title or location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredEvents.length > 0 ? (
        <ul className="event-list">
          {filteredEvents.map(event => (
            <li key={event.id} className="event-item">
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              {isLoggedIn && (
                <Link to={`/events/${event.id}`} className="details-link">View Details</Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventList;
