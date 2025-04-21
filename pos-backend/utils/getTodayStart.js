const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset to 12:00AM
    return today.toISOString();
  };
  