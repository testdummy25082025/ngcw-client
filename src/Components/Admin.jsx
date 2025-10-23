// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaSignOutAlt, FaUser, FaUsers, FaCalendar, FaBlog, FaBars, FaTimes, FaPlus } from 'react-icons/fa';
// import axios from 'axios';

// const Admin = () => {
//   const [activeView, setActiveView] = useState('user');
//   const [admins, setAdmins] = useState([]);
//   const [bloggers, setBloggers] = useState([]);
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('');
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [blogs, setBlogs] = useState([]);
//   const [blogInput, setBlogInput] = useState({ title: '', snippet: '', Description: '', image: null, imagePreview: null });
//   const [events, setEvents] = useState([]);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const user = JSON.parse(localStorage.getItem('user')) || null;
//   const [editable, setEditable] = useState(false);
//   const [editData, setEditData] = useState({ username: '', email: '', role: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [backgroundLoading, setBackgroundLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // New states for navbar and modals
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [showBlogModal, setShowBlogModal] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Expanded states for read more functionality
//   const [expandedEvents, setExpandedEvents] = useState({});
//   const [expandedBlogs, setExpandedBlogs] = useState({});

//   // API base URL
//   const API_BASE = 'http://localhost:5000/api';
//   const SERVER_BASE = 'http://localhost:5000';
  
//   // Get auth token
//   const token = localStorage.getItem('token');

//   // ✅ Create axios instance with useMemo to prevent recreation
//   const axiosAuth = React.useMemo(() => axios.create({
//     baseURL: API_BASE,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   }), [token]);

//   // ✅ Use refs to prevent unnecessary re-renders
//   const dataFetchedRef = useRef(false);

//   // ✅ Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.profile-dropdown') && !event.target.closest('.navbar-profile')) {
//         setShowProfileDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // ✅ Logout function
//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       // Clear all stored data
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('blogs');
//       localStorage.removeItem('comments');
//       localStorage.removeItem('readers');
//       localStorage.removeItem('gallery');
      
//       // Redirect to login page
//       window.location.href = '/login';
//     }
//   };

//   // ✅ Fetch Admins from API
//   const fetchAdmins = useCallback(async () => {
//     try {
//       const response = await axiosAuth.get('/users/admins');
//       setAdmins(response.data || []);
//     } catch (err) {
//       console.error('Error fetching admins:', err);
//       setError('Failed to fetch admins');
//     }
//   }, [axiosAuth]);

//   // ✅ Fetch Bloggers from API
//   const fetchBloggers = useCallback(async () => {
//     try {
//       const response = await axiosAuth.get('/users/bloggers');
//       setBloggers(response.data || []);
//     } catch (err) {
//       console.error('Error fetching bloggers:', err);
//       setError('Failed to fetch bloggers');
//     }
//   }, [axiosAuth]);

//   // ✅ Fetch Events
//   const fetchEvents = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_BASE}/events`);
//       if (!response.ok) throw new Error('Failed to fetch events');

//       const data = await response.json();
//       const eventsWithFullImagePath = data.map(event => ({
//         ...event,
//         image: event.image ? `${SERVER_BASE}${event.image}` : null,
//       }));

//       setEvents(eventsWithFullImagePath);
//     } catch (err) {
//       console.error('Error fetching events:', err);
//     }
//   }, [API_BASE, SERVER_BASE]);

//   // ✅ Fetch Blogs with proper image paths
//   const fetchBlogs = useCallback(async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/blogs`);
//       const blogsWithImages = response.data.map(blog => ({
//         ...blog,
//         image_url: blog.image_url ? `${SERVER_BASE}${blog.image_url}` : null,
//       }));
//       setBlogs(blogsWithImages);
//       localStorage.setItem("blogs", JSON.stringify(blogsWithImages));
//     } catch (err) {
//       console.error("Error fetching blogs:", err);
//     }
//   }, [API_BASE, SERVER_BASE]);

//   // ✅ Background data refresh (optimized to reduce flickering)
//   const refreshData = useCallback(async () => {
//     if (backgroundLoading) return; // Prevent multiple simultaneous refreshes
    
//     try {
//       setBackgroundLoading(true);
//       await Promise.all([
//         fetchAdmins(),
//         fetchBloggers(),
//         fetchBlogs(),
//         fetchEvents()
//       ]);
//     } catch (err) {
//       console.error('Error refreshing data:', err);
//     } finally {
//       setBackgroundLoading(false);
//     }
//   }, [fetchAdmins, fetchBloggers, fetchBlogs, fetchEvents, backgroundLoading]);

//   // ✅ Main useEffect with stable dependencies
//   useEffect(() => {
//     if (dataFetchedRef.current) return;
//     dataFetchedRef.current = true;

//     const initializeData = async () => {
//       try {
//         setBackgroundLoading(true);
//         await Promise.all([
//           fetchAdmins(),
//           fetchBloggers(),
//           fetchBlogs(),
//           fetchEvents()
//         ]);
//       } catch (err) {
//         console.error('Error initializing data:', err);
//       } finally {
//         setBackgroundLoading(false);
//       }
//     };

//     initializeData();

//     // Refresh data every 30 seconds only when needed
//     const interval = setInterval(() => {
//       if (document.visibilityState === 'visible') {
//         refreshData();
//       }
//     }, 30000);
    
//     return () => clearInterval(interval);
//   }, [fetchAdmins, fetchBloggers, fetchBlogs, fetchEvents, refreshData]);

//   // ✅ Toggle expanded state for events
//   const toggleEventExpanded = (eventId) => {
//     setExpandedEvents(prev => ({
//       ...prev,
//       [eventId]: !prev[eventId]
//     }));
//   };

//   // ✅ Toggle expanded state for blogs
//   const toggleBlogExpanded = (blogId) => {
//     setExpandedBlogs(prev => ({
//       ...prev,
//       [blogId]: !prev[blogId]
//     }));
//   };

//   // ✅ Truncate text to specified number of lines
//   const truncateText = (text, maxLines = 4) => {
//     if (!text) return '';
//     const lines = text.split('\n');
//     if (lines.length <= maxLines) return text;
//     return lines.slice(0, maxLines).join('\n') + '...';
//   };

