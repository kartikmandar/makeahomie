import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Grid,
    Alert,
    Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function ProfileForm() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        UserID: userId,
        age: '',
        gender: 'Male',
        department: '',
        preferred_study: 'Individual',
        socialization_preference: 'Active',
        meeting_preference: 'In-Person',
        join_reason: '',
        introvert_scale: 5,
        discussion_level: 5,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        try {
            const combinedText = `${formData.name} is from ${formData.department} department. 
        They prefer ${formData.preferred_study} study and are ${formData.socialization_preference} 
        in socializing. They prefer ${formData.meeting_preference} meetings. 
        Their reason for joining: ${formData.join_reason}`;

            const profileData = {
                ...formData,
                combined_text: combinedText,
            };

            await axios.post('http://localhost:8000/profile/submit', profileData);
            navigate('/swipe');
        } catch (error) {
            console.error('Error submitting profile:', error);
            setError('Failed to submit profile. Please try again.');
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSliderChange = (name) => (e, newValue) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default",
                pt: 4,
                pb: 8
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Avatar
                        sx={{
                            mb: 2,
                            bgcolor: "primary.main",
                            width: 56,
                            height: 56
                        }}
                    >
                        <AccountCircleIcon fontSize="large" />
                    </Avatar>

                    <Typography variant="h4" component="h1" gutterBottom>
                        Create Your Profile
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={3} textAlign="center">
                        Tell us about yourself to find your perfect study buddies
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 18, max: 100 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        label="Gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="study-style-label">Preferred Study Style</InputLabel>
                                    <Select
                                        labelId="study-style-label"
                                        label="Preferred Study Style"
                                        name="preferred_study"
                                        value={formData.preferred_study}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Individual">Individual</MenuItem>
                                        <MenuItem value="Group">Group</MenuItem>
                                        <MenuItem value="Mixed">Mixed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="socialization-label">Socialization Preference</InputLabel>
                                    <Select
                                        labelId="socialization-label"
                                        label="Socialization Preference"
                                        name="socialization_preference"
                                        value={formData.socialization_preference}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Moderate">Moderate</MenuItem>
                                        <MenuItem value="Passive">Passive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="meeting-label">Meeting Preference</InputLabel>
                                    <Select
                                        labelId="meeting-label"
                                        label="Meeting Preference"
                                        name="meeting_preference"
                                        value={formData.meeting_preference}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="In-Person">In-Person</MenuItem>
                                        <MenuItem value="Virtual">Virtual</MenuItem>
                                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Why do you want to join?"
                                    name="join_reason"
                                    value={formData.join_reason}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography gutterBottom>
                                    Introvert Scale (1: Very Introverted, 10: Very Extroverted)
                                </Typography>
                                <Slider
                                    name="introvert_scale"
                                    value={formData.introvert_scale}
                                    onChange={handleSliderChange('introvert_scale')}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={1}
                                    max={10}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography gutterBottom>
                                    Discussion Level (1: Minimal, 10: Very Talkative)
                                </Typography>
                                <Slider
                                    name="discussion_level"
                                    value={formData.discussion_level}
                                    onChange={handleSliderChange('discussion_level')}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={1}
                                    max={10}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Submitting...' : 'Submit Profile'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default ProfileForm;