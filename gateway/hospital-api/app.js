const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.route');
const bankRoutes = require('./routes/bank.route');
const bedRoutes = require('./routes/bed.route');
const billingRoutes = require('./routes/billing.route');
const departementRoutes = require('./routes/departement.route');
const diseaseRoutes = require('./routes/disease.route');
const doctorRoutes = require('./routes/doctor.route');
const labTestRoutes = require('./routes/lab-test.route');
const medicationCategoryRoutes = require('./routes/medication-category.route');
const medicationRoutes = require('./routes/medication.route');
const medicineRoutes = require('./routes/medicine.route');
const patientRoutes = require('./routes/patient.route');
const patientMedicalRecordRoutes = require('./routes/patient-medical-record.route');
const patientLabTestRoutes = require('./routes/patient-lab-test.route');
const prescriptionRoutes = require('./routes/prescription.route');
const queueRoutes = require('./routes/queue.route');
const roomRoutes = require('./routes/room.route');
const specializationRoutes = require('./routes/specialization.route');
const treatmentRoutes = require('./routes/treatment.route');

const setupSwagger = require('./swagger');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(cors({
  origin: [
    'http://192.168.1.6:4200', 'http://localhost:4200',
    'http://192.168.1.6:4300', 'http://localhost:4300'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

setupSwagger(app);

const uploadsDir = path.join(__dirname, 'public');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak request, coba lagi nanti"
});
app.use(limiter);

const basePath = process.env.BASE_PATH || '/api/v1';
console.log(`Server running on basePath ${basePath}`);

app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/bank`, bankRoutes);

app.use(`${basePath}/bed`, bedRoutes);
app.use(`${basePath}/billing`, billingRoutes);
app.use(`${basePath}/departement`, departementRoutes);
app.use(`${basePath}/disease`, diseaseRoutes);
app.use(`${basePath}/doctor`, doctorRoutes);
app.use(`${basePath}/labTest`, labTestRoutes);
app.use(`${basePath}/medication-category`, medicationCategoryRoutes);
app.use(`${basePath}/medication`, medicationRoutes);
app.use(`${basePath}/medicine`, medicineRoutes);
app.use(`${basePath}/patient`, patientRoutes);
app.use(`${basePath}/patient-medical-record`, patientMedicalRecordRoutes);
app.use(`${basePath}/patient-lab-test`, patientLabTestRoutes);
app.use(`${basePath}/prescription`, prescriptionRoutes);
app.use(`${basePath}/queue`, queueRoutes);
app.use(`${basePath}/room`, roomRoutes);
app.use(`${basePath}/specialization`, specializationRoutes);
app.use(`${basePath}/treatment`, treatmentRoutes);

module.exports = app;
