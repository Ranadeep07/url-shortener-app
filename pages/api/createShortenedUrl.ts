// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import {
  getSFOrgInstance,
  initializeSObject,
  insertRecord,
} from "@/utils/SFController";

type Data = {
  uniqueId: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const uniqueId = nanoid(6);
    console.log(uniqueId);
    const org = getSFOrgInstance();
    authenticateOrgAndCreateRecord(org, uniqueId, req?.body?.url, res);
  }
}

//Handler method for authenicating with the org and create record
const authenticateOrgAndCreateRecord = (
  connectionInstance: any,
  uniqueId: string,
  redirUrl: string,
  res: NextApiResponse<Data>
) => {
  const urlExistenceCheckQuery = `SELECT id,name,Unique_Id__c,Redirection_URL__c FROM URL__c WHERE Redirection_URL__c='${redirUrl}' LIMIT 1`;
  // single-user mode
  connectionInstance.authenticate(
    { username: process.env.SF_UN, password: process.env.SF_PASS },
    async (err: any, resp: any) => {
      // If the shortened url already exists then only returning the unique id else inserting new record
      if (!err) {
        await connectionInstance.query(
          { query: urlExistenceCheckQuery },
          (err: any, resp: any) => {
            console.log("Check1", resp);
            //   if (!err && resp?.records?.length === 0) {
            //     console.log("Check2");
            //     insertRecord(
            //       initializeUrlObj(uniqueId, redirUrl),
            //       connectionInstance
            //     );
            //     return res.status(200).send({ uniqueId });
            //   } else {
            //     console.log('Checkelse')
            //     return res
            //       .status(200)
            //       .send({ uniqueId: '1234' });
            //   }
            // }
            insertRecord(
              initializeUrlObj(uniqueId, redirUrl),
              connectionInstance
            );
            return res.status(200).send({ uniqueId });
          }
        );
      }
    }
  );
};

//Handler method for initializing the URL Instance
const initializeUrlObj = (uniqueId: string, redirUrl: string) => {
  const urlObj = initializeSObject("URL__c");
  urlObj?.set("Unique_Id__c", uniqueId);
  urlObj?.set("Redirection_URL__c", redirUrl);
  return urlObj;
};
