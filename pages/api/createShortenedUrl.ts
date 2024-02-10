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
    authenticateOrgAndCreateRecord(org, uniqueId, req?.body?.url);

    return res.status(200).send({ uniqueId });
  }
}

const authenticateOrgAndCreateRecord = (connectionInstance: any, uniqueId: string, redirUrl: string) => {
  // single-user mode
  connectionInstance.authenticate(
    { username: process.env.SF_UN, password: process.env.SF_PASS },
    (err: any, resp: any) => {
      // the oauth object was stored in the connection object
      if (!err) { 
        insertRecord(initializeUrlObj(uniqueId, redirUrl), connectionInstance);
      }
    }
  );
};

const initializeUrlObj = (uniqueId: string, redirUrl: string) => {
  const urlObj = initializeSObject("URL__c");
  urlObj?.set("Unique_Id__c", uniqueId);
  urlObj?.set("Redirection_URL__c", redirUrl);
  return urlObj;
};
