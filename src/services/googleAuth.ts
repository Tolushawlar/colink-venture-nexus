export const initiateGoogleAuth = async (): Promise<string> => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No auth token');

    const response = await fetch('http://localhost:3000/api/auth/google', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to initiate Google auth');
    }

    const data = await response.json();
    return data.authUrl;
  } catch (error) {
    console.error('Error initiating Google auth:', error);
    throw error;
  }
};

export const createGoogleMeetEvent = async (eventData: {
  summary: string;
  description: string;
  startDateTime: string;
  duration: number;
  attendeeEmail: string;
  attendeeName: string;
}) => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No auth token');

    const response = await fetch('http://localhost:3000/api/appointments/create-meet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      throw new Error('Failed to create Google Meet event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Google Meet event:', error);
    throw error;
  }
};