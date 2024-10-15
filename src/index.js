const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const port = 3000;

// Load Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Middleware to parse JSON
app.use(express.json());

// In-memory data store for pets
let pets = [
    { id: 1, name: 'Buddy', type: 'Dog' },
    { id: 2, name: 'Mittens', type: 'Cat' }
];



// CRUD Operations

// Create a pet
app.post('/api/pets', (req, res) => {
    const newPet = {
        id: pets.length + 1,
        name: req.body.name,
        type: req.body.type
    };
    pets.push(newPet);
    res.status(201).json(newPet);
});

// Read all pets
app.get('/api/pets', (req, res) => {
    res.json(pets);
});

// Read a single pet
app.get('/api/pets/:id', (req, res) => {
    const pet = pets.find(p => p.id === parseInt(req.params.id));
    if (!pet) return res.status(404).send('Pet not found.');
    res.json(pet);
});

// Update a pet
app.put('/api/pets/:id', (req, res) => {
    const pet = pets.find(p => p.id === parseInt(req.params.id));
    if (!pet) return res.status(404).send('Pet not found.');

    pet.name = req.body.name;
    pet.type = req.body.type;
    res.json(pet);
});

// Delete a pet
app.delete('/api/pets/:id', (req, res) => {
    const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id));
    if (petIndex === -1) return res.status(404).send('Pet not found.');

    const deletedPet = pets.splice(petIndex, 1);
    res.json(deletedPet);
});

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
