export const formatDate = (date) => {
    const dateObject = new Date(date);
    console.log(dateObject);
    return dateObject.toLocaleDateString();
}