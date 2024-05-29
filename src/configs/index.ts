export const JWT_ACCESS_SECRET = () => process.env.JWT_SECRET || 'bigSecret'
export const JWT_REFRESH_SECRET = () => process.env.JWT_REFRESH || 'evenBiggerSecret'