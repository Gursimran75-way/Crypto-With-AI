# Test Project

## Backend
- [README](./backend/README.md)

## Frontend
- [README](./frontend/README.md)

  if (isLoading) {
    return (
      <Box
        width="100vw"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }


   if (!data) {
    return (
      <Box
        width="100vw"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h6" textAlign="center" color="error"> Failed to load. Please try again later.</Typography>
      </Box>
    );
  }