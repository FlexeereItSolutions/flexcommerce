import mongoose from 'mongoose';

const connectToDatabase = async() => {
    if (mongoose.connection.readyState === 1) {
        console.log('Already connected to the database');
        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
    }
}

export default connectToDatabase;