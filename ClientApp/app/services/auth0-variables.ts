interface AuthConfig {
    clientID: string;
    domain: string;
    callbackURL: string;
  }
  
  export const AUTH_CONFIG: AuthConfig = {    
    clientID: 'UAdOpaoihjqbOkRb8gZUd2aeK3S0QhIt',
    domain: 'electrisim.eu.auth0.com',
    callbackURL: 'http://localhost:5000/callback'
  };
  