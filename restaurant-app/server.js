const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for your form data
const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  country: { type: String, required: true },
  remember: { type: Boolean, default: false },
}, { timestamps: true });

// Create a model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);

// Serve static files (CSS, images, etc.) from the "public" directory
app.use(express.static('public'));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'restaurant.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Handle form submission for the contact form
app.post('/submit-form', async (req, res) => {
  const { name, email, subject, message, country, remember } = req.body;

  // Create a new instance of the FormData model
  const formData = new FormData({
    name,
    email,
    subject,
    message,
    country,
    remember: Boolean(remember),
  });

  try {
    // Save the form data to MongoDB
    await formData.save();
    res.send('Form data submitted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting form data.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
