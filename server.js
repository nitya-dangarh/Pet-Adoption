// server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 9800;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'petmate.cr6iwa6i4rvb.us-east-1.rds.amazonaws.com',
  user: 'petmate',
  password: 'petmate1',
  database: 'petmate',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint for login authentication
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE user = ? AND password = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error authenticating user:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (result.length === 1) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

// API endpoint to fetch users from the database
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM admin';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching users from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Users retrieved from MySQL:', result);
    res.json(result);
  });
});
app.get('/api/pets', (req, res) => {
  const sql = 'SELECT * FROM Pet';
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching pets:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json(result);
  });
});
// API endpoint for pet details
app.get('/api/pets/:petId/details', (req, res) => {
  const petId = req.params.petId;
  const sql = 'SELECT * FROM Pet WHERE PetID = ?';
  db.query(sql, petId, (err, result) => {
      if (err) {
          console.error('Error fetching pet details:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (result.length === 0) {
          res.status(404).json({ error: 'Pet not found' });
      } else {
          res.json(result[0]);
      }
  });
});

// API endpoint to get medical records by pet ID
app.get('/api/pets/:petId/medicalRecords', (req, res) => {
  const petId = req.params.petId;
  const sql = 'SELECT * FROM MedicalRecord WHERE PetID = ?';
  db.query(sql, petId, (err, result) => {
      if (err) {
          console.error('Error fetching medical records:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (result.length === 0) {
          res.status(404).json({ error: 'Medical records not found' });
      } else {
          res.json(result);
      }
  });
});



app.post('/api/pets', (req, res) => {
  const newPet = req.body;
  const sql = 'INSERT INTO Pet SET ?';

  db.query(sql, newPet, (err, result) => {
    if (err) {
      console.error('Error adding pet to MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('New pet added to MySQL:', result);
    res.json({ success: true });
  });
});

// API endpoint to delete a pet
app.delete('/api/pets/:petID', (req, res) => {
  const petID = req.params.petID;
  const sql = 'DELETE FROM Pet WHERE PetID = ?';

  db.query(sql, petID, (err, result) => {
    if (err) {
      console.error('Error deleting pet from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Pet deleted from MySQL:', result);
    res.json({ success: true });
  });
});
// API endpoint to update pet information
app.put('/api/pets/:petID', (req, res) => {
  const petID = req.params.petID;
  const updatedPet = req.body;
  const sql = 'UPDATE Pet SET ? WHERE PetID = ?';

  db.query(sql, [updatedPet, petID], (err, result) => {
    if (err) {
      console.error('Error updating pet in MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Pet updated in MySQL:', result);
    res.json({ success: true });
  });
});

// API endpoint to delete a pet
app.delete('/api/pets/:petID', (req, res) => {
  const petID = req.params.petID;
  const sql = 'DELETE FROM Pet WHERE PetID = ?';

  db.query(sql, petID, (err, result) => {
    if (err) {
      console.error('Error deleting pet from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Pet deleted from MySQL:', result);
    res.json({ success: true });
  });
});
// API endpoints for CRUD operations on pet centers
app.get('/api/petCenters', (req, res) => {
  const sql = 'SELECT * FROM PetCenter';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching pet centers from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
  });
});

app.post('/api/petCenters', (req, res) => {
  const newPetCenter = req.body;
  const sql = 'INSERT INTO PetCenter SET ?';
  db.query(sql, newPetCenter, (err, result) => {
    if (err) {
      console.error('Error adding pet center to MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Pet center added successfully' });
  });
});

app.put('/api/petCenters/:id', (req, res) => {
  const { id } = req.params;
  const updatedPetCenter = req.body;
  const sql = 'UPDATE PetCenter SET ? WHERE PetCenterID = ?';
  db.query(sql, [updatedPetCenter, id], (err, result) => {
    if (err) {
      console.error('Error updating pet center in MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Pet center updated successfully' });
  });
});

// API endpoint to delete a pet center
app.delete('/api/petCenters/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM PetCenter WHERE PetCenterID = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      console.error('Error deleting pet center from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Pet center deleted successfully' });
  });
});
app.get('/api/volunteers', (req, res) => {
  const sql = 'SELECT * FROM Volunteer';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching volunteers from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Volunteers retrieved from MySQL:', result);
    res.json(result);
  });
});