//   const formatEventDate = (dateString) => {
//     if (!dateString) return "";
//     const parsedDate = new Date(dateString);
//     if (isNaN(parsedDate)) return dateString;
//     return parsedDate.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // ✅ Update Profile with API
//   const handleSaveEdit = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosAuth.put('/users/profile', {
//         username: editData.username,
//         email: editData.email,
//         password: editData.password || undefined,
//       });
      
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       alert('Profile updated successfully!');
//       setEditable(false);
//       setShowProfileDropdown(false);
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       alert(err.response?.data?.error || 'Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Add or Update User with API
//   const handleAddUser = async () => {
//     if (editingUserId) {
//       if (!username || !email || !role) {
//         alert('Please fill all required fields.');
//         return;
//       }
//     } else {
//       if (!username || !email || !password || !role) {
//         alert('Please fill all fields including password.');
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       if (editingUserId) {
//         await axiosAuth.put(`/users/update/${editingUserId}`, {
//           username,
//           email,
//           role,
//         });
//         alert('User updated successfully!');
//       } else {
//         await axiosAuth.post('/users/register', {
//           username,
//           email,
//           password,
//           role: role.toLowerCase(),
//         });
//         alert('User registered successfully!');
//       }
      
//       resetUserForm();
//       setShowUserModal(false);
//       await Promise.all([fetchAdmins(), fetchBloggers()]);
//     } catch (err) {
//       console.error('Error adding/updating user:', err);
//       alert(err.response?.data?.error || 'Failed to save user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Edit User
//   const handleEditUser = (user) => {
//     setEditingUserId(user.id);
//     setUsername(user.username);
//     setEmail(user.email);
//     setRole(user.role);
//     setShowUserModal(true);
//   };

//   // ✅ Delete User with API
//   const handleDeleteUser = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
    
//     try {
//       setLoading(true);
//       await axiosAuth.delete(`/users/delete/${id}`);
//       alert('User deleted successfully!');
//       await Promise.all([fetchAdmins(), fetchBloggers()]);
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       alert(err.response?.data?.error || 'Failed to delete user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Reset User Form
//   const resetUserForm = () => {
//     setUsername('');
//     setEmail('');
//     setPassword('');
//     setRole('');
//     setEditingUserId(null);
//     setShowPassword(false);
//   };

//   const handleAddEvent = async (e) => {
//     e.preventDefault();
//     if (!title || !description || !startDate || !endDate) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('description', description);
//       formData.append('startDate', startDate);
//       formData.append('endDate', endDate);
//       if (image) {
//         formData.append('image', image);
//       }

//       const response = await fetch(`${API_BASE}/events`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Failed to create event');

//       const newEvent = await response.json();
//       const eventWithFullImagePath = {
//         ...newEvent,
//         image: newEvent.image ? `${SERVER_BASE}${newEvent.image}` : null,
//       };
      
//       setEvents(prev => [...prev, eventWithFullImagePath]);
//       resetEventForm();
//       setShowEventModal(false);
//       alert('Event created successfully!');
//     } catch (err) {
//       setError(err.message);
//       console.error('Error creating event:', err);
//       alert('Failed to create event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetEventForm = () => {
//     setTitle('');
//     setDescription('');
//     setImage(null);
//     setStartDate('');
//     setEndDate('');
//   };

//   const resetBlogForm = () => {
//     setBlogInput({
//       title: '',
//       snippet: '',
//       Description: '',
//       image: null,
//       imagePreview: null,
//     });
//   };

//   const handleUpdateEventStatus = async (id, action) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE}/events/${id}/${action}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Failed to ${action} event`);
//       }

//       await response.json();
      
//       setEvents(prev => prev.map(event => 
//         event.id === id ? {
//           ...event, 
//           ...(action === 'approve' ? { is_approved: true } : {}),
//           ...(action === 'publish' ? { published: true } : {}),
//           image: event.image
//         } : event
//       ));
      
//       alert(`Event ${action}d successfully!`);
//     } catch (err) {
//       setError(err.message);
//       console.error(`Error ${action}ing event:`, err);
//       alert(err.message || `Failed to ${action} event`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveEvent = (id) => {
//     handleUpdateEventStatus(id, 'approve');
//   };

//   const handlePublishEvent = (id) => {
//     handleUpdateEventStatus(id, 'publish');
//   };

//   const handleDeleteEvent = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this event?')) return;

//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE}/events/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to delete event');
//       }

//       setEvents(prev => prev.filter(event => event.id !== id));
//       alert('Event deleted successfully!');
//     } catch (err) {
//       setError(err.message);
//       console.error('Error deleting event:', err);
//       alert(err.message || 'Failed to delete event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveBlog = (id) => {
//     setLoading(true);
//     axios.patch(`${API_BASE}/blogs/${id}/approve`)
//       .then(res => {
//         setBlogs(prev => prev.map(blog =>
//           blog.id === id ? { ...blog, approved: true } : blog
//         ));
//         alert('Blog approved successfully!');
//       })
//       .catch(err => {
//         console.error("Error approving blog:", err);
//         alert("❌ Could not approve blog");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handlePublishBlog = (id) => {
//     const blogToPublish = blogs.find(blog => blog.id === id);
//     if (!blogToPublish || !blogToPublish.approved) {
//       return alert("❌ Approve the blog before publishing!");
//     }

//     setLoading(true);
//     axios.patch(`${API_BASE}/blogs/${id}/publish`)
//       .then(res => {
//         setBlogs(prev => prev.map(blog =>
//           blog.id === id ? { ...blog, published: true } : blog
//         ));
//         alert("✅ Successfully published the blog!");
//       })
//       .catch(err => {
//         console.error("Error publishing blog:", err);
//         alert("❌ Could not publish blog");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleDeleteBlog = (id) => {
//     if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
//     setLoading(true);
//     axios.delete(`${API_BASE}/blogs/${id}`)
//       .then(res => {
//         setBlogs(prev => prev.filter(blog => blog.id !== id));
//         alert('Blog deleted successfully!');
//       })
//       .catch(err => {
//         console.error("Error deleting blog:", err);
//         alert("❌ Could not delete blog");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleAddBlog = async () => {
//     if (!blogInput.title || !blogInput.snippet || !blogInput.Description || !blogInput.image) {
//       alert("Please fill all fields including image");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append("title", blogInput.title);
//       formData.append("snippet", blogInput.snippet);
//       formData.append("description", blogInput.Description);
//       formData.append("image", blogInput.image);

//       const res = await axios.post(`${API_BASE}/blogs`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // Add the new blog with proper image path
//       const newBlog = {
//         ...res.data,
//         image_url: res.data.image_url ? `${SERVER_BASE}${res.data.image_url}` : null,
//       };
      
//       setBlogs(prev => [...prev, newBlog]);
//       resetBlogForm();
//       setShowBlogModal(false);
//       alert("✅ Blog added successfully");
//     } catch (err) {
//       console.error("Error adding blog:", err);
//       alert("❌ Failed to add blog");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fixed Modal Components with proper event handlers and stable input handling
//   const UserModal = () => {
//     const [localUsername, setLocalUsername] = useState(username);
//     const [localEmail, setLocalEmail] = useState(email);
//     const [localPassword, setLocalPassword] = useState(password);
//     const [localRole, setLocalRole] = useState(role);
//     const [localShowPassword, setLocalShowPassword] = useState(showPassword);

//     // Sync with parent state when modal opens or editing changes
//     React.useEffect(() => {
//       setLocalUsername(username);
//       setLocalEmail(email);
//       setLocalPassword(password);
//       setLocalRole(role);
//       setLocalShowPassword(showPassword);
//     }, []); // Empty dependency array - only run once when modal opens

//     const handleSubmit = async () => {
//       if (editingUserId) {
//         if (!localUsername || !localEmail || !localRole) {
//           alert('Please fill all required fields.');
//           return;
//         }
//       } else {
//         if (!localUsername || !localEmail || !localPassword || !localRole) {
//           alert('Please fill all fields including password.');
//           return;
//         }
//       }

//       try {
//         setLoading(true);
//         if (editingUserId) {
//           await axiosAuth.put(`/users/update/${editingUserId}`, {
//             username: localUsername,
//             email: localEmail,
//             role: localRole,
//           });
//           alert('User updated successfully!');
//         } else {
//           await axiosAuth.post('/users/register', {
//             username: localUsername,
//             email: localEmail,
//             password: localPassword,
//             role: localRole.toLowerCase(),
//           });
//           alert('User registered successfully!');
//         }
        
//         // Update parent state
//         setUsername(localUsername);
//         setEmail(localEmail);
//         setPassword(localPassword);
//         setRole(localRole);
        
//         resetUserForm();
//         setShowUserModal(false);
//         await Promise.all([fetchAdmins(), fetchBloggers()]);
//       } catch (err) {
//         console.error('Error adding/updating user:', err);
//         alert(err.response?.data?.error || 'Failed to save user');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleClose = () => {
//       setShowUserModal(false);
//       resetUserForm();
//     };

//     return (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h3>{editingUserId ? 'Edit User' : 'Add User'}</h3>
//             <button 
//               className="modal-close" 
//               onClick={handleClose}
//             >
//               ×
//             </button>
//           </div>
//           <div className="form-group">
//             <input
//               type="text"
//               placeholder="Enter username"
//               value={localUsername}
//               onChange={(e) => setLocalUsername(e.target.value)}
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="email"
//               placeholder="Enter user email"
//               value={localEmail}
//               onChange={(e) => setLocalEmail(e.target.value)}
//               className="form-input"
//             />
//           </div>
//           {!editingUserId && (
//             <div className="form-group password-group">
//               <input
//                 type={localShowPassword ? 'text' : 'password'}
//                 placeholder="Enter user password"
//                 value={localPassword}
//                 onChange={(e) => setLocalPassword(e.target.value)}
//                 className="form-input"
//               />
//               <button 
//                 type="button" 
//                 onClick={() => setLocalShowPassword(!localShowPassword)}
//                 className="toggle-password"
//               >
//                 {localShowPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           )}
//           <div className="form-group">
//             <select value={localRole} onChange={(e) => setLocalRole(e.target.value)} className="form-select">
//               <option value="">Select Role</option>
//               <option value="admin">Admin</option>
//               <option value="blogger">Blogger</option>
//             </select>
//           </div>
//           <div className="form-actions">
//             <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
//               {loading ? 'Saving...' : editingUserId ? 'Update User' : 'Add User'}
//             </button>
//             <button 
//               onClick={handleClose} 
//               className="btn-secondary"
//               type="button"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const EventModal = () => {
//     const [localTitle, setLocalTitle] = useState(title);
//     const [localDescription, setLocalDescription] = useState(description);
//     const [localImage, setLocalImage] = useState(image);
//     const [localStartDate, setLocalStartDate] = useState(startDate);
//     const [localEndDate, setLocalEndDate] = useState(endDate);

//     // Sync with parent state when modal opens
//     React.useEffect(() => {
//       setLocalTitle(title);
//       setLocalDescription(description);
//       setLocalImage(image);
//       setLocalStartDate(startDate);
//       setLocalEndDate(endDate);
//     }, []); // Empty dependency array - only run once when modal opens

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (!localTitle || !localDescription || !localStartDate || !localEndDate) {
//         alert("Please fill in all required fields");
//         return;
//       }

//       try {
//         setLoading(true);
//         const formData = new FormData();
//         formData.append('title', localTitle);
//         formData.append('description', localDescription);
//         formData.append('startDate', localStartDate);
//         formData.append('endDate', localEndDate);
//         if (localImage) {
//           formData.append('image', localImage);
//         }

//         const response = await fetch(`${API_BASE}/events`, {
//           method: 'POST',
//           body: formData,
//         });

//         if (!response.ok) throw new Error('Failed to create event');

//         const newEvent = await response.json();
//         const eventWithFullImagePath = {
//           ...newEvent,
//           image: newEvent.image ? `${SERVER_BASE}${newEvent.image}` : null,
//         };
        
//         setEvents(prev => [...prev, eventWithFullImagePath]);
        
//         // Update parent state
//         setTitle(localTitle);
//         setDescription(localDescription);
//         setImage(localImage);
//         setStartDate(localStartDate);
//         setEndDate(localEndDate);
        
//         resetEventForm();
//         setShowEventModal(false);
//         alert('Event created successfully!');
//       } catch (err) {
//         setError(err.message);
//         console.error('Error creating event:', err);
//         alert('Failed to create event');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleImageUpload = (e) => {
//       const file = e.target.files[0];
//       setLocalImage(file);
//     };

//     const handleClose = () => {
//       setShowEventModal(false);
//       resetEventForm();
//     };

//     return (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h3>Add Event</h3>
//             <button 
//               className="modal-close" 
//               onClick={handleClose}
//             >
//               ×
//             </button>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <input 
//                 type="text" 
//                 placeholder="Event Title" 
//                 value={localTitle} 
//                 onChange={(e) => setLocalTitle(e.target.value)} 
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <textarea 
//                 placeholder="Event Description" 
//                 value={localDescription} 
//                 onChange={(e) => setLocalDescription(e.target.value)} 
//                 className="form-textarea"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <input 
//                 type="file" 
//                 onChange={handleImageUpload} 
//                 className="form-input"
//                 accept="image/*"
//               />
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Start Date</label>
//                 <input 
//                   type="date" 
//                   value={localStartDate} 
//                   onChange={(e) => setLocalStartDate(e.target.value)} 
//                   className="form-input"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>End Date</label>
//                 <input 
//                   type="date" 
//                   value={localEndDate} 
//                   onChange={(e) => setLocalEndDate(e.target.value)} 
//                   className="form-input"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="form-actions">
//               <button type="submit" className="btn-primary" disabled={loading}>
//                 {loading ? 'Adding...' : 'Add Event'}
//               </button>
//               <button 
//                 type="button" 
//                 onClick={handleClose} 
//                 className="btn-secondary"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const BlogModal = () => {
//     const [localBlogInput, setLocalBlogInput] = useState(blogInput);

//     // Sync with parent state when modal opens
//     React.useEffect(() => {
//       setLocalBlogInput(blogInput);
//     }, []); // Empty dependency array - only run once when modal opens

//     const handleSubmit = async () => {
//       if (!localBlogInput.title || !localBlogInput.snippet || !localBlogInput.Description || !localBlogInput.image) {
//         alert("Please fill all fields including image");
//         return;
//       }

//       try {
//         setLoading(true);
//         const formData = new FormData();
//         formData.append("title", localBlogInput.title);
//         formData.append("snippet", localBlogInput.snippet);
//         formData.append("description", localBlogInput.Description);
//         formData.append("image", localBlogInput.image);

//         const res = await axios.post(`${API_BASE}/blogs`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         // Add the new blog with proper image path
//         const newBlog = {
//           ...res.data,
//           image_url: res.data.image_url ? `${SERVER_BASE}${res.data.image_url}` : null,
//         };
        
//         setBlogs(prev => [...prev, newBlog]);
        
//         // Update parent state
//         setBlogInput(localBlogInput);
        
//         resetBlogForm();
//         setShowBlogModal(false);
//         alert("✅ Blog added successfully");
//       } catch (err) {
//         console.error("Error adding blog:", err);
//         alert("❌ Failed to add blog");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleClose = () => {
//       setShowBlogModal(false);
//       resetBlogForm();
//     };

//     const updateLocalBlogInput = (field, value) => {
//       setLocalBlogInput(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     };

//     return (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h3>Add Blog</h3>
//             <button 
//               className="modal-close" 
//               onClick={handleClose}
//             >
//               ×
//             </button>
//           </div>
//           <div className="form-group">
//             <input
//               type="text"
//               placeholder="Blog title"
//               value={localBlogInput.title}
//               onChange={(e) => updateLocalBlogInput('title', e.target.value)}
//               className="form-input"
//             />
//           </div>
//         <div className="form-group">
//   <input
//     type="text"
//     placeholder="Snippet (max 150 characters)"
//     value={localBlogInput.snippet}
//     onChange={(e) => {
//       if (e.target.value.length <= 150) {
//         updateLocalBlogInput('snippet', e.target.value);
//       }
//     }}
//     className="form-input"
//     maxLength={150}
//   />
//   <div className="character-count">
//     {localBlogInput.snippet?.length || 0}/150
//   </div>
// </div>
//           <div className="form-group">
//             <textarea
//               placeholder="Description"
//               value={localBlogInput.Description}
//               onChange={(e) => updateLocalBlogInput('Description', e.target.value)}
//               className="form-textarea"
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   updateLocalBlogInput('image', file);
//                   updateLocalBlogInput('imagePreview', URL.createObjectURL(file));
//                 }
//               }}
//               className="form-input"
//             />
//           </div>
//           {localBlogInput.imagePreview && (
//             <div className="image-preview">
//               <img
//                 src={localBlogInput.imagePreview}
//                 alt="Preview"
//                 className="preview-image"
//               />
//             </div>
//           )}
//           <div className="form-actions">
//             <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
//               {loading ? 'Adding...' : 'Add Blog'}
//             </button>
//             <button 
//               onClick={handleClose} 
//               className="btn-secondary"
//               type="button"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderContent = () => {
//     switch (activeView) {
//       case 'user':
//         return (
//           <div className="user-management">
//             <div className="section-header">
//               <h2 className='title'>User Management</h2>
//               <button 
//                 className="btn-primary add-btn" 
//                 onClick={() => {
//                   resetUserForm();
//                   setShowUserModal(true);
//                 }}
//               >
//                 <FaPlus style={{ marginRight: '8px' }} />
//                 Add User
//               </button>
//             </div>
            
//             <div className="user-lists">
//               <div className="user-list">
//                 <h2 className="user-list-title">Admin Users ({admins.length})</h2>
//                 <ul>
//                   {admins.map((user) => (
//                     <li key={user.id} className="user-item-small">
//                       <div className="user-info-small">
//                         <strong className="user-name">{user.username}</strong> - <span className="user-email">{user.email}</span>
//                       </div>
//                       <div className="user-actions-small">
//                          <button 
//                            className={`btn-small ${editingUserId === user.id ? 'btn-edit-active' : ''}`} 
//                            onClick={() => handleEditUser(user)}
//                            disabled={loading}
//                          >
//                            <FaEdit />
//                          </button>
//                          <button className="btn-small btn-danger" onClick={() => handleDeleteUser(user.id)} disabled={loading}>
//                            <FaTrash />
//                          </button>
//                        </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="user-list">
//                 <h2 className="user-list-title">Blogger Users ({bloggers.length})</h2>
//                 <ul>
//                   {bloggers.map((user) => (
//                     <li key={user.id} className="user-item-small">
//                       <div className="user-info-small">
//                         <strong className="user-name">{user.username}</strong> - <span className="user-email">{user.email}</span>
//                       </div>
//                          <div className="user-actions-small">
//                            <button 
//                              className={`btn-small ${editingUserId === user.id ? 'btn-edit-active' : ''}`} 
//                              onClick={() => handleEditUser(user)}
//                              disabled={loading}
//                            >
//                              <FaEdit />
//                            </button>
//                            <button className="btn-small btn-danger" onClick={() => handleDeleteUser(user.id)} disabled={loading}>
//                              <FaTrash />
//                            </button>
//                          </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         );
   
//       case 'Events':
//         return (
//           <div className="events-management">
//             <div className="section-header">
//               <h2 className='title'>Event Management</h2>
//               <button 
//                 className="btn-primary add-btn" 
//                 onClick={() => {
//                   resetEventForm();
//                   setShowEventModal(true);
//                 }}
//               >
//                 <FaPlus style={{ marginRight: '8px' }} />
//                 Add Event
//               </button>
//             </div>

//             <div className="event-grid-square">
//               {events.length > 0 ? (
//                 events.map((event) => {
//                   const isExpanded = expandedEvents[event.id];
//                   const displayDescription = isExpanded 
//                     ? event.description 
//                     : truncateText(event.description || 'No description available', 4);
//                   const shouldShowReadMore = (event.description || '').split('\n').length > 4;
                  
//                   return (
//                     <div className="event-square-card" key={event.id}>
//                       {event.image && (
//                         <div className="square-image-container">
//                           <img src={event.image} alt={event.title} className="square-event-image" />
//                         </div>
//                       )}
//                       <div className="square-card-content">
//                         <h3>{event.title}</h3>
//                         <p className="event-description">{displayDescription}</p>
//                         {shouldShowReadMore && (
//                           <span 
//                             className="read-more-text"
//                             onClick={() => toggleEventExpanded(event.id)}
//                           >
//                             {isExpanded ? 'Read Less' : 'Read More'}
//                           </span>
//                         )}
//                         <p className="event-date">
//                           Start: {formatEventDate(event.startdate || event.start_date)}
//                         </p>
//                         {event.end_date && (
//                           <p className="event-date">
//                             End: {formatEventDate(event.end_date || event.endDate)}
//                           </p>
//                         )}
//                         <div className="event-actions">
//                           <button 
//                             className={`btn-small ${event.is_approved ? 'btn-disabled' : ''}`} 
//                             onClick={() => handleApproveEvent(event.id)} 
//                             disabled={event.is_approved || loading}
//                           >
//                             {event.is_approved ? 'Approved' : 'Approve'}
//                           </button>
//                           <button
//                             className={`btn-small ${event.published ? 'btn-disabled' : ''}`}
//                             onClick={() => handlePublishEvent(event.id)}
//                             disabled={!event.is_approved || event.published || loading}
//                           >
//                             {event.published ? 'Published' : 'Publish'}
//                           </button>
//                           <button 
//                             className="btn-small btn-danger" 
//                             onClick={() => handleDeleteEvent(event.id)}
//                             disabled={loading}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="no-events-square">
//                   <p>No events found</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 'blog':
//         return (
//           <div className="blog-management">
//             <div className="section-header">
//               <h2 className="title">Blog Management</h2>
//               <button 
//                 className="btn-primary add-btn" 
//                 onClick={() => {
//                   resetBlogForm();
//                   setShowBlogModal(true);
//                 }}
//               >
//                 <FaPlus style={{ marginRight: '8px' }} />
//                 Add Blog
//               </button>
//             </div>

//             <div className="blog-grid-square">
//               {blogs.length > 0 ? (
//                 blogs.map((blog) => {
//                   const isExpanded = expandedBlogs[blog.id];
//                   const displayDescription = isExpanded 
//                     ? blog.description 
//                     : truncateText(blog.description || 'No description available', 4);
//                   const shouldShowReadMore = (blog.description || '').split('\n').length > 4;
                  
//                   return (
//                     <div className="blog-square-card" key={blog.id}>
//                       {blog.image_url && (
//                         <div className="square-image-container">
//                           <img
//                             src={blog.image_url}
//                             alt={blog.title}
//                             className="square-blog-image"
//                           />
//                         </div>
//                       )}
//                       <div className="square-card-content">
//                         <h3>{blog.title}</h3>
//                         <p className="blog-snippet">{blog.snippet}</p>
//                         <p className="blog-description">{displayDescription}</p>
                        
//                         {shouldShowReadMore && (
//                           <span 
//                             className="read-more-text"
//                             onClick={() => toggleBlogExpanded(blog.id)}
//                           >
//                             {isExpanded ? 'Read Less' : 'Read More'}
//                           </span>
//                         )}

//                         <div className="blog-actions">
//                           <button
//                             className={`btn-small ${blog.approved ? "btn-disabled" : ""}`}
//                             onClick={() => handleApproveBlog(blog.id)}
//                             disabled={blog.approved || loading}
//                           >
//                             {blog.approved ? "Approved" : "Approve"}
//                           </button>
//                           <button
//                             className={`btn-small ${blog.published ? "btn-disabled" : ""}`}
//                             onClick={() => handlePublishBlog(blog.id)}
//                             disabled={!blog.approved || blog.published || loading}
//                           >
//                             {blog.published ? "Published" : "Publish"}
//                           </button>
//                           <button
//                             className="btn-small btn-danger"
//                             onClick={() => handleDeleteBlog(blog.id)}
//                             disabled={loading}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="no-blogs-square">
//                   <p>No blogs found</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       default:
//         return <div>Select a view from the sidebar</div>;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Top Navbar */}
//       <nav className="dashboard-navbar">
//         <div className="navbar-left">
//           <button 
//             className="mobile-menu-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//           <h2>Admin Dashboard</h2>
//         </div>
        
//         <div className="navbar-center">
//           <span className="version-badge">V.1.0.0.1</span>
//         </div>
        
//         <div className="navbar-right">
//           <div className="navbar-profile">
//             <button 
//               className="profile-btn"
//               onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//               style={{ color: '#333' }}
//             >
//               <FaUser style={{ color: '#333', fontSize: '20px' }} />
//             </button>
            
//             {showProfileDropdown && (
//               <div className="profile-dropdown">
//                 <div className="dropdown-content">
//                   <h4>Profile Details</h4>
//                   <div className="profile-info">
//                     <p><strong>Username:</strong> {user?.username}</p>
//                     <p><strong>Email:</strong> {user?.email}</p>
//                     <p><strong>Role:</strong> {user?.role}</p>
//                   </div>
                  
//                   {editable ? (
//                     <div className="edit-profile-form">
//                       <div className="form-group">
//                         <label>Username:</label>
//                         <input 
//                           type="text" 
//                           value={editData.username} 
//                           onChange={(e) => setEditData({ ...editData, username: e.target.value })} 
//                           className="form-input"
//                         />
//                       </div>
                      
//                       <div className="form-group">
//                         <label>Email:</label>
//                         <input 
//                           type="email" 
//                           value={editData.email} 
//                           onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
//                           className="form-input"
//                         />
//                       </div>
                      
//                       <div className="form-group">
//                         <label>New Password:</label>
//                         <input 
//                           type="password" 
//                           placeholder="Leave blank to keep current password"
//                           onChange={(e) => setEditData({ ...editData, password: e.target.value })} 
//                           className="form-input"
//                         />
//                       </div>
                      
//                       <div className="form-actions">
//                         <button 
//                           onClick={handleSaveEdit}
//                           className="btn-primary"
//                           disabled={loading}
//                         >
//                           {loading ? 'Saving...' : 'Save'}
//                         </button>
//                         <button 
//                           onClick={() => setEditable(false)}
//                           className="btn-secondary"
//                           disabled={loading}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="dropdown-actions">
//                       <button 
//                         onClick={() => {
//                           setEditData(user || { username: '', email: '', role: '', password: '' });
//                           setEditable(true);
//                         }}
//                         className="btn-primary"
//                       >
//                         Edit Profile
//                       </button>
//                       <button 
//                         onClick={handleLogout}
//                         className="btn-danger logout-btn"
//                       >
//                         <FaSignOutAlt style={{ marginRight: '8px' }} />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       <div className="dashboard-content">
//         {/* Sidebar */}
//         <div className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
//           <button 
//             onClick={() => setActiveView('user')} 
//             className={activeView === 'user' ? 'sidebar-btn active' : 'sidebar-btn'}
//           >
//             <FaUsers style={{ marginRight: '10px' }} />
//             Admin/Blogger
//           </button>
//           <button 
//             onClick={() => setActiveView('Events')} 
//             className={activeView === 'Events' ? 'sidebar-btn active' : 'sidebar-btn'}
//           >
//             <FaCalendar style={{ marginRight: '10px' }} />
//             Events
//           </button>
//           <button 
//             onClick={() => setActiveView('blog')} 
//             className={activeView === 'blog' ? 'sidebar-btn active' : 'sidebar-btn'}
//           >
//             <FaBlog style={{ marginRight: '10px' }} />
//             Blog
//           </button>
//         </div>
        
//         {/* Main Content */}
//         <div className="dashboard-main">
//           <div className="content-area">
//             {renderContent()}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showUserModal && <UserModal />}
//       {showEventModal && <EventModal />}
//       {showBlogModal && <BlogModal />}

//       <style jsx>{`
//         /* Square Card Styles */
//         .event-grid-square,
//         .blog-grid-square {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//           gap: 20px;
//           padding: 20px 0;
//         }

//         .event-square-card,
//         .blog-square-card {
//           background: #151f6d;
//           border-radius: 12px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//           overflow: hidden;
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//           display: flex;
//           flex-direction: column;
//           height: 100%;
//         }

//         .event-square-card:hover,
//         .blog-square-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
//         }

//         .square-image-container {
//           width: 100%;
//           height: 200px;
//           overflow: hidden;
//         }

//         .square-event-image,
//         .square-blog-image {
//           width: 65%;
//           height: 100%;
//           object-fit: fill;
//           transition: transform 0.3s ease;
//         }

//         .event-square-card:hover .square-event-image,
//         .blog-square-card:hover .square-blog-image {
//           transform: scale(1.05);
//         }

//         .square-card-content {
//           padding: 20px;
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }

//         .square-card-content h3 {
//           margin: 0 0 12px 0;
//           color: white;
//           font-size: 1.2rem;
//           line-height: 1.4;
//         }

//         .event-description,
//         .blog-description {
//           color: #f8f9fa;
//           line-height: 1.5;
//           margin-bottom: 12px;
//           flex: 1;
//           font-size: 0.9rem;
//         }

//         .blog-snippet {
//           color: #e9ecef;
//           font-style: italic;
//           margin-bottom: 10px;
//           font-size: 0.9rem;
//         }

//         .read-more-text {
//           color: #ffc107;
//           cursor: pointer;
//           font-weight: 500;
//           margin-bottom: 12px;
//           display: inline-block;
//           transition: color 0.3s ease;
//           font-size: 0.9rem;
//         }

//         .read-more-text:hover {
//           color: #ffd54f;
//           text-decoration: underline;
//         }

//         .event-date {
//           color: #e9ecef;
//           font-size: 0.85rem;
//           margin-bottom: 15px;
//         }

//         .event-actions,
//         .blog-actions {
//           display: flex;
//           gap: 8px;
//           margin-top: auto;
//           flex-wrap: wrap;
//         }

//         /* User Management Styles */
//         .user-item-small {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 15px 18px;
//           margin-bottom: 12px;
//           background: #f8f9fa;
//           border-radius: 8px;
//           border: 1px solid #e9ecef;
//           transition: background-color 0.3s ease;
//         }

//         .user-item-small:hover {
//           background: #e9ecef;
//         }

//         .user-info-small {
//           font-size: 1rem;
//           color: #495057;
//         }

//         .user-name {
//           color: #333;
//           font-size: 1.1rem;
//           font-weight: 700;
//         }

//         .user-email {
//           color: #666;
//           font-weight: 500;
//         }

//         .user-list-title {
//           color: #333;
//           font-size: 1.3rem;
//           font-weight: 700;
//           margin-bottom: 15px;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #007bff;
//         }

//         .user-actions-small {
//           display: flex;
//           gap: 8px;
//         }

//         /* Button Styles */
//         .btn-small {
//           padding: 6px 12px;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 0.8rem;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .btn-primary {
//           background: #007bff;
//           color: white;
//         }

//         .btn-primary:hover:not(:disabled) {
//           background: #0056b3;
//         }

//         .btn-danger {
//           background: #dc3545;
//           color: white;
//         }

//         .btn-danger:hover:not(:disabled) {
//           background: #c82333;
//         }

//         .btn-disabled {
//           background: #6c757d;
//           color: white;
//           cursor: not-allowed;
//         }

//         .btn-edit-active {
//           background: #28a745;
//           color: white;
//         }

//         /* No Content States */
//         .no-events-square,
//         .no-blogs-square {
//           grid-column: 1 / -1;
//           text-align: center;
//           padding: 40px;
//           background: #f8f9fa;
//           border-radius: 12px;
//           color: #6c757d;
//         }

//         /* Section Headers */
//         .section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//           padding-bottom: 15px;
//           border-bottom: 2px solid #e9ecef;
//         }

//         .title {
//           color: #333;
//           margin: 0;
//           font-size: 1.5rem;
//           font-weight: 700;
//         }

//         .add-btn {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .navbar-left {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }

//         .navbar-center {
//           display: flex;
//           align-items: center;
//         }

//         .version-badge {
//           margin-left: 60rem;
//           color:Black;
//           font-size: 0.8rem;
//           font-weight: 600;
//         }

//         .navbar-right {
//           display: flex;
//           align-items: center;
//         }

//         /* Responsive Design */
//         @media (max-width: 768px) {
//           .event-grid-square,
//           .blog-grid-square {
//             grid-template-columns: 1fr;
//           }
          
//           .section-header {
//             flex-direction: column;
//             gap: 15px;
//             align-items: flex-start;
//           }
          
//           .user-item-small {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 10px;
//           }
          
//           .user-actions-small {
//             align-self: flex-end;
//           }

//           .navbar-center {
//             display: none;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Admin;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaSignOutAlt, FaUser, FaUsers, FaCalendar, FaBlog, FaBars, FaTimes, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const Admin = () => {
  const [activeView, setActiveView] = useState('user');
  const [admins, setAdmins] = useState([]);
  const [bloggers, setBloggers] = useState([]);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogInput, setBlogInput] = useState({ title: '', snippet: '', Description: '', image: null, imagePreview: null });
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [editable, setEditable] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '', role: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New states for navbar and modals
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Expanded states for read more functionality
  const [expandedEvents, setExpandedEvents] = useState({});
  const [expandedBlogs, setExpandedBlogs] = useState({});

  // API base URL
  const API_BASE = 'http://localhost:5000/api';
  const SERVER_BASE = 'http://localhost:5000';
  
  // Get auth token
  const token = localStorage.getItem('token');

  // ✅ Create axios instance with useMemo to prevent recreation
  const axiosAuth = React.useMemo(() => axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  // ✅ Use refs to prevent unnecessary re-renders
  const dataFetchedRef = useRef(false);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.navbar-profile')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('blogs');
      localStorage.removeItem('comments');
      localStorage.removeItem('readers');
      localStorage.removeItem('gallery');
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  // ✅ Fetch Admins from API
  const fetchAdmins = useCallback(async () => {
    try {
      const response = await axiosAuth.get('/users/admins');
      setAdmins(response.data || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to fetch admins');
    }
  }, [axiosAuth]);

  // ✅ Fetch Bloggers from API
  const fetchBloggers = useCallback(async () => {
    try {
      const response = await axiosAuth.get('/users/bloggers');
      setBloggers(response.data || []);
    } catch (err) {
      console.error('Error fetching bloggers:', err);
      setError('Failed to fetch bloggers');
    }
  }, [axiosAuth]);

  // ✅ Fetch Events
  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      const eventsWithFullImagePath = data.map(event => ({
        ...event,
        image: event.image ? `${SERVER_BASE}${event.image}` : null,
      }));

      setEvents(eventsWithFullImagePath);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }, [API_BASE, SERVER_BASE]);

  // ✅ Fetch Blogs with proper image paths and author information
  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/blogs`);
      const blogsWithImages = response.data.map(blog => ({
        ...blog,
        image_url: blog.image_url ? `${SERVER_BASE}${blog.image_url}` : null,
        author: blog.author || 'Unknown Author'
      }));
      setBlogs(blogsWithImages);
      localStorage.setItem("blogs", JSON.stringify(blogsWithImages));
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  }, [API_BASE, SERVER_BASE]);

  // ✅ Background data refresh (optimized to reduce flickering)
  const refreshData = useCallback(async () => {
    if (backgroundLoading) return; // Prevent multiple simultaneous refreshes
    
    try {
      setBackgroundLoading(true);
      await Promise.all([
        fetchAdmins(),
        fetchBloggers(),
        fetchBlogs(),
        fetchEvents()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setBackgroundLoading(false);
    }
  }, [fetchAdmins, fetchBloggers, fetchBlogs, fetchEvents, backgroundLoading]);

  // ✅ Main useEffect with stable dependencies
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const initializeData = async () => {
      try {
        setBackgroundLoading(true);
        await Promise.all([
          fetchAdmins(),
          fetchBloggers(),
          fetchBlogs(),
          fetchEvents()
        ]);
      } catch (err) {
        console.error('Error initializing data:', err);
      } finally {
        setBackgroundLoading(false);
      }
    };

    initializeData();

    // Refresh data every 30 seconds only when needed
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchAdmins, fetchBloggers, fetchBlogs, fetchEvents, refreshData]);

  // ✅ Toggle expanded state for events
  const toggleEventExpanded = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // ✅ Toggle expanded state for blogs
  const toggleBlogExpanded = (blogId) => {
    setExpandedBlogs(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  // ✅ Truncate text to specified number of lines
  const truncateText = (text, maxLines = 4) => {
    if (!text) return '';
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) return dateString;
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ Update Profile with API
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const response = await axiosAuth.put('/users/profile', {
        username: editData.username,
        email: editData.email,
        password: editData.password || undefined,
      });
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Profile updated successfully!');
      setEditable(false);
      setShowProfileDropdown(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add or Update User with API
  const handleAddUser = async () => {
    if (editingUserId) {
      if (!username || !email || !role) {
        alert('Please fill all required fields.');
        return;
      }
    } else {
      if (!username || !email || !password || !role) {
        alert('Please fill all fields including password.');
        return;
      }
    }

    try {
      setLoading(true);
      if (editingUserId) {
        await axiosAuth.put(`/users/update/${editingUserId}`, {
          username,
          email,
          role,
        });
        alert('User updated successfully!');
      } else {
        await axiosAuth.post('/users/register', {
          username,
          email,
          password,
          role: role.toLowerCase(),
        });
        alert('User registered successfully!');
      }
      
      resetUserForm();
      setShowUserModal(false);
      await Promise.all([fetchAdmins(), fetchBloggers()]);
    } catch (err) {
      console.error('Error adding/updating user:', err);
      alert(err.response?.data?.error || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit User
  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    setShowUserModal(true);
  };

  // ✅ Delete User with API
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setLoading(true);
      await axiosAuth.delete(`/users/delete/${id}`);
      alert('User deleted successfully!');
      await Promise.all([fetchAdmins(), fetchBloggers()]);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset User Form
  const resetUserForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('');
    setEditingUserId(null);
    setShowPassword(false);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !description || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create event');

      const newEvent = await response.json();
      const eventWithFullImagePath = {
        ...newEvent,
        image: newEvent.image ? `${SERVER_BASE}${newEvent.image}` : null,
      };
      
      setEvents(prev => [...prev, eventWithFullImagePath]);
      resetEventForm();
      setShowEventModal(false);
      alert('Event created successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error creating event:', err);
      alert('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const resetEventForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setStartDate('');
    setEndDate('');
  };

  const resetBlogForm = () => {
    setBlogInput({
      title: '',
      snippet: '',
      Description: '',
      image: null,
      imagePreview: null,
    });
  };

  const handleUpdateEventStatus = async (id, action) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/events/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} event`);
      }

      await response.json();
      
      setEvents(prev => prev.map(event => 
        event.id === id ? {
          ...event, 
          ...(action === 'approve' ? { is_approved: true } : {}),
          ...(action === 'publish' ? { published: true } : {}),
          image: event.image
        } : event
      ));
      
      alert(`Event ${action}d successfully!`);
    } catch (err) {
      setError(err.message);
      console.error(`Error ${action}ing event:`, err);
      alert(err.message || `Failed to ${action} event`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = (id) => {
    handleUpdateEventStatus(id, 'approve');
  };

  const handlePublishEvent = (id) => {
    handleUpdateEventStatus(id, 'publish');
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }

      setEvents(prev => prev.filter(event => event.id !== id));
      alert('Event deleted successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting event:', err);
      alert(err.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBlog = (id) => {
    setLoading(true);
    axios.patch(`${API_BASE}/blogs/${id}/approve`)
      .then(res => {
        setBlogs(prev => prev.map(blog =>
          blog.id === id ? { ...blog, approved: true } : blog
        ));
        alert('Blog approved successfully!');
      })
      .catch(err => {
        console.error("Error approving blog:", err);
        alert("❌ Could not approve blog");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePublishBlog = (id) => {
    const blogToPublish = blogs.find(blog => blog.id === id);
    if (!blogToPublish || !blogToPublish.approved) {
      return alert("❌ Approve the blog before publishing!");
    }

    setLoading(true);
    axios.patch(`${API_BASE}/blogs/${id}/publish`)
      .then(res => {
        setBlogs(prev => prev.map(blog =>
          blog.id === id ? { ...blog, published: true } : blog
        ));
        alert("✅ Successfully published the blog!");
      })
      .catch(err => {
        console.error("Error publishing blog:", err);
        alert("❌ Could not publish blog");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteBlog = (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    setLoading(true);
    axios.delete(`${API_BASE}/blogs/${id}`)
      .then(res => {
        setBlogs(prev => prev.filter(blog => blog.id !== id));
        alert('Blog deleted successfully!');
      })
      .catch(err => {
        console.error("Error deleting blog:", err);
        alert("❌ Could not delete blog");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ✅ Updated Add Blog function - automatically includes author in form data
  const handleAddBlog = async () => {
    if (!blogInput.title || !blogInput.snippet || !blogInput.Description || !blogInput.image) {
      alert("Please fill all fields including image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", blogInput.title);
      formData.append("snippet", blogInput.snippet);
      formData.append("description", blogInput.Description);
      formData.append("image", blogInput.image);
      
      // ✅ Automatically add author field with logged-in user's name
      const authorName = user?.username || 'Unknown Author';
      formData.append("author", authorName);
      
      console.log("📤 Sending blog data with author:", authorName);

      const res = await axios.post(`${API_BASE}/blogs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add the new blog with proper image path
      const newBlog = {
        ...res.data,
        image_url: res.data.image_url ? `${SERVER_BASE}${res.data.image_url}` : null,
      };
      
      setBlogs(prev => [...prev, newBlog]);
      resetBlogForm();
      setShowBlogModal(false);
      alert("✅ Blog added successfully");
    } catch (err) {
      console.error("Error adding blog:", err);
      alert("❌ Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  // Fixed Modal Components with proper event handlers and stable input handling
  const UserModal = () => {
    const [localUsername, setLocalUsername] = useState(username);
    const [localEmail, setLocalEmail] = useState(email);
    const [localPassword, setLocalPassword] = useState(password);
    const [localRole, setLocalRole] = useState(role);
    const [localShowPassword, setLocalShowPassword] = useState(showPassword);

    // Sync with parent state when modal opens or editing changes
    React.useEffect(() => {
      setLocalUsername(username);
      setLocalEmail(email);
      setLocalPassword(password);
      setLocalRole(role);
      setLocalShowPassword(showPassword);
    }, []); // Empty dependency array - only run once when modal opens

    const handleSubmit = async () => {
      if (editingUserId) {
        if (!localUsername || !localEmail || !localRole) {
          alert('Please fill all required fields.');
          return;
        }
      } else {
        if (!localUsername || !localEmail || !localPassword || !localRole) {
          alert('Please fill all fields including password.');
          return;
        }
      }

      try {
        setLoading(true);
        if (editingUserId) {
          await axiosAuth.put(`/users/update/${editingUserId}`, {
            username: localUsername,
            email: localEmail,
            role: localRole,
          });
          alert('User updated successfully!');
        } else {
          await axiosAuth.post('/users/register', {
            username: localUsername,
            email: localEmail,
            password: localPassword,
            role: localRole.toLowerCase(),
          });
          alert('User registered successfully!');
        }
        
        // Update parent state
        setUsername(localUsername);
        setEmail(localEmail);
        setPassword(localPassword);
        setRole(localRole);
        
        resetUserForm();
        setShowUserModal(false);
        await Promise.all([fetchAdmins(), fetchBloggers()]);
      } catch (err) {
        console.error('Error adding/updating user:', err);
        alert(err.response?.data?.error || 'Failed to save user');
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setShowUserModal(false);
      resetUserForm();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{editingUserId ? 'Edit User' : 'Add User'}</h3>
            <button 
              className="modal-close" 
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter username"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter user email"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              className="form-input"
            />
          </div>
          {!editingUserId && (
            <div className="form-group password-group">
              <input
                type={localShowPassword ? 'text' : 'password'}
                placeholder="Enter user password"
                value={localPassword}
                onChange={(e) => setLocalPassword(e.target.value)}
                className="form-input"
              />
              <button 
                type="button" 
                onClick={() => setLocalShowPassword(!localShowPassword)}
                className="toggle-password"
              >
                {localShowPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}
          <div className="form-group">
            <select value={localRole} onChange={(e) => setLocalRole(e.target.value)} className="form-select">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="blogger">Blogger</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingUserId ? 'Update User' : 'Add User'}
            </button>
            <button 
              onClick={handleClose} 
              className="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EventModal = () => {
    const [localTitle, setLocalTitle] = useState(title);
    const [localDescription, setLocalDescription] = useState(description);
    const [localImage, setLocalImage] = useState(image);
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);

    // Sync with parent state when modal opens
    React.useEffect(() => {
      setLocalTitle(title);
      setLocalDescription(description);
      setLocalImage(image);
      setLocalStartDate(startDate);
      setLocalEndDate(endDate);
    }, []); // Empty dependency array - only run once when modal opens

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!localTitle || !localDescription || !localStartDate || !localEndDate) {
        alert("Please fill in all required fields");
        return;
      }

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', localTitle);
        formData.append('description', localDescription);
        formData.append('startDate', localStartDate);
        formData.append('endDate', localEndDate);
        if (localImage) {
          formData.append('image', localImage);
        }

        const response = await fetch(`${API_BASE}/events`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to create event');

        const newEvent = await response.json();
        const eventWithFullImagePath = {
          ...newEvent,
          image: newEvent.image ? `${SERVER_BASE}${newEvent.image}` : null,
        };
        
        setEvents(prev => [...prev, eventWithFullImagePath]);
        
        // Update parent state
        setTitle(localTitle);
        setDescription(localDescription);
        setImage(localImage);
        setStartDate(localStartDate);
        setEndDate(localEndDate);
        
        resetEventForm();
        setShowEventModal(false);
        alert('Event created successfully!');
      } catch (err) {
        setError(err.message);
        console.error('Error creating event:', err);
        alert('Failed to create event');
      } finally {
        setLoading(false);
      }
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      setLocalImage(file);
    };

    const handleClose = () => {
      setShowEventModal(false);
      resetEventForm();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Add Event</h3>
            <button 
              className="modal-close" 
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Event Title" 
                value={localTitle} 
                onChange={(e) => setLocalTitle(e.target.value)} 
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <textarea 
                placeholder="Event Description" 
                value={localDescription} 
                onChange={(e) => setLocalDescription(e.target.value)} 
                className="form-textarea"
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="file" 
                onChange={handleImageUpload} 
                className="form-input"
                accept="image/*"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  value={localStartDate} 
                  onChange={(e) => setLocalStartDate(e.target.value)} 
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  value={localEndDate} 
                  onChange={(e) => setLocalEndDate(e.target.value)} 
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Event'}
              </button>
              <button 
                type="button" 
                onClick={handleClose} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const BlogModal = () => {
    const [localBlogInput, setLocalBlogInput] = useState(blogInput);

    // Sync with parent state when modal opens
    React.useEffect(() => {
      setLocalBlogInput(blogInput);
    }, []); // Empty dependency array - only run once when modal opens

    const handleSubmit = async () => {
      if (!localBlogInput.title || !localBlogInput.snippet || !localBlogInput.Description || !localBlogInput.image) {
        alert("Please fill all fields including image");
        return;
      }

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("title", localBlogInput.title);
        formData.append("snippet", localBlogInput.snippet);
        formData.append("description", localBlogInput.Description);
        formData.append("image", localBlogInput.image);
        
        // ✅ Automatically add author field with logged-in user's name
        const authorName = user?.username || 'Unknown Author';
        formData.append("author", authorName);
        
        console.log("📤 Sending blog data with author:", authorName);

        const res = await axios.post(`${API_BASE}/blogs`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Add the new blog with proper image path
        const newBlog = {
          ...res.data,
          image_url: res.data.image_url ? `${SERVER_BASE}${res.data.image_url}` : null,
        };
        
        setBlogs(prev => [...prev, newBlog]);
        
        // Update parent state
        setBlogInput(localBlogInput);
        
        resetBlogForm();
        setShowBlogModal(false);
        alert("✅ Blog added successfully");
      } catch (err) {
        console.error("Error adding blog:", err);
        alert("❌ Failed to add blog");
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setShowBlogModal(false);
      resetBlogForm();
    };

    const updateLocalBlogInput = (field, value) => {
      setLocalBlogInput(prev => ({
        ...prev,
        [field]: value
      }));
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Add Blog</h3>
            <button 
              className="modal-close" 
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          {/* Display current author info */}
          <div className="author-info">
            <p><strong>Author:</strong> {user?.username || 'Unknown Author'}</p>
            <small>This will be automatically saved as the blog author</small>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Blog title"
              value={localBlogInput.title}
              onChange={(e) => updateLocalBlogInput('title', e.target.value)}
              className="form-input"
            />
          </div>
        <div className="form-group">
  <input
    type="text"
    placeholder="Snippet (max 150 characters)"
    value={localBlogInput.snippet}
    onChange={(e) => {
      if (e.target.value.length <= 150) {
        updateLocalBlogInput('snippet', e.target.value);
      }
    }}
    className="form-input"
    maxLength={150}
  />
  <div className="character-count">
    {localBlogInput.snippet?.length || 0}/150
  </div>
</div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={localBlogInput.Description}
              onChange={(e) => updateLocalBlogInput('Description', e.target.value)}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  updateLocalBlogInput('image', file);
                  updateLocalBlogInput('imagePreview', URL.createObjectURL(file));
                }
              }}
              className="form-input"
            />
          </div>
          {localBlogInput.imagePreview && (
            <div className="image-preview">
              <img
                src={localBlogInput.imagePreview}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}
          <div className="form-actions">
            <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Blog'}
            </button>
            <button 
              onClick={handleClose} 
              className="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'user':
        return (
          <div className="user-management">
            <div className="section-header">
              <h2 className='title'>User Management</h2>
              <button 
                className="btn-primary add-btn" 
                onClick={() => {
                  resetUserForm();
                  setShowUserModal(true);
                }}
              >
                <FaPlus style={{ marginRight: '8px' }} />
                Add User
              </button>
            </div>
            
            <div className="user-lists">
              <div className="user-list">
                <h2 className="user-list-title">Admin Users ({admins.length})</h2>
                <ul>
                  {admins.map((user) => (
                    <li key={user.id} className="user-item-small">
                      <div className="user-info-small">
                        <strong className="user-name">{user.username}</strong> - <span className="user-email">{user.email}</span>
                      </div>
                      <div className="user-actions-small">
                         <button 
                           className={`btn-small ${editingUserId === user.id ? 'btn-edit-active' : ''}`} 
                           onClick={() => handleEditUser(user)}
                           disabled={loading}
                         >
                           <FaEdit />
                         </button>
                         <button className="btn-small btn-danger" onClick={() => handleDeleteUser(user.id)} disabled={loading}>
                           <FaTrash />
                         </button>
                       </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="user-list">
                <h2 className="user-list-title">Blogger Users ({bloggers.length})</h2>
                <ul>
                  {bloggers.map((user) => (
                    <li key={user.id} className="user-item-small">
                      <div className="user-info-small">
                        <strong className="user-name">{user.username}</strong> - <span className="user-email">{user.email}</span>
                      </div>
                         <div className="user-actions-small">
                           <button 
                             className={`btn-small ${editingUserId === user.id ? 'btn-edit-active' : ''}`} 
                             onClick={() => handleEditUser(user)}
                             disabled={loading}
                           >
                             <FaEdit />
                           </button>
                           <button className="btn-small btn-danger" onClick={() => handleDeleteUser(user.id)} disabled={loading}>
                             <FaTrash />
                           </button>
                         </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
   
      case 'Events':
        return (
          <div className="events-management">
            <div className="section-header">
              <h2 className='title'>Event Management</h2>
              <button 
                className="btn-primary add-btn" 
                onClick={() => {
                  resetEventForm();
                  setShowEventModal(true);
                }}
              >
                <FaPlus style={{ marginRight: '8px' }} />
                Add Event
              </button>
            </div>

            <div className="event-grid-square">
              {events.length > 0 ? (
                events.map((event) => {
                  const isExpanded = expandedEvents[event.id];
                  const displayDescription = isExpanded 
                    ? event.description 
                    : truncateText(event.description || 'No description available', 4);
                  const shouldShowReadMore = (event.description || '').split('\n').length > 4;
                  
                  return (
                    <div className="event-square-card" key={event.id}>
                      {event.image && (
                        <div className="square-image-container">
                          <img src={event.image} alt={event.title} className="square-event-image" />
                        </div>
                      )}
                      <div className="square-card-content">
                        <h3>{event.title}</h3>
                        <p className="event-description">{displayDescription}</p>
                        {shouldShowReadMore && (
                          <span 
                            className="read-more-text"
                            onClick={() => toggleEventExpanded(event.id)}
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </span>
                        )}
                        <p className="event-date">
                          Start: {formatEventDate(event.startdate || event.start_date)}
                        </p>
                        {event.end_date && (
                          <p className="event-date">
                            End: {formatEventDate(event.end_date || event.endDate)}
                          </p>
                        )}
                        <div className="event-actions">
                          <button 
                            className={`btn-small ${event.is_approved ? 'btn-disabled' : ''}`} 
                            onClick={() => handleApproveEvent(event.id)} 
                            disabled={event.is_approved || loading}
                          >
                            {event.is_approved ? 'Approved' : 'Approve'}
                          </button>
                          <button
                            className={`btn-small ${event.published ? 'btn-disabled' : ''}`}
                            onClick={() => handlePublishEvent(event.id)}
                            disabled={!event.is_approved || event.published || loading}
                          >
                            {event.published ? 'Published' : 'Publish'}
                          </button>
                          <button 
                            className="btn-small btn-danger" 
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-events-square">
                  <p>No events found</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="blog-management">
            <div className="section-header">
              <h2 className="title">Blog Management</h2>
              <button 
                className="btn-primary add-btn" 
                onClick={() => {
                  resetBlogForm();
                  setShowBlogModal(true);
                }}
              >
                <FaPlus style={{ marginRight: '8px' }} />
                Add Blog
              </button>
            </div>

            <div className="blog-grid-square">
              {blogs.length > 0 ? (
                blogs.map((blog) => {
                  const isExpanded = expandedBlogs[blog.id];
                  const displayDescription = isExpanded 
                    ? blog.description 
                    : truncateText(blog.description || 'No description available', 4);
                  const shouldShowReadMore = (blog.description || '').split('\n').length > 4;
                  
                  return (
                    <div className="blog-square-card" key={blog.id}>
                      {blog.image_url && (
                        <div className="square-image-container">
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="square-blog-image"
                          />
                        </div>
                      )}
                      <div className="square-card-content">
                        <h3>{blog.title}</h3>
                        <p className="blog-snippet">{blog.snippet}</p>
                        <p className="blog-description">{displayDescription}</p>
                        
                        {/* Display author information */}
                        <div className="blog-author">
                          <strong>Author:</strong> {blog.author || 'Unknown Author'}
                        </div>
                        
                        {shouldShowReadMore && (
                          <span 
                            className="read-more-text"
                            onClick={() => toggleBlogExpanded(blog.id)}
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </span>
                        )}

                        <div className="blog-actions">
                          <button
                            className={`btn-small ${blog.approved ? "btn-disabled" : ""}`}
                            onClick={() => handleApproveBlog(blog.id)}
                            disabled={blog.approved || loading}
                          >
                            {blog.approved ? "Approved" : "Approve"}
                          </button>
                          <button
                            className={`btn-small ${blog.published ? "btn-disabled" : ""}`}
                            onClick={() => handlePublishBlog(blog.id)}
                            disabled={!blog.approved || blog.published || loading}
                          >
                            {blog.published ? "Published" : "Publish"}
                          </button>
                          <button
                            className="btn-small btn-danger"
                            onClick={() => handleDeleteBlog(blog.id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-blogs-square">
                  <p>No blogs found</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2>Admin Dashboard</h2>
        </div>
        
        <div className="navbar-center">
          <span className="version-badge">V.1.0.0.1</span>
        </div>
        
        <div className="navbar-right">
          <div className="navbar-profile">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{ color: '#333' }}
            >
              <FaUser style={{ color: '#333', fontSize: '20px' }} />
            </button>
            
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-content">
                  <h4>Profile Details</h4>
                  <div className="profile-info">
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                  </div>
                  
                  {editable ? (
                    <div className="edit-profile-form">
                      <div className="form-group">
                        <label>Username:</label>
                        <input 
                          type="text" 
                          value={editData.username} 
                          onChange={(e) => setEditData({ ...editData, username: e.target.value })} 
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Email:</label>
                        <input 
                          type="email" 
                          value={editData.email} 
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>New Password:</label>
                        <input 
                          type="password" 
                          placeholder="Leave blank to keep current password"
                          onChange={(e) => setEditData({ ...editData, password: e.target.value })} 
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          onClick={handleSaveEdit}
                          className="btn-primary"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => setEditable(false)}
                          className="btn-secondary"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="dropdown-actions">
                      <button 
                        onClick={() => {
                          setEditData(user || { username: '', email: '', role: '', password: '' });
                          setEditable(true);
                        }}
                        className="btn-primary"
                      >
                        Edit Profile
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="btn-danger logout-btn"
                      >
                        <FaSignOutAlt style={{ marginRight: '8px' }} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Sidebar */}
        <div className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            onClick={() => setActiveView('user')} 
            className={activeView === 'user' ? 'sidebar-btn active' : 'sidebar-btn'}
          >
            <FaUsers style={{ marginRight: '10px' }} />
            Admin/Blogger
          </button>
          <button 
            onClick={() => setActiveView('Events')} 
            className={activeView === 'Events' ? 'sidebar-btn active' : 'sidebar-btn'}
          >
            <FaCalendar style={{ marginRight: '10px' }} />
            Events
          </button>
          <button 
            onClick={() => setActiveView('blog')} 
            className={activeView === 'blog' ? 'sidebar-btn active' : 'sidebar-btn'}
          >
            <FaBlog style={{ marginRight: '10px' }} />
            Blog
          </button>
        </div>
        
        {/* Main Content */}
        <div className="dashboard-main">
          <div className="content-area">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUserModal && <UserModal />}
      {showEventModal && <EventModal />}
      {showBlogModal && <BlogModal />}

      <style jsx>{`
        /* Square Card Styles */
        .event-grid-square,
        .blog-grid-square {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 20px 0;
        }

        .event-square-card,
        .blog-square-card {
          background: #151f6d;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .event-square-card:hover,
        .blog-square-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .square-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .square-event-image,
        .square-blog-image {
          width: 65%;
          height: 100%;
          object-fit: fill;
          transition: transform 0.3s ease;
        }

        .event-square-card:hover .square-event-image,
        .blog-square-card:hover .square-blog-image {
          transform: scale(1.05);
        }

        .square-card-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .square-card-content h3 {
          margin: 0 0 12px 0;
          color: white;
          font-size: 1.2rem;
          line-height: 1.4;
        }

        .event-description,
        .blog-description {
          color: #f8f9fa;
          line-height: 1.5;
          margin-bottom: 12px;
          flex: 1;
          font-size: 0.9rem;
        }

        .blog-snippet {
          color: #e9ecef;
          font-style: italic;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .blog-author {
          color: #ffc107;
          font-weight: 600;
          margin-bottom: 12px;
          font-size: 0.9rem;
          padding: 4px 8px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 4px;
          border-left: 3px solid #ffc107;
        }

        .author-info {
          background: #e3f2fd;
          padding: 10px 15px;
          border-radius: 6px;
          margin-bottom: 15px;
          border-left: 4px solid #2196f3;
        }

        .author-info p {
          margin: 0;
          font-weight: 500;
          color: #1565c0;
        }

        .author-info small {
          color: #546e7a;
          font-size: 0.8rem;
        }

        .read-more-text {
          color: #ffc107;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 12px;
          display: inline-block;
          transition: color 0.3s ease;
          font-size: 0.9rem;
        }

        .read-more-text:hover {
          color: #ffd54f;
          text-decoration: underline;
        }

        .event-date {
          color: #e9ecef;
          font-size: 0.85rem;
          margin-bottom: 15px;
        }

        .event-actions,
        .blog-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          flex-wrap: wrap;
        }

        /* User Management Styles */
        .user-item-small {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 18px;
          margin-bottom: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          transition: background-color 0.3s ease;
        }

        .user-item-small:hover {
          background: #e9ecef;
        }

        .user-info-small {
          font-size: 1rem;
          color: #495057;
        }

        .user-name {
          color: #333;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .user-email {
          color: #666;
          font-weight: 500;
        }

        .user-list-title {
          color: #333;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #007bff;
        }

        .user-actions-small {
          display: flex;
          gap: 8px;
        }

        /* Button Styles */
        .btn-small {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
        }

        .btn-disabled {
          background: #6c757d;
          color: white;
          cursor: not-allowed;
        }

        .btn-edit-active {
          background: #28a745;
          color: white;
        }

        /* No Content States */
        .no-events-square,
        .no-blogs-square {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 12px;
          color: #6c757d;
        }

        /* Section Headers */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e9ecef;
        }

        .title {
          color: #333;
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .navbar-center {
          display: flex;
          align-items: center;
        }

        .version-badge {
          margin-left: 60rem;
          color:Black;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .navbar-right {
          display: flex;
          align-items: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .event-grid-square,
          .blog-grid-square {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
          
          .user-item-small {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .user-actions-small {
            align-self: flex-end;
          }

          .navbar-center {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;