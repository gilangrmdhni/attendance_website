// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const user = {
  id: 1,
  name: 'Aloy',
  workHourTime: '8:0:0:0',
  date: 'Jumat, 14 Juni 2024',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(user);
}
