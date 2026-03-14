import mongoose from 'mongoose';

const DATABASE_NAME = 'chat-app';

const getMongoUri = () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

    if (!mongoUri) {
        throw new Error('MongoDB connection string is missing. Set MONGODB_URI or MONGODB_URL in server/.env.');
    }

    const parsedUri = new URL(mongoUri);
    parsedUri.pathname = `/${DATABASE_NAME}`;

    return parsedUri.toString();
};

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(getMongoUri());
    } catch (error) {
        console.error('Database connection failed', error);
        throw error;
    }
};

