import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Container,
    AppBar,
    Toolbar,
    IconButton,
    Divider,
    CircularProgress,
    Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Chat() {
    const { matchId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/chat/history/${userId}/${matchId}`);
                setMessages(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setLoading(false);
            }
        };
        fetchMessages();

        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [userId, matchId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('http://localhost:8000/chat/send', {
                sender_id: userId,
                receiver_id: matchId,
                message: newMessage
            });
            setNewMessage('');
            // Refresh messages
            const response = await axios.get(`http://localhost:8000/chat/history/${userId}/${matchId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getInitials = (name) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header */}
            <AppBar position="static" elevation={1} color="default" sx={{ bgcolor: 'background.paper' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate('/swipe')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">
                        Chat with {matchId}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Message Area */}
            <Box sx={{
                flexGrow: 1,
                p: 2,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Typography variant="body1" color="text.secondary">
                            No messages yet. Start the conversation!
                        </Typography>
                    </Box>
                ) : (
                    messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.sender_id === userId ? 'flex-end' : 'flex-start',
                                mb: 1
                            }}
                        >
                            {msg.sender_id !== userId && (
                                <Avatar
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        mr: 1,
                                        width: 32,
                                        height: 32,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {getInitials(msg.sender_id)}
                                </Avatar>
                            )}

                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    maxWidth: '70%',
                                    borderRadius: '16px',
                                    bgcolor: msg.sender_id === userId
                                        ? 'primary.main'
                                        : 'background.paper',
                                    color: msg.sender_id === userId
                                        ? 'primary.contrastText'
                                        : 'text.primary',
                                    borderBottomRightRadius: msg.sender_id === userId ? 0 : '16px',
                                    borderBottomLeftRadius: msg.sender_id !== userId ? 0 : '16px',
                                }}
                            >
                                <Typography variant="body1">{msg.message}</Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        mt: 0.5,
                                        opacity: 0.7
                                    }}
                                >
                                    {new Date(msg.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>

                            {msg.sender_id === userId && (
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        ml: 1,
                                        width: 32,
                                        height: 32,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {getInitials(userId)}
                                </Avatar>
                            )}
                        </Box>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Paper
                elevation={3}
                component="form"
                onSubmit={sendMessage}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: '24px',
                        }
                    }}
                />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={!newMessage.trim()}
                    sx={{
                        borderRadius: '24px',
                        minWidth: '50px',
                        width: '50px',
                        height: '50px',
                        p: 0
                    }}
                >
                    <SendIcon />
                </Button>
            </Paper>
        </Box>
    );
}

export default Chat;