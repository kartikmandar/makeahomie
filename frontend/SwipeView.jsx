import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Chip,
    CardActions,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    Stack
} from '@mui/material';
import { keyframes } from '@mui/system';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

// Bee loader animation keyframes
const flyAround = keyframes`
    0% {
        transform: translate(0, 0) rotate(0deg);
    }
    25% {
        transform: translate(80px, -40px) rotate(15deg);
    }
    50% {
        transform: translate(0, -80px) rotate(0deg);
    }
    75% {
        transform: translate(-80px, -40px) rotate(-15deg);
    }
    100% {
        transform: translate(0, 0) rotate(0deg);
    }
`;

const flowerGlow = keyframes`
    0% {
        box-shadow: 0 0 5px #FF9800;
    }
    50% {
        box-shadow: 0 0 15px #FF9800;
    }
    100% {
        box-shadow: 0 0 5px #FF9800;
    }
`;

// BeeLoader Component
const BeeLoader = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '200px',
                height: '200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 4,
                mb: 4
            }}
        >
            {/* Flower */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#FF9800',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: `${flowerGlow} 2s infinite ease-in-out`,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#8B4513',
                    }
                }}
            >
                {/* Petals */}
                {[...Array(8)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            backgroundColor: '#FFEB3B',
                            transform: `rotate(${i * 45}deg) translateX(30px)`,
                        }}
                    />
                ))}
            </Box>

            {/* Bee */}
            <Box
                sx={{
                    position: 'absolute',
                    animation: `${flyAround} 4s infinite ease-in-out`,
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '30px',
                        height: '20px',
                        backgroundColor: '#FFC107',
                        borderRadius: '40%',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'repeating-linear-gradient(90deg, #FFC107, #FFC107 8px, #000 8px, #000 12px)',
                            borderRadius: '40%',
                            opacity: 0.7,
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '-5px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#000',
                            borderRadius: '50%',
                        }
                    }}
                />
                {/* Wings */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '16px',
                        height: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '50%',
                        top: '-5px',
                        right: '2px',
                        animation: 'moveWings 0.2s infinite alternate',
                        '@keyframes moveWings': {
                            '0%': {
                                transform: 'rotate(-20deg)',
                            },
                            '100%': {
                                transform: 'rotate(20deg)',
                            }
                        }
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        width: '16px',
                        height: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '50%',
                        top: '-5px',
                        left: '2px',
                        animation: 'moveWings 0.2s infinite alternate',
                        '@keyframes moveWings': {
                            '0%': {
                                transform: 'rotate(20deg)',
                            },
                            '100%': {
                                transform: 'rotate(-20deg)',
                            }
                        }
                    }}
                />
            </Box>

            <Typography
                variant="h6"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    color: 'text.secondary',
                    fontWeight: 500
                }}
            >
                Buzzing for matches...
            </Typography>
        </Box>
    );
};

// Motivational quotes for study and friendship
const motivationalQuotes = [
    "The best way to predict your future is to create it. — Abraham Lincoln",
    "Alone we can do so little; together we can do so much. — Helen Keller",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. — Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
    "You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
    "The secret of getting ahead is getting started. — Mark Twain",
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
    "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
    "The mind is not a vessel to be filled, but a fire to be kindled. — Plutarch",
    "Learn from yesterday, live for today, hope for tomorrow. — Albert Einstein",
    "A person who never made a mistake never tried anything new. — Albert Einstein",
    "The expert in anything was once a beginner. — Helen Hayes",
    "The best preparation for tomorrow is doing your best today. — H. Jackson Brown Jr.",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go. — Dr. Seuss",
    "Friendship is born at that moment when one person says to another, 'What! You too? I thought I was the only one.' — C.S. Lewis",
    "True friendship comes when the silence between two people is comfortable. — David Tyson",
    "A real friend is one who walks in when the rest of the world walks out. — Walter Winchell",
    "Friendship is the only cement that will ever hold the world together. — Woodrow Wilson",
    "Friends are those rare people who ask how we are and then wait to hear the answer. — Ed Cunningham",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. — Nelson Mandela",
    "Your time is limited, so don't waste it living someone else's life. — Steve Jobs",
    "Life is what happens when you're busy making other plans. — John Lennon",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier. — Mother Teresa",
    "When you reach the end of your rope, tie a knot in it and hang on. — Franklin D. Roosevelt",
    "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. — Helen Keller",
    "It is during our darkest moments that we must focus to see the light. — Aristotle",
    "Do not go where the path may lead, go instead where there is no path and leave a trail. — Ralph Waldo Emerson",
    "You will face many defeats in life, but never let yourself be defeated. — Maya Angelou",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. — Nelson Mandela",
    "In the end, it's not the years in your life that count. It's the life in your years. — Abraham Lincoln",
    "Never let the fear of striking out keep you from playing the game. — Babe Ruth",
    "The way to get started is to quit talking and begin doing. — Walt Disney",
    "If life were predictable it would cease to be life, and be without flavor. — Eleanor Roosevelt",
    "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough. — Oprah Winfrey",
    "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success. — James Cameron",
    "The future depends on what you do today. — Mahatma Gandhi",
    "No matter what people tell you, words and ideas can change the world. — Robin Williams",
    "I have not failed. I've just found 10,000 ways that won't work. — Thomas Edison",
    "It does not matter how slowly you go as long as you do not stop. — Confucius",
    "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time. — Thomas Edison",
    "The only limit to our realization of tomorrow will be our doubts of today. — Franklin D. Roosevelt",
    "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau",
    "Don't cry because it's over, smile because it happened. — Dr. Seuss",
    "Life is a journey, not a destination. — Ralph Waldo Emerson",
    "You miss 100% of the shots you don't take. — Wayne Gretzky",
    "Whether you think you can or you think you can't, you're right. — Henry Ford",
    "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel. — Maya Angelou",
    "Nothing is impossible, the word itself says 'I'm possible'! — Audrey Hepburn"
];

