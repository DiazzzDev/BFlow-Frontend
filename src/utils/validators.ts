
export const isValidEmail = (email: string): boolean => {
    if (!email) { return false }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) { return false; }
    if (email.length > 254) { return false; }
    const [localPart, domain] = email.split('@');
    if (localPart.startsWith('.') || localPart.endsWith('.')) { return false; }
    if (localPart.includes('..')) { return false; }
    const domainParts = domain.split('.');
    if (!domainParts.every(part => part.length > 0 && part.length <= 63)) { return false; }
    if (domainParts.some(part => part.startsWith('-') || part.endsWith('-'))) { return false; }
    return true;
};