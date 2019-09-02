type EnvironmentType = 'production' | 'testing' | 'stress' | 'development';

export const env: EnvironmentType = process.env.ENVIRONMENT! as EnvironmentType || 'development';
