import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {

    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem('chat-user-info'));
    const token = storedUser.token;

    const [username, setUsername] = useState(storedUser.username);
    const [preview, setPreview] = useState(storedUser.profilePicture || '');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setSuccess(false);

            const formData = new FormData();
            formData.append('username', username);
            if (image) formData.append('profilePicture', image);

            const res = await axios.put(
                'http://localhost:5000/api/auth/profile',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.setItem('chat-user-info', JSON.stringify(res.data));
            setSuccess(true);
        } catch (err) {
            alert('Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <button className="back-button" onClick={() => navigate('/')}>
          ← <span>Back to Chat</span>
        </button>
            <div className="profile-card">
                
                <div className="profile-avatar">
                    {preview ? (
                        <img
                            src={
                                preview.startsWith('blob:')
                                    ? preview
                                    : preview.startsWith('http')
                                        ? preview
                                        : `http://localhost:5000${preview}`
                            }
                            alt="profile"
                        />
                    ) : (
                        <div className="profile-letter">
                            {username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <label className="avatar-edit">
                        Change
                        <input type="file" hidden onChange={handleImageChange} />
                    </label>
                </div>


                <h2>{username}</h2>
                <p className="email">{storedUser.email}</p>

                {success && <p className="success">Profile updated successfully ✔</p>}

                <div className="field">
                    <label>Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <button onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </div>
        </div>
    );
};

export default Profile;
