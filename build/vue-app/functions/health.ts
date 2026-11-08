export const onRequestGet = async (context: {
  env: { DB?: unknown; JWT_SECRET?: unknown }
}) => {
  return new Response(
    JSON.stringify({
      envKeys: Object.keys(context.env ?? {}).sort(),
      hasDB: !!context.env?.DB,
      hasJwtSecret: !!context.env?.JWT_SECRET,
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  )
}
