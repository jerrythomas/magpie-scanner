export function parseEpisode(
  filename,
  episodeDigits = 2,
  separator = '\\s*-?\\s*'
) {
  // Construct the regex dynamically based on episodeDigits
  const pattern = `^(.+?)${separator}[S|s]?(\\d+?)[E|e]?(\\d{${episodeDigits}})${separator}(.+?)\\.(\\w+)$`
  const regex = new RegExp(pattern)
  const match = filename.match(regex)

  if (!match) {
    throw new Error('Filename format does not match the expected pattern')
  }

  return {
    series: match[1],
    season: parseInt(match[2], 10),
    episode: parseInt(match[3], 10),
    title: match[4].replace(/^\(/, '').replace(/\)$/, ''),
    format: match[5],
  }
}

// import { sqlToDBML, parse } from 'dbml-parser' // hypothetical import, the actual import might be different
export function parseSQL(sqlContent) {
  const lines = sqlContent.split('\n')
  let currentSchema = null
  let tableName = null
  let referencedTables = []

  lines.forEach((line) => {
    line = line.trim()

    // Find schema
    if (line.startsWith('set search_path to')) {
      const schemaMatch = line.match(/set search_path to (.+);/)
      if (schemaMatch && schemaMatch[1]) {
        const schemas = schemaMatch[1].split(',').map((s) => s.trim())
        currentSchema = schemas[0] // The first one is the schema for the table being created
      }
    }

    // Find table name
    if (line.startsWith('create table if not exists')) {
      const tableMatch = line.match(/create table if not exists (\w+)/)
      if (tableMatch && tableMatch[1]) {
        tableName = tableMatch[1]
      }
    }

    // TODO: Parsing logic for referenced tables can be added here
  })

  return {
    schema: currentSchema,
    tableName,
    referencedTables, // An array that could be populated when parsing logic for references is added
  }
}

// function parseSQLToDBML(sqlContent) {
//   // Convert SQL to DBML using a library function
//   const dbmlContent = sqlToDBML(sqlContent)

//   // Now parse the DBML content to a JSON-like object
//   const dbmlObject = parse(dbmlContent)

//   // Extract information
//   const schema = dbmlObject.schema || null
//   const tables = dbmlObject.tables || []
//   const referencedTables = [] // populate this based on the parsed DBML object

//   // Extract table names, schema, and references based on the DBML object
//   tables.forEach((table) => {
//     // ... your logic here
//   })

//   return {
//     schema,
//     tables,
//     referencedTables,
//   }
// }
