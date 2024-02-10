// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  getSFOrgInstance,
  initializeSObject,
  insertRecord,
} from "@/utils/SFController";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const urlParam = req.query;
  console.log(urlParam);
  const query = `SELECT id,name,Unique_Id__c,Redirection_URL__c FROM URL__c WHERE Unique_Id__c='${urlParam.uid}' LIMIT 1`;
  const org = getSFOrgInstance();
  authenticateOrgAndQuery(org, query, res)!;
  // res.status(200).send('Redirected');
}

const authenticateOrgAndQuery = (
  connectionInstance: any,
  query: string,
  res: NextApiResponse
) => {
  // single-user mode
  connectionInstance.authenticate(
    { username: process.env.SF_UN, password: process.env.SF_PASS },
    (err: any, resp: any) => {
      // the oauth object was stored in the connection object
      if (!err) {
        return connectionInstance.query(
          { query: query },
          (err: any, resp: any) => {
            console.log("Query resp ->", resp);
            if (!err && resp.records) {
              res
                .status(200)
                .redirect(resp.records[0]._fields.redirection_url__c);
              insertViewingHistory(
                connectionInstance,
                resp.records[0]._fields.id
              );
            } else {
              console.log(err);
            }
          }
        );
      }
    }
  );
};

const insertViewingHistory = (connectionInstance: any, urlRecordId: string) => {
  const viewHistory = initializeSObject("URL_Visiting_History__c");
  viewHistory.set("Visited_URL__c", urlRecordId);
  insertRecord(viewHistory, connectionInstance);
};