function SwipeView() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quote, setQuote] = useState('');
    const [checkingMatches, setCheckingMatches] = useState(false);
    const [showBeeLoader, setShowBeeLoader] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const fetchMatches = async () => {
        try {
            setCheckingMatches(true);
            setShowBeeLoader(true);

            // First, request the Raspberry Pi to generate matches
            try {
                await axios.post('http://localhost:8000/raspberry-pi/generate-matches', { userId });
                console.log('Match generation request sent to Raspberry Pi');
            } catch (piError) {
                console.error('Error requesting match generation from Raspberry Pi:', piError);
                // Continue with regular match fetching even if Pi request fails
            }

            // Show the bee loader animation for 5 seconds before showing results
            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/match/${userId}`);
                    setMatches(response.data);
                    setShowBeeLoader(false);
                    setCheckingMatches(false);
                } catch (error) {
                    console.error('Error fetching matches:', error);
                    setShowBeeLoader(false);
                    setCheckingMatches(false);
                }
            }, 5000);

        } catch (error) {
            console.error('Error in fetch matches flow:', error);
            setShowBeeLoader(false);
            setCheckingMatches(false);
        }
    };

    const refreshQuote = () => {
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setQuote(randomQuote);
    };

    useEffect(() => {
        const initialLoad = async () => {
            try {
                // First attempt to send user data to Raspberry Pi for processing
                try {
                    await axios.post('http://localhost:8000/raspberry-pi/send-user-data', { userId });
                    console.log('User data sent to Raspberry Pi for processing');
                } catch (piError) {
                    console.warn('Could not communicate with Raspberry Pi:', piError);
                    // Continue with regular match fetching even if Pi communication fails
                }

                const response = await axios.get(`http://localhost:8000/match/${userId}`);
                setMatches(response.data);

                // Select a random motivational quote
                refreshQuote();

                setLoading(false);
            } catch (error) {
                console.error('Error fetching matches:', error);
                setLoading(false);
            }
        };

        initialLoad();
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "background.default"
                }}
            >
                <CircularProgress color="primary" />
                <Typography variant="h6" ml={2}>
                    Loading your matches...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
            <AppBar position="sticky" elevation={1} color="default" sx={{ bgcolor: 'background.paper' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Make a Homie
                    </Typography>
                    <IconButton
                        color="primary"
                        onClick={handleLogout}
                        sx={{ ml: 1 }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 500,
                        mb: 3,
                        textAlign: matches.length ? 'left' : 'center'
                    }}
                >
                    Your Matches
                </Typography>

                {matches.length === 0 ? (
                    <Box>
                        {showBeeLoader ? (
                            <Card variant="outlined" sx={{ p: 5, textAlign: 'center', mt: 4 }}>
                                <BeeLoader />
                            </Card>
                        ) : (
                            <Card variant="outlined" sx={{ p: 5, textAlign: 'center', mt: 4 }}>
                                <Box sx={{ mb: 2 }}>
                                    <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                </Box>
                                <Typography variant="h5" gutterBottom>
                                    No matches found yet!
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={3}>
                                    Check back later for potential buddies. We're working on finding your perfect match.
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SearchIcon />}
                                    onClick={fetchMatches}
                                    disabled={checkingMatches}
                                    sx={{ mt: 2 }}
                                >
                                    {checkingMatches ? 'Checking...' : 'Check for Matches'}
                                </Button>
                            </Card>
                        )}

                        {/* Motivational Quote Card - only show when bee loader is not visible */}
                        {!showBeeLoader && (
                            <Card variant="outlined" sx={{ p: 4, mt: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                <FormatQuoteIcon sx={{ fontSize: 40, mb: 2, opacity: 0.7 }} />
                                <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 2 }}>
                                    {quote}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<RefreshIcon />}
                                    onClick={refreshQuote}
                                    sx={{
                                        borderColor: 'primary.contrastText',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderColor: 'primary.contrastText'
                                        }
                                    }}
                                >
                                    New Quote
                                </Button>
                            </Card>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<RefreshIcon />}
                                onClick={fetchMatches}
                                disabled={checkingMatches}
                            >
                                {checkingMatches ? 'Refreshing...' : 'Refresh Matches'}
                            </Button>
                        </Box>

                        {matches.map((match, index) => (
                            <Card key={index} variant="outlined">
                                <CardContent sx={{ pb: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" component="h2">
                                            {match.matched_with}
                                        </Typography>
                                        <Chip
                                            label={`${(match.score * 100).toFixed(0)}% Match`}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </CardContent>
                                <Divider />
                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                    <Button
                                        onClick={() => navigate(`/chat/${match.matched_with}`)}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<ChatIcon />}
                                    >
                                        Chat Now
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default SwipeView;