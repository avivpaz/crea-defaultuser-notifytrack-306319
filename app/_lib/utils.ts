export const formatDate = (dateString: string) => {
  try {
    // Use a fixed locale and options to ensure consistent rendering
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Use UTC to ensure consistent rendering
    });
  } catch (error) {
    // Fallback in case of errors
    return dateString;
  }
}; 