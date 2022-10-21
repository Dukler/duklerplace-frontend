import * as IPFSCORE from 'ipfs-core'
type IPFSType = Awaited<ReturnType<typeof IPFSCORE.create>>
let ipfsclient:IPFSType = {} as IPFSType
let ready = false
if(!ready) {
  ipfsclient = await IPFSCORE.create({ repo: "ok" + Math.random() })
  ready = true
}

export default ipfsclient