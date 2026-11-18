import{createHash}from'node:crypto';
export function assertTranslationSource(source,manifest){
 if(source?.schema!==1||source.serverVersion!==manifest.serverVersion||!Array.isArray(source.items)||source.items.length!==manifest.itemCount||new Set(source.items.map(row=>row?.id)).size!==manifest.itemCount||createHash('sha256').update(JSON.stringify(source.items)).digest('hex')!==manifest.projectionSha256)throw Error('SOURCE_PROJECTION_MISMATCH');
}
