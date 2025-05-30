import { Request, Response } from 'express';
import { consolidateContact } from '../utils/contactHelper';

export const handleIdentify = async (req: Request, res: Response) => {
  try {
    const result = await consolidateContact(req.body);
    res.status(200).json({ contact: result });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
