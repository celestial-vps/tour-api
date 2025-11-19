import * as bcrypt from 'bcryptjs'; // Import bcryptjs

// Encode (hash) the password
export function encodePassword(rawPassword: string): string {
    const salt = bcrypt.genSaltSync(10); // You can specify the number of rounds (e.g., 10)
    return bcrypt.hashSync(rawPassword, salt); // Hash the password
}

// Compare the raw password with the hashed password
export function comparePassword(rawPassword: string, hash: string): boolean {
    return bcrypt.compareSync(rawPassword, hash); // Compare the password
}
