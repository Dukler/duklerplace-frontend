import ipfscreate from '../../src/components/ipfscreate'


export default async function handler(req, res) {
  const { cid } = await ipfscreate.add('Hello world2')
  res.status(200).json({ message: cid.toString() })
}