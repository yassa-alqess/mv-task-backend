// database errors
export const DUPLICATE_ERR = "23505"
export const INVALID_UUID = "22P02"

// auth constants
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ""
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ""
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m"
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d"
export const OTT_SECRET = process.env.OTT_SECRET || ""
export const OTT_EXPIRY = process.env.OTT_EXPIRY || "3m"


// mail constants
export const MAIL_HOST = process.env.MAIL_HOST || ""
export const MAIL_USER = process.env.MAIL_USER || ""
export const MAIL_PASS = process.env.MAIL_PASS || ""
export const MAIL_PORT = process.env.MAIL_PORT || ""



// paths
export const AUTH_PATH = "auth"
export const LEADS_PATH = "leads"


export const ENV = process.env.NODE_ENV || 'dev';
export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || ""
export const DATABASE_NAME = process.env.DATABASE_NAME || ""
export const SCHEMA = process.env.SCHEMA || ""
export const REDIS_URL = process.env.REDIS_URL || ""
export const DOMAIN = process.env.DOMAIN;