app.post('/api/volunteers', (req, res) => {
  const { VolunteerName, VolunteerPhoneNumber, VolunteerEmail, VolunteerCity, VolunteerState } = req.body;
  const sql = 'INSERT INTO Volunteer (VolunteerName, VolunteerPhoneNumber, VolunteerEmail, VolunteerCity, VolunteerState) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [VolunteerName, VolunteerPhoneNumber, VolunteerEmail, VolunteerCity, VolunteerState], (err, result) => {
    if (err) {
      console.error('Error adding volunteer to MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Volunteer added to MySQL:', result);
    res.json({ success: true });
  });
});

app.put('/api/volunteers/:id', (req, res) => {
  const { VolunteerName, VolunteerPhoneNumber, VolunteerEmail, VolunteerCity, VolunteerState } = req.body;
  const volunteerId = req.params.id;
  const sql = 'UPDATE Volunteer SET VolunteerName = ?, VolunteerPhoneNumber = ?, VolunteerEmail = ?, VolunteerCity = ?, VolunteerState = ? WHERE VolunteerID = ?';

  db.query(sql, [VolunteerName, VolunteerPhoneNumber, VolunteerEmail, VolunteerCity, VolunteerState, volunteerId], (err, result) => {
    if (err) {
      console.error('Error updating volunteer in MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Volunteer updated in MySQL:', result);
    res.json({ success: true });
  });
});

app.delete('/api/volunteers/:id', (req, res) => {
  const volunteerId = req.params.id;
  const sql = 'DELETE FROM Volunteer WHERE VolunteerID = ?';

  db.query(sql, [volunteerId], (err, result) => {
    if (err) {
      console.error('Error deleting volunteer from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Volunteer deleted from MySQL:', result);
    res.json({ success: true });
  });
});
app.get('/api/rescueOrganizations', (req, res) => {
  const sql = 'SELECT * FROM RescueOrganization';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching rescue organizations from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Rescue organizations retrieved from MySQL:', result);
    res.json(result);
  });
});
// API endpoint to add a rescue organization
// API endpoint to add a rescue organization
app.post('/api/rescueOrganizations', (req, res) => {
  const { OrgName, Email, Location, PhoneNumber } = req.body;
  const sql = 'INSERT INTO RescueOrganization (OrgName, Email, Location, PhoneNumber) VALUES (?, ?, ?, ?)';

  db.query(sql, [OrgName, Email, Location, PhoneNumber], (err, result) => {
    if (err) {
      console.error('Error adding rescue organization to MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    console.log('New rescue organization added with ID:', result.insertId);
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// API endpoint to update a rescue organization
app.put('/api/rescueOrganizations/:id', (req, res) => {
  const { id } = req.params;
  const { OrgName, Email, Location, PhoneNumber } = req.body;
  const sql = 'UPDATE RescueOrganization SET OrgName = ?, Email = ?, Location = ?, PhoneNumber = ? WHERE RescueOrgID = ?';

  db.query(sql, [OrgName, Email, Location, PhoneNumber, id], (err, result) => {
    if (err) {
      console.error('Error updating rescue organization in MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Rescue organization updated in MySQL:', result);
    res.json({ success: true });
  });
});
// API endpoint to delete a rescue organization
// API endpoint to delete a rescue organization
app.delete('/api/rescueOrganizations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM RescueOrganization WHERE RescueOrgID = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting rescue organization from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Rescue organization deleted from MySQL:', result);
    res.json({ success: true });
  });
});

// POST: Add Adopter
app.post('/api/adopters', (req, res) => {
  const { AdopterName, AdopterEmail, AdopterPhoneNumber, AdopterStreet, AdopterCity, AdopterState } = req.body;
  const sql = 'INSERT INTO Adopter (AdopterName, AdopterEmail, AdopterPhoneNumber, AdopterStreet, AdopterCity, AdopterState) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [AdopterName, AdopterEmail, AdopterPhoneNumber, AdopterStreet, AdopterCity, AdopterState], (err, result) => {
    if (err) {
      console.error('Error adding adopter:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Adopter added successfully');
    res.status(201).json({ success: true });
  });
});

// GET: Get Adopters
app.get('/api/adopters', (req, res) => {
  const sql = 'SELECT * FROM Adopter';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching adopters:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Adopters retrieved successfully');
    res.json(result);
  });
});

