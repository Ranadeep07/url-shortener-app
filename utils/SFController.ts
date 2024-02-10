const nforce = require('nforce');

export const getSFOrgInstance = () => {
  return nforce.createConnection({
    grantType: process.env.GRANT_TYPE,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: "",
    apiVersion: "v58.0", // optional, defaults to current salesforce API version
    environment: "production", // optional, salesforce 'sandbox' or 'production', production default
    mode: "single", // optional, 'single' or 'multi' user mode, multi default,
  });
};

export const authenticateOrg = (connectionInstance: any) => {
  // single-user mode
  connectionInstance.authenticate(
    { username: process.env.SF_UN, password: process.env.SF_PASS },
    (err: any, resp: any) => {
      // the oauth object was stored in the connection object
      if (!err) {
        console.log(connectionInstance.oauth.access_token);
      }
      return connectionInstance;
    }
  );
};

export const initializeSObject = (objName: String) => {
  return nforce.createSObject(objName);
};

export const insertRecord = (SObject: any, org: any) => {
  org.insert(
    { sobject: SObject, oauth: org.oauth },
    function (err: any, resp: any) {
      if (!err) return resp;
      else console.log(err);
    }
  );
};

export const queryData = (query: string, org: any) => {
  org.query({ query: query }, (err: any, resp: any) => {
    if (!err && resp.records) {
      return resp.records;
    }
  });
};
