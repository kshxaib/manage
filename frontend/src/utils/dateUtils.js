export const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
};