// PUT: Update Adopter
app.put('/api/adopters/:id', (req, res) => {
  const adopterId = req.params.id;
  const { AdopterName, AdopterEmail, AdopterPhoneNumber, AdopterStreet, AdopterCity, AdopterState } = req.body;
  const sql = 'UPDATE Adopter SET AdopterName = ?, AdopterEmail = ?, AdopterPhoneNumber = ?, AdopterStreet = ?, AdopterCity = ?, AdopterState = ? WHERE AdopterID = ?';
  db.query(sql, [AdopterName, AdopterEmail, AdopterPhoneNumber, AdopterStreet, AdopterCity, AdopterState, adopterId], (err, result) => {
    if (err) {
      console.error('Error updating adopter:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Adopter updated successfully');
    res.json({ success: true });
  });
});

// DELETE: Delete Adopter
app.delete('/api/adopters/:id', (req, res) => {
  const adopterId = req.params.id;
  const sql = 'DELETE FROM Adopter WHERE AdopterID = ?';
  db.query(sql, [adopterId], (err, result) => {
    if (err) {
      console.error('Error deleting adopter:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Adopter deleted successfully');
    res.json({ success: true });
  });
});
// Define endpoint to fetch training data
app.get('/api/training', (req, res) => {
  const sql = 'SELECT * FROM Training';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching training data:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
  });
});
app.post('/api/training', (req, res) => {
  const { PetID, Title, Duration, Description, TrainingDate } = req.body;
  const sql = 'INSERT INTO Training (PetID, Title, Duration, Description, TrainingDate) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [PetID, Title, Duration, Description, TrainingDate], (err, result) => {
    if (err) {
      console.error('Error adding training:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Training added successfully');
    res.status(201).json({ success: true });
  });
});

// API endpoint to update an existing training
app.put('/api/training/:id', (req, res) => {
  const trainingId = req.params.id;
  const { Title, Duration, Description, TrainingDate } = req.body;
  const sql = 'UPDATE Training SET Title = ?, Duration = ?, Description = ?, TrainingDate = ? WHERE TrainingID = ?';
  db.query(sql, [Title, Duration, Description, TrainingDate, trainingId], (err, result) => {
    if (err) {
      console.error('Error updating training:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Training updated successfully');
    res.json({ success: true });
  });
});

// API endpoint to delete a training
app.delete('/api/training/:id', (req, res) => {
  const trainingId = req.params.id;
  const sql = 'DELETE FROM Training WHERE TrainingID = ?';
  db.query(sql, [trainingId], (err, result) => {
    if (err) {
      console.error('Error deleting training:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Training deleted successfully');
    res.json({ success: true });
  });
});

// API endpoint to fetch veterinarian
app.get('/api/veterinarian', (req, res) => {
  const sql = 'SELECT * FROM Veterinarian';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching veterinarians:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Veterinarians retrieved from MySQL:', result);
    res.json(result);
  });
});
app.post('/api/veterinarian', (req, res) => {
  const { VetName, Clinic, Specialization, PhoneNumber, Email } = req.body;
  const sql = 'INSERT INTO Veterinarian (VetName, Clinic, Specialization, PhoneNumber, Email) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [VetName, Clinic, Specialization, PhoneNumber, Email], (err, result) => {
    if (err) {
      console.error('Error adding veterinarian:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(201).json({ message: 'Veterinarian added successfully' });
  });
});
app.put('/api/veterinarian/:id', (req, res) => {
  const vetID = req.params.id;
  const { VetName, Clinic, Specialization, PhoneNumber, Email } = req.body;
  const sql = 'UPDATE Veterinarian SET VetName = ?, Clinic = ?, Specialization = ?, PhoneNumber = ?, Email = ? WHERE VetID = ?';

  db.query(sql, [VetName, Clinic, Specialization, PhoneNumber, Email, vetID], (err, result) => {
    if (err) {
      console.error('Error updating veterinarian:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Veterinarian updated successfully' });
  });
});
app.delete('/api/veterinarian/:id', (req, res) => {
  const vetID = req.params.id;
  const sql = 'DELETE FROM Veterinarian WHERE VetID = ?';

  db.query(sql, [vetID], (err, result) => {
    if (err) {
      console.error('Error deleting veterinarian:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Veterinarian deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
