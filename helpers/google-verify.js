const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const googleVerify = async (token) => {

    try {

        const ticket = await client.verifyIdToken({

            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = await ticket.getPayload();
        const { name, email, picture } = payload;

        return { 
            nombre: name, 
            email, 
            img: picture 
        }
        
    } catch (error) {
      console.log(error);
    }
 

}

module.exports = googleVerify;

