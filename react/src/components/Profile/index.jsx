import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/profile';
import './styles.css';

function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(token);
        setProfileData(data);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки профиля');
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBackToChat = () => {
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (loading) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-card">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-card">
          <p className="error-message">{error}</p>
          <button onClick={handleBackToChat} className="profile-button">
            Вернуться к чату
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
      <div className="profile-card">
        <h1 className="profile-title">Профиль</h1>
        
        {profileData && (
          <div className="profile-info">
            <div className="profile-field">
              <span className="profile-label">Имя пользователя:</span>
              <span className="profile-value">{profileData.username}</span>
            </div>
            
            <div className="profile-field">
              <span className="profile-label">Дата регистрации:</span>
              <span className="profile-value">{formatDate(profileData.created_at)}</span>
            </div>
          </div>
        )}

        <div className="profile-buttons">
          <button onClick={handleBackToChat} className="profile-button profile-button-primary">
            Вернуться к чату
          </button>
          <button onClick={handleLogout} className="profile-button profile-button-secondary">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;