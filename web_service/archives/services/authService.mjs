const login = async (dbCLient, username, password) => {
    try {
        const query = `
           SELECT * FROM AD_User WHERE Name = $1 AND Password = $2 AND IsActive = 'Y' 
        `;

        const result = await dbCLient.query(query, [username, password]);
        return result;
    } catch (error) {
        throw new Error('Failed to fetch ad_users');
    }
}

export default {
    login,
}