type EnvironmentType = 'production' | 'testing' | 'stress' | 'development';

export const env: EnvironmentType = process.env.NODEJS_ENV! as EnvironmentType || 'development';
